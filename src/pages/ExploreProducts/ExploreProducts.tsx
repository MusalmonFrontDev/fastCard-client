import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { FavoriteBorder, Visibility, ArrowForwardIos, FilterList, Close } from '@mui/icons-material';
import api from '../../lib/axios';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { toggleWishlist, addToCart, type Product } from '../../store/shopSlice';
import { useTranslation } from 'react-i18next';

interface Brand {
  id: number;
  brandName: string;
}

export default function ExploreProducts(): ReactNode {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const wishlistItems = useSelector((state: RootState) => state.shop.wishlistItems);


  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [collapseState, setCollapseState] = useState({
    category: true,
    brands: true,
    features: true,
    price: true,
    condition: true,
    ratings: true,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("All products");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string>("Any");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("Popular");

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const [visibleCount, setVisibleCount] = useState<number>(9);

  const BASE_IMAGE_URL = 'https://fastcard-1-o23z.onrender.com/images/';

  useEffect(() => {
    setLoading(true);
    api.get('https://fastcard-1-o23z.onrender.com/api/Brand/get-brands')
      .then(res => {
        const json = res.data;
        const brandsList = json.data?.brands || json.brands || json.data || [];
        const seenNames = new Set();
        const uniqueBrands: Brand[] = [];
        for (const brand of brandsList) {
          if (!seenNames.has(brand.brandName)) {
            seenNames.add(brand.brandName);
            uniqueBrands.push(brand);
          }
        }
        setBrands(uniqueBrands);
      })
      .catch(err => console.error(err));

    api.get('https://fastcard-1-o23z.onrender.com/api/Product/get-products')
      .then(res => {
        const json = res.data;
        const rawData = json.data?.products || json.data || json.products || json;
        setProducts(Array.isArray(rawData) ? rawData : []);
      })
      .catch(err => {
        console.error(err);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getProductImage = (product: Product) => {
    if (product?.image) return `${BASE_IMAGE_URL}${product.image}`;
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) return `${BASE_IMAGE_URL}${product.images[0]}`;
    if (product?.productImages && Array.isArray(product.productImages) && product.productImages.length > 0) return `${BASE_IMAGE_URL}${product.productImages[0].image || product.productImages[0]}`;
    if (typeof product?.productImages === 'string') return `${BASE_IMAGE_URL}${product.productImages}`;
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80';
  };

  const getCategoryName = (product: Product): string => {
    const title = product.productName.toLowerCase();
    if (title.includes("cooler") || title.includes("monitor") || title.includes("keyboard") || title.includes("camera") || title.includes("dslr") || title.includes("laptop") || title.includes("gamepad") || title.includes("gaming") || title.includes("rog") || title.includes("wired")) {
      return "Electronics";
    }
    if (title.includes("jacket") || title.includes("shoes") || title.includes("cleats") || title.includes("bag") || title.includes("duffle") || title.includes("soccer")) {
      return "Sports & Outdoor";
    }
    if (title.includes("curology") || title.includes("product set") || title.includes("skincare") || title.includes("medicine")) {
      return "Medicine";
    }
    return "Home & Lifestyle";
  };

  const getProductBrandName = (product: Product): string => {
    const matchedBrand = brands.find(b => b.id === product.brandId);
    if (matchedBrand) return matchedBrand.brandName;
    const title = product.productName.toLowerCase();
    if (title.includes("gucci")) return "Gucci";
    if (title.includes("canon")) return "Canon";
    if (title.includes("asus")) return "Asus";
    if (title.includes("havit")) return "Havit";
    if (title.includes("samsung")) return "Samsung";
    if (title.includes("apple") || title.includes("14pm")) return "Apple";
    if (title.includes("lenovo")) return "Lenovo";
    return "Generic";
  };

  const getProductFeatures = (product: Product): string[] => {
    const features: string[] = [];
    const title = product.productName.toLowerCase();
    if (title.includes("gaming") || title.includes("laptop") || title.includes("monitor") || title.includes("dslr")) {
      features.push("Metallic");
    }
    if (title.includes("car") || title.includes("cleats") || title.includes("gamepad") || title.includes("keyboard")) {
      features.push("Plastic cover");
    }
    if (title.includes("laptop") || title.includes("monitior") || title.includes("rog")) {
      features.push("8GB Ram");
      features.push("Large Memory");
    }
    if (title.includes("dslr") || title.includes("car") || title.includes("cooler")) {
      features.push("Super power");
    }
    return features;
  };

  const getProductCondition = (product: Product): string => {
    if (product.id % 4 === 0) return "Refurbished";
    if (product.id % 4 === 1) return "Brand new";
    if (product.id % 4 === 2) return "Old items";
    return "Brand new";
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== "All products") {
      const cat = getCategoryName(product);
      if (cat !== selectedCategory) return false;
    }

    if (selectedBrands.length > 0) {
      const bName = getProductBrandName(product).toLowerCase();
      const match = selectedBrands.some(b => bName.includes(b.toLowerCase()) || b.toLowerCase().includes(bName));
      if (!match) return false;
    }

    if (selectedFeatures.length > 0) {
      const pFeat = getProductFeatures(product);
      const hasAll = selectedFeatures.every(f => pFeat.includes(f));
      if (!hasAll) return false;
    }

    const hasDiscount = product.hasDiscount || (product.discountPrice !== undefined && product.discountPrice > 0);
    let currentPrice = product.price;
    if (hasDiscount && product.discountPrice) {
      currentPrice = product.discountPrice < product.price ? product.discountPrice : product.price;
    }
    if (appliedMinPrice !== null && currentPrice < appliedMinPrice) return false;
    if (appliedMaxPrice !== null && currentPrice > appliedMaxPrice) return false;

    if (selectedCondition !== "Any") {
      const cond = getProductCondition(product);
      if (cond !== selectedCondition) return false;
    }

    if (selectedRating !== null) {
      const rating = product.rating || 5;
      if (rating < selectedRating) return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const hasDiscountA = a.hasDiscount || (a.discountPrice !== undefined && a.discountPrice > 0);
    let priceA = a.price;
    if (hasDiscountA && a.discountPrice) {
      priceA = a.discountPrice < a.price ? a.discountPrice : a.price;
    }

    const hasDiscountB = b.hasDiscount || (b.discountPrice !== undefined && b.discountPrice > 0);
    let priceB = b.price;
    if (hasDiscountB && b.discountPrice) {
      priceB = b.discountPrice < b.price ? b.discountPrice : b.price;
    }

    if (sortBy === "Price: Low to High") return priceA - priceB;
    if (sortBy === "Price: High to Low") return priceB - priceA;
    if (sortBy === "Rating: High to Low") return (b.rating || 5) - (a.rating || 5);
    
    return (b.reviewsCount || 0) - (a.reviewsCount || 0);
  });

  const toggleCollapse = (filter: keyof typeof collapseState) => {
    setCollapseState(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  const handleBrandChange = (brandName: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]
    );
  };

  const handleFeatureChange = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedMinPrice(minPrice !== "" ? parseFloat(minPrice) : null);
    setAppliedMaxPrice(maxPrice !== "" ? parseFloat(maxPrice) : null);
  };

  const handlePriceReset = () => {
    setMinPrice("");
    setMaxPrice("");
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
  };

  const getTranslationKeyForCategory = (cat: string) => {
    if (cat === "All products") return 'explore_cat_all';
    if (cat === "Electronics") return 'explore_cat_electronics';
    if (cat === "Home & Lifestyle") return 'explore_cat_home';
    if (cat === "Medicine") return 'explore_cat_medicine';
    if (cat === "Sports & Outdoor") return 'explore_cat_sports';
    return cat;
  };

  const getTranslationKeyForCondition = (cond: string) => {
    if (cond === "Any") return 'explore_cond_any';
    if (cond === "Refurbished") return 'explore_cond_refurbished';
    if (cond === "Brand new") return 'explore_cond_new';
    if (cond === "Old items") return 'explore_cond_old';
    return cond;
  };

  const renderFiltersContent = () => (
    <div className="flex flex-col gap-6 text-slate-900 dark:text-zinc-100">
      
      <div className="border-b border-gray-100 dark:border-zinc-800 pb-5">
        <button 
          onClick={() => toggleCollapse('category')}
          className="w-full flex items-center justify-between font-bold text-[16px] tracking-wide focus:outline-none cursor-pointer"
        >
          <span>{t('explore_category')}</span>
          <ArrowForwardIos className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${collapseState.category ? 'rotate-90' : ''}`} />
        </button>
        {collapseState.category && (
          <div className="flex flex-col gap-2 mt-4 pl-1 text-[15px]">
            {["All products", "Electronics", "Home & Lifestyle", "Medicine", "Sports & Outdoor"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-left hover:text-[#DB4444] transition-colors cursor-pointer ${selectedCategory === cat ? 'text-[#DB4444] font-semibold' : 'text-gray-600 dark:text-zinc-400'}`}
              >
                {t(getTranslationKeyForCategory(cat))}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-b border-gray-100 dark:border-zinc-800 pb-5">
        <button 
          onClick={() => toggleCollapse('brands')}
          className="w-full flex items-center justify-between font-bold text-[16px] tracking-wide focus:outline-none cursor-pointer"
        >
          <span>{t('explore_brands')}</span>
          <ArrowForwardIos className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${collapseState.brands ? 'rotate-90' : ''}`} />
        </button>
        {collapseState.brands && (
          <div className="flex flex-col gap-3 mt-4 pl-1">
            {["Samsung", "Apple", "Huawei", "Poco", "Lenovo", "Asus", "Canon"].map((brandName) => {
              const isChecked = selectedBrands.includes(brandName);
              return (
                <label key={brandName} className="flex items-center gap-3 cursor-pointer text-[15px] text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleBrandChange(brandName)}
                    className="w-4.5 h-4.5 accent-[#DB4444] dark:accent-red-500 border-gray-300 dark:border-zinc-700 rounded cursor-pointer"
                  />
                  <span>{brandName}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-b border-gray-100 dark:border-zinc-800 pb-5">
        <button 
          onClick={() => toggleCollapse('features')}
          className="w-full flex items-center justify-between font-bold text-[16px] tracking-wide focus:outline-none cursor-pointer"
        >
          <span>{t('explore_features')}</span>
          <ArrowForwardIos className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${collapseState.features ? 'rotate-90' : ''}`} />
        </button>
        {collapseState.features && (
          <div className="flex flex-col gap-3 mt-4 pl-1">
            {["Metallic", "Plastic cover", "8GB Ram", "Super power", "Large Memory"].map((feature) => {
              const isChecked = selectedFeatures.includes(feature);
              return (
                <label key={feature} className="flex items-center gap-3 cursor-pointer text-[15px] text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleFeatureChange(feature)}
                    className="w-4.5 h-4.5 accent-[#DB4444] dark:accent-red-500 border-gray-300 dark:border-zinc-700 rounded cursor-pointer"
                  />
                  <span>{feature}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-b border-gray-100 dark:border-zinc-800 pb-5">
        <button 
          onClick={() => toggleCollapse('price')}
          className="w-full flex items-center justify-between font-bold text-[16px] tracking-wide focus:outline-none cursor-pointer"
        >
          <span>{t('explore_price_range')}</span>
          <ArrowForwardIos className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${collapseState.price ? 'rotate-90' : ''}`} />
        </button>
        {collapseState.price && (
          <form onSubmit={handlePriceApply} className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[11px] text-gray-400 font-semibold uppercase">{t('explore_min')}</span>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full h-10 px-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-[#DB4444]"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[11px] text-gray-400 font-semibold uppercase">{t('explore_max')}</span>
                <input
                  type="number"
                  placeholder="999999"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full h-10 px-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-[#DB4444]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 h-9 bg-[#DB4444] text-white rounded text-xs font-semibold hover:bg-[#c33d3d] cursor-pointer transition-colors border-none"
              >
                {t('explore_apply')}
              </button>
              {(appliedMinPrice !== null || appliedMaxPrice !== null) && (
                <button
                  type="button"
                  onClick={handlePriceReset}
                  className="px-3 h-9 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 text-gray-700 dark:text-zinc-300 rounded text-xs font-semibold cursor-pointer transition-colors border-none"
                >
                  {t('explore_reset')}
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      <div className="border-b border-gray-100 dark:border-zinc-800 pb-5">
        <button 
          onClick={() => toggleCollapse('condition')}
          className="w-full flex items-center justify-between font-bold text-[16px] tracking-wide focus:outline-none cursor-pointer"
        >
          <span>{t('explore_condition')}</span>
          <ArrowForwardIos className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${collapseState.condition ? 'rotate-90' : ''}`} />
        </button>
        {collapseState.condition && (
          <div className="flex flex-col gap-3 mt-4 pl-1">
            {["Any", "Refurbished", "Brand new", "Old items"].map((cond) => (
              <label key={cond} className="flex items-center gap-3 cursor-pointer text-[15px] text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                <input
                  type="radio"
                  name="condition"
                  checked={selectedCondition === cond}
                  onChange={() => setSelectedCondition(cond)}
                  className="w-4.5 h-4.5 accent-[#DB4444] dark:accent-red-500 cursor-pointer"
                />
                <span>{t(getTranslationKeyForCondition(cond))}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="pb-5">
        <button 
          onClick={() => toggleCollapse('ratings')}
          className="w-full flex items-center justify-between font-bold text-[16px] tracking-wide focus:outline-none cursor-pointer"
        >
          <span>{t('explore_ratings')}</span>
          <ArrowForwardIos className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${collapseState.ratings ? 'rotate-90' : ''}`} />
        </button>
        {collapseState.ratings && (
          <div className="flex flex-col gap-3 mt-4 pl-1">
            {[5, 4, 3, 2].map((stars) => {
              const isSelected = selectedRating === stars;
              return (
                <button
                  key={stars}
                  onClick={() => setSelectedRating(isSelected ? null : stars)}
                  className="flex items-center gap-2.5 text-left text-sm text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                >
                  <div className="flex gap-0.5">
                    {'★'.repeat(stars).split('').map((s, i) => (
                      <span key={i} className="text-yellow-500 text-[15px]">★</span>
                    ))}
                    {'☆'.repeat(5 - stars).split('').map((s, i) => (
                      <span key={i} className="text-gray-300 dark:text-zinc-650 text-[15px]">☆</span>
                    ))}
                  </div>
                  {stars < 5 && <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500">{t('explore_and_up')}</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );

  return (
    <div className="max-w-[1170px] mx-auto px-4 py-8 md:py-16 font-sans text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      
      <div className="flex items-center gap-2 mb-8 text-sm text-gray-500 dark:text-zinc-400">
        <span
          className="hover:text-black dark:hover:text-white cursor-pointer transition-colors"
          onClick={() => navigate("/home")}
        >
          {t('nav_home')}
        </span>
        <span className="mx-2">/</span>
        <span className="text-black dark:text-white font-semibold">{t('explore_title')}</span>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 pr-4">
          {renderFiltersContent()}
        </aside>

        {/* Products Grid Section */}
        <section className="col-span-12 lg:col-span-9">
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-zinc-800 gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{t('explore_title')}</h1>
              <p className="text-xs text-gray-400 mt-1">{sortedProducts.length} {t('explore_items_found')}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <FilterList className="w-4 h-4" />
                <span>{t('explore_filters')}</span>
              </button>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-750 px-4 py-2 rounded text-sm font-medium text-slate-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
                >
                  <option value="Popular">{t('explore_sort_popular')}</option>
                  <option value="Price: Low to High">{t('explore_sort_price_low')}</option>
                  <option value="Price: High to Low">{t('explore_sort_price_high')}</option>
                  <option value="Rating: High to Low">{t('explore_sort_rating')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loader or Products Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-t-[#DB4444] border-gray-200 dark:border-zinc-800 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 dark:text-zinc-400 font-semibold">{t('explore_loading')}</p>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-gray-200 dark:border-zinc-800 rounded bg-gray-50/30 dark:bg-zinc-900/10">
              <p className="text-gray-500 dark:text-zinc-400 mb-4 text-lg">{t('explore_no_products')}</p>
              <button
                onClick={() => {
                  setSelectedCategory("All products");
                  setSelectedBrands([]);
                  setSelectedFeatures([]);
                  handlePriceReset();
                  setSelectedCondition("Any");
                  setSelectedRating(null);
                }}
                className="px-6 py-2.5 bg-[#DB4444] text-white rounded text-sm font-semibold hover:bg-[#c33d3d] cursor-pointer transition-colors border-none"
              >
                {t('explore_clear_filters')}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {sortedProducts.slice(0, visibleCount).map((product) => {
                  const hasDiscount = product.hasDiscount || (product.discountPrice !== undefined && product.discountPrice > 0);
                  let currentPrice = product.price;
                  let oldPrice = product.oldPrice;
                  if (hasDiscount && product.discountPrice) {
                    if (product.discountPrice < product.price) {
                      currentPrice = product.discountPrice;
                      oldPrice = product.price;
                    } else {
                      currentPrice = product.price;
                      oldPrice = product.discountPrice;
                    }
                  }
                  const discountPercent = product.discount || (oldPrice && currentPrice ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : undefined);


                  const colorOptions = [
                    ["#000000", "#DB4444"],
                    ["#EAEAEA", "#DB4444"],
                    ["#117C11", "#DB4444"],
                    ["#2B2B2D", "#E0B310"]
                  ][product.id % 4];

                  return (
                    <div key={product.id} className="group flex flex-col relative bg-white dark:bg-zinc-900 rounded overflow-hidden border border-gray-100 dark:border-zinc-850 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                      
                      {/* Image block */}
                      <div className="relative aspect-square w-full bg-[#F5F5F5] dark:bg-zinc-800 flex items-center justify-center p-4 overflow-hidden">
                        {discountPercent && discountPercent > 0 && (
                          <div className="absolute top-3 left-3 bg-[#DB4444] text-white text-[11px] font-bold px-2 py-0.5 rounded-xs">
                            -{discountPercent}%
                          </div>
                        )}
                        {product.id % 3 === 0 && !discountPercent && (
                          <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-xs">
                            NEW
                          </div>
                        )}

                        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                          <button onClick={(e) => { e.stopPropagation(); dispatch(toggleWishlist(product)); }} className="w-[34px] h-[34px] bg-white dark:bg-zinc-900 dark:text-white rounded-full flex items-center justify-center hover:bg-[#DB4444] hover:text-white dark:hover:bg-[#DB4444] transition-colors shadow-sm border-none cursor-pointer">
                            <FavoriteBorder className={`scale-75 ${wishlistItems.some(i => i.id === product.id) ? 'fill-[#DB4444] text-[#DB4444]' : ''}`} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }} className="w-[34px] h-[34px] bg-white dark:bg-zinc-900 dark:text-white rounded-full flex items-center justify-center hover:bg-[#DB4444] hover:text-white dark:hover:bg-[#DB4444] transition-colors shadow-sm border-none cursor-pointer">
                            <Visibility className="scale-75" />
                          </button>
                        </div>

                        <img
                          src={getProductImage(product)}
                          alt={product.productName}
                          className="max-w-full max-h-[140px] sm:max-h-[160px] object-contain transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80'; }}
                        />

                        {/* Slide up add to cart overlay (always visible on mobile, hover on desktop) */}
                        <button onClick={(e) => { e.stopPropagation(); dispatch(addToCart({product, quantity: 1})); }} className="absolute bottom-0 left-0 w-full py-2.5 bg-black text-white text-center text-sm font-semibold transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 cursor-pointer border-none">
                          {t('home_add_to_cart')}
                        </button>
                      </div>

                      {/* Info Block */}
                      <div className="p-4 flex-1 flex flex-col gap-2 bg-white dark:bg-zinc-900 transition-colors">
                        <span className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-zinc-500 uppercase">
                          {getProductBrandName(product)}
                        </span>
                        
                        <h3 className="font-bold text-[15px] sm:text-[16px] text-slate-800 dark:text-zinc-150 line-clamp-1 group-hover:text-[#DB4444] transition-colors">
                          {product.productName}
                        </h3>

                        <div className="flex items-center gap-3">
                          <span className="text-[#DB4444] font-bold">${currentPrice}</span>
                          {oldPrice && (
                            <span className="text-gray-400 dark:text-zinc-500 line-through text-[13px]">${oldPrice}</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-yellow-500 text-sm">
                              {'★'.repeat(product.rating || 5)}{'☆'.repeat(5 - (product.rating || 5))}
                            </span>
                            <span className="text-gray-400 dark:text-zinc-500 text-[13px] font-bold">
                              ({product.reviewsCount || 0})
                            </span>
                          </div>

                          {/* Color dots indicators */}
                          <div className="flex items-center gap-1.5">
                            {colorOptions.map((color, i) => (
                              <span
                                key={i}
                                className={`w-3.5 h-3.5 rounded-full border border-white dark:border-zinc-800 shadow-xs cursor-pointer ${i === 0 ? 'ring-1 ring-[#DB4444]' : ''}`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              {visibleCount < sortedProducts.length && (
                <div className="w-full flex justify-center mt-12">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="bg-[#DB4444] text-white text-[15px] sm:text-[16px] font-semibold px-12 py-3 rounded-xs hover:-[#c33d3d] transition-colors cursor-pointer border-none"
                  >
                    {t('explore_more')}
                  </button>
                </div>
              )}
            </>
          )}

        </section>
      </div>

      {/* Mobile Drawer Backdrop and Content */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsFilterDrawerOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="relative mr-auto flex h-full w-[290px] flex-col overflow-y-auto bg-white dark:bg-zinc-900 p-6 shadow-2xl transition-transform duration-300 ease-in-out z-50">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-850 pb-4 mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('explore_filters')}</h2>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1 rounded-md text-slate-900 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer border-none bg-transparent"
              >
                <Close className="w-6 h-6" />
              </button>
            </div>
            
            {/* Filter content inside drawer */}
            <div className="flex-1 pb-10">
              {renderFiltersContent()}
            </div>
            
            <div className="mt-auto border-t border-gray-100 dark:border-zinc-800 pt-4">
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-full h-11 bg-[#DB4444] text-white rounded text-sm font-semibold flex items-center justify-center transition-colors cursor-pointer border-none"
              >
                {t('explore_close_apply')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
