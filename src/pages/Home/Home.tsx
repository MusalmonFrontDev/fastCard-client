import { useState, useEffect, useRef, type ReactNode } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowRightAlt, 
  FavoriteBorder, 
  Visibility
} from '@mui/icons-material';
import api from '../../lib/axios';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist, addToCart } from '../../store/shopSlice';
import type { Product } from '../../store/shopSlice';
import { type RootState } from '../../store/store';
import pm from "../../components/img/14pm.png";
import JBL from "../../components/img/JBL.png";
import JBLS from "../../components/img/JBLS.png";
import ps5 from "../../components/img/ps5.png";
import woman from "../../components/img/woman.png";
import GUCCI from "../../components/img/GUCCI.png";
import Services from "../../components/img/Services.png";
import Services2 from "../../components/img/Services2.png";
import Services3 from "../../components/img/Services3.png";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SubCategory {
  id: number;
  subCategoryName: string;  
}

interface Category {
  id: number;
  categoryName: string;
  categoryImage?: string;
  subCategories?: SubCategory[];
}

export default function MarketplaceHome(): ReactNode {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | number>('all');
  const [currentBanner, setCurrentBanner] = useState<number>(2);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 23, minutes: 19, seconds: 56 });
  const [productOffset, setProductOffset] = useState<number>(0);
  const [exploreOffset, setExploreOffset] = useState<number>(0);

  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.shop.wishlistItems);

  const categoriesRef = useRef<HTMLDivElement>(null);

  const BASE_IMAGE_URL = 'https://fastcard-1-o23z.onrender.com/images/';

  const slides = [
    { title: "Up to 10%  off Voucher", series: "iPhone 11 Series", img: JBLS },
    { title: "Up to 15%  off Voucher", series: "iPhone 12 Series", img: GUCCI },
    { title: "Up to 10%  off Voucher", series: "iPhone 14 Series", img: pm },
    { title: "Up to 20%  off Voucher", series: "iPhone 15 Pro", img: ps5 },
    { title: "Up to 25%  off Voucher", series: "iPad Pro M4", img: JBL }
  ];

  useEffect(() => {
    api.get('https://fastcard-1-o23z.onrender.com/api/Brand/get-brands')
      .then(res => {
        const json = res.data;
        const brandsList = json.data?.brands || json.brands || json.data || [];
        
        const seenNames = new Set();
        const uniqueBrands = [];
        for (const brand of brandsList) {
          if (!seenNames.has(brand.brandName)) {
            seenNames.add(brand.brandName);
            uniqueBrands.push(brand);
          }
        }

        const mappedCategories = uniqueBrands.map((brand: any) => ({
          id: brand.id,
          categoryName: brand.brandName,
        }));
        setCategories(mappedCategories);
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
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        clearInterval(interval);
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => { if (productOffset < 0) setProductOffset(prev => prev + 300); };
  const nextSlide = () => { setProductOffset(prev => prev - 300); };

  const prevExploreSlide = () => { if (exploreOffset < 0) setExploreOffset(prev => prev + 300); };
  const nextExploreSlide = () => { setExploreOffset(prev => prev - 300); };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      categoriesRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredProducts = Array.isArray(products) 
    ? (selectedCategory === 'all' 
        ? products 
        : products.filter(p => {
            const matchingBrands = categories.filter(c => c.categoryName.toLowerCase() === selectedCategory.toString().toLowerCase());
            const matchingBrandIds = matchingBrands.map(b => b.id);
            return matchingBrandIds.includes(p.brandId ?? -1);
          })
      )
    : [];

  const flashSaleProducts = filteredProducts.filter(p => p.hasDiscount || (p.discountPrice !== undefined && p.discountPrice > 0));

  const bestSellingProducts = Array.isArray(products) ? [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4) : [];

  const getProductImage = (product: Product) => {
    if (product?.image) return `${BASE_IMAGE_URL}${product.image}`;
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) return `${BASE_IMAGE_URL}${product.images[0]}`;
    if (product?.productImages && Array.isArray(product.productImages) && product.productImages.length > 0) return `${BASE_IMAGE_URL}${product.productImages[0].image || product.productImages[0]}`;
    if (typeof product?.productImages === 'string') return `${BASE_IMAGE_URL}${product.productImages}`;
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80';
  };

  const gridExploreProducts = filteredProducts.slice(0, 8);
  const swiperExploreProducts = filteredProducts.slice(8);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-zinc-950 font-sans text-black dark:text-white p-4 sm:p-5 select-none transition-colors duration-200">
      <div className="max-w-[1170px] mx-auto">
        
        <div className="flex flex-col md:flex-row border-b border-gray-200 dark:border-zinc-800 pb-10 relative gap-6">
          
          <div className="w-full md:w-[235px] pt-4 pr-0 md:pr-3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-zinc-800 relative z-30">
            <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-3 md:space-y-[15px] scrollbar-none pb-4 md:pb-0">
              <div 
                onClick={() => { setSelectedCategory('all'); setProductOffset(0); }} 
                className={`flex items-center justify-between cursor-pointer font-normal py-1.5 px-4 md:px-0 md:py-0.5 rounded-full md:rounded-none border md:border-none whitespace-nowrap text-[15px] md:text-[16px] transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-[#DB4444] md:bg-transparent text-white md:text-[#DB4444] border-[#DB4444] font-medium' 
                    : 'bg-transparent text-black dark:text-zinc-300 border-gray-200 dark:border-zinc-800 hover:text-[#DB4444] dark:hover:text-red-400'
                }`}
              >
                <span>{t('home_all_brands')}</span>
              </div>
              
              {Array.isArray(categories) && categories.map((cat) => {
                const isSelected = selectedCategory === cat.categoryName;
                return (
                  <div 
                    key={cat.id} 
                    onClick={() => { setSelectedCategory(cat.categoryName); setProductOffset(0); }} 
                    className={`flex items-center justify-between cursor-pointer font-normal py-1.5 px-4 md:px-0 md:py-0.5 rounded-full md:rounded-none border md:border-none whitespace-nowrap text-[15px] md:text-[16px] transition-colors ${
                      isSelected 
                        ? 'bg-[#DB4444] md:bg-transparent text-white md:text-[#DB4444] border-[#DB4444] font-medium' 
                        : 'bg-transparent text-black dark:text-zinc-300 border-gray-200 dark:border-zinc-800 hover:text-[#DB4444] dark:hover:text-red-400'
                    }`}
                  >
                    <span>{cat.categoryName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-1 pl-0 md:pl-[45px] pt-4 overflow-hidden">
            <div className="w-full bg-black dark:bg-zinc-900 h-auto min-h-[280px] md:h-[344px] relative text-white rounded-xs flex flex-col md:flex-row items-center px-6 md:px-16 py-8 md:py-0 gap-6">
              
              <div className="w-full md:w-[50%] z-10 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center gap-4 md:gap-6 mb-3">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple Logo" className="w-6 h-7 invert object-contain" />
                  <p className="text-[14px] md:text-[16px] text-gray-200 font-light mt-1">{slides[currentBanner]?.series}</p>
                </div>
                <h1 className="text-[28px] sm:text-[36px] md:text-[48px] font-bold leading-[34px] sm:leading-[44px] md:leading-[60px] tracking-wide mb-6 whitespace-pre-line">
                  {slides[currentBanner]?.title}
                </h1>
                <div className="inline-flex items-center gap-2 border-b border-white/70 pb-1.5 cursor-pointer hover:text-[#DB4444] hover:border-[#DB4444] transition-colors">
                  <span className="text-[14px] md:text-[16px] font-medium">{t('home_shop_now')}</span>
                  <ArrowRightAlt className="scale-110" />
                </div>
              </div>

              <div className="relative md:absolute right-0 bottom-0 w-[70%] sm:w-[50%] md:w-[50%] h-[180px] md:h-full flex items-center justify-center p-2 md:p-6 pointer-events-none">
                <img src={slides[currentBanner]?.img} alt="Promo" className="w-full h-full object-contain max-h-[160px] md:max-h-[300px]" />
              </div>

              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
                {slides.map((_, index) => (
                  <div 
                    key={index} 
                    onClick={(e) => { e.stopPropagation(); setCurrentBanner(index); }} 
                    className={`w-3 h-3 rounded-full cursor-pointer transition-all ${index === currentBanner ? 'bg-[#DB4444] border-2 border-white scale-110' : 'bg-gray-500'}`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>

        <div className="pt-10 pb-12 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-5 h-10 bg-[#DB4444] rounded-sm"></div>
            <span className="text-[#DB4444] font-semibold text-[16px]">{t('home_todays')}</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 sm:gap-12 md:gap-24 w-full">
              <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight leading-none text-slate-900 dark:text-zinc-50">{t('home_flash_sales')}</h2>
              
              <div className="flex items-center gap-3 sm:gap-4 text-slate-900 dark:text-zinc-200">
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-[12px] font-bold mb-1 uppercase tracking-wider text-gray-500 dark:text-zinc-400">{t('home_days')}</span>
                  <span className="text-[24px] sm:text-[32px] font-bold leading-none">{String(timeLeft.days).padStart(2, '0')}</span>
                </div>
                <span className="text-[#DB4444] text-[20px] sm:text-[30px] font-bold pb-1">:</span>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-[12px] font-bold mb-1 uppercase tracking-wider text-gray-500 dark:text-zinc-400">{t('home_hours')}</span>
                  <span className="text-[24px] sm:text-[32px] font-bold leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
                </div>
                <span className="text-[#DB4444] text-[20px] sm:text-[30px] font-bold pb-1">:</span>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-[12px] font-bold mb-1 uppercase tracking-wider text-gray-500 dark:text-zinc-400">{t('home_minutes')}</span>
                  <span className="text-[24px] sm:text-[32px] font-bold leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
                </div>
                <span className="text-[#DB4444] text-[20px] sm:text-[30px] font-bold pb-1">:</span>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-[12px] font-bold mb-1 uppercase tracking-wider text-gray-500 dark:text-zinc-400">{t('home_seconds')}</span>
                  <span className="text-[24px] sm:text-[32px] font-bold leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 self-end md:self-auto">
              <button onClick={prevSlide} className="w-11 h-11 rounded-full bg-[#F5F5F5] dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors"><ArrowLeft className="text-black dark:text-white scale-110" /></button>
              <button onClick={nextSlide} className="w-11 h-11 rounded-full bg-[#F5F5F5] dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors"><ArrowRight className="text-black dark:text-white scale-110" /></button>
            </div>
          </div>

          <div className="w-full overflow-x-auto md:overflow-x-hidden pb-4">
            {flashSaleProducts.length === 0 ? (
              <div className="w-full py-20 text-center text-gray-400 dark:text-zinc-550 text-lg">{t('home_no_discount')}</div>
            ) : (
              <div className="flex gap-[20px] md:gap-[30px] transition-transform duration-150 ease-out" style={{ transform: `translateX(${productOffset}px)` }}>
                {flashSaleProducts.map((product) => {
                  const hasDiscount = product.hasDiscount || (product.discountPrice !== undefined && product.discountPrice > 0);
                  let currentPrice = product.price;
                  let oldPrice = product.oldPrice;
                  if (hasDiscount && product.discountPrice) {
                    if (product.discountPrice < product.price) { currentPrice = product.discountPrice; oldPrice = product.price; }
                    else if (product.discountPrice > product.price) { currentPrice = product.price; oldPrice = product.discountPrice; }
                  }
                  const discountPercent = product.discount || (oldPrice && currentPrice ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : undefined);

                  return (
                    <div key={product.id} className="min-w-[250px] sm:min-w-[270px] w-[250px] sm:w-[270px] group cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                      <div className="w-full h-[220px] sm:h-[250px] bg-[#F5F5F5] dark:bg-zinc-900 rounded-xs relative flex items-center justify-center p-4 overflow-hidden">
                        {discountPercent && discountPercent > 0 && <div className="absolute top-3 left-3 bg-[#DB4444] text-white text-[12px] px-2 py-1 rounded-xs">-{discountPercent}%</div>}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                          <button onClick={(e) => { e.stopPropagation(); dispatch(toggleWishlist(product)); }} className="w-[34px] h-[34px] bg-white dark:bg-zinc-800 dark:text-white rounded-full flex items-center justify-center hover:bg-[#DB4444] hover:text-white transition-colors shadow-xs cursor-pointer border-none"><FavoriteBorder className={`scale-75 ${wishlistItems.some(i => i.id === product.id) ? 'fill-[#DB4444] text-[#DB4444]' : ''}`} /></button>
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }} className="w-[34px] h-[34px] bg-white dark:bg-zinc-800 dark:text-white rounded-full flex items-center justify-center hover:bg-[#DB4444] hover:text-white transition-colors shadow-xs cursor-pointer border-none"><Visibility className="scale-75" /></button>
                        </div>
                        <img src={getProductImage(product)} alt={product.productName} className="max-w-full max-h-[130px] sm:max-h-[150px] object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-200 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80'; }} />
                        <button onClick={(e) => { e.stopPropagation(); dispatch(addToCart({product, quantity: 1})); }} className="absolute bottom-0 left-0 w-full bg-black text-white text-center py-2.5 text-[14px] font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer border-none">{t('home_add_to_cart')}</button>
                      </div>
                      <div className="pt-4 space-y-1">
                        <h3 className="font-bold text-[15px] sm:text-[16px] text-slate-900 dark:text-zinc-100 truncate">{product.productName}</h3>
                        <div className="flex gap-3 items-center"><span className="text-[#DB4444] font-bold">${currentPrice}</span>{oldPrice && <span className="text-gray-400 line-through font-medium">${oldPrice}</span>}</div>
                        <div className="flex items-center gap-1.5"><span className="text-yellow-500 text-sm">{'★'.repeat(product.rating || 5)}{'☆'.repeat(5 - (product.rating || 5))}</span><span className="text-gray-400 dark:text-zinc-500 text-[13px] sm:text-[14px] font-bold">({product.reviewsCount || 0})</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="pt-16 pb-16 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-5 h-10 bg-[#DB4444] rounded-sm"></div>
            <span className="text-[#DB4444] font-semibold text-[16px]">{t('home_brands')}</span>
          </div>
          
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight leading-none text-slate-900 dark:text-zinc-50">{t('home_browse_brand')}</h2>
            <div className="flex gap-2">
              <button onClick={() => scrollCategories('left')} className="w-11 h-11 rounded-full bg-[#F5F5F5] dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors"><ArrowLeft className="text-black dark:text-white scale-110" /></button>
              <button onClick={() => scrollCategories('right')} className="w-11 h-11 rounded-full bg-[#F5F5F5] dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors"><ArrowRight className="text-black dark:text-white scale-110" /></button>
            </div>
          </div>

          <div ref={categoriesRef} className="flex gap-[20px] md:gap-[30px] overflow-x-auto scrollbar-none pb-2">
            {categories.map((brand) => {
              const isSelected = selectedCategory === brand.categoryName;
              return (
                <div 
                  key={brand.id} 
                  onClick={() => { setSelectedCategory(brand.categoryName); setProductOffset(0); }} 
                  className={`min-w-[140px] sm:min-w-[170px] w-[140px] sm:w-[170px] h-[120px] sm:h-[145px] border rounded-sm flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 select-none ${
                    isSelected 
                      ? 'bg-[#DB4444] border-[#DB4444] text-white shadow-md' 
                      : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-black dark:text-zinc-300 hover:border-[#DB4444] dark:hover:border-[#DB4444] hover:text-[#DB4444] dark:hover:text-[#DB4444]'
                  }`}
                >
                  <span className="text-[18px] sm:text-[20px] font-bold tracking-wide text-center px-2">{brand.categoryName}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-16 pb-16 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-5 h-10 bg-[#DB4444] rounded-sm"></div>
            <span className="text-[#DB4444] font-semibold text-[16px]">{t('home_this_month')}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
            <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight leading-none text-slate-900 dark:text-zinc-50">{t('home_best_selling')}</h2>
            <button className="bg-[#DB4444] text-white text-[15px] sm:text-[16px] font-medium px-8 sm:px-12 py-3 rounded-xs hover:bg-red-650 transition-colors w-full sm:w-auto">{t('home_view_all')}</button>
          </div>

          {bestSellingProducts.length === 0 ? (
            <div className="w-full py-10 text-center text-gray-400 dark:text-zinc-550">{t('home_loading_popular')}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-[30px]">
              {bestSellingProducts.map((product) => {
                const hasDiscount = product.hasDiscount || (product.discountPrice !== undefined && product.discountPrice > 0);
                const currentPrice = hasDiscount && product.discountPrice ? product.discountPrice : product.price;
                const oldPrice = hasDiscount ? product.price : product.oldPrice;

                return (
                  <div key={product.id} className="w-full group cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                    <div className="w-full h-[220px] sm:h-[250px] bg-[#F5F5F5] dark:bg-zinc-900 rounded-xs relative flex items-center justify-center p-4 overflow-hidden">
                      <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                        <button onClick={(e) => { e.stopPropagation(); dispatch(toggleWishlist(product)); }} className="w-[34px] h-[34px] bg-white dark:bg-zinc-800 dark:text-white rounded-full flex items-center justify-center hover:bg-[#DB4444] hover:text-white transition-colors shadow-xs cursor-pointer border-none"><FavoriteBorder className={`scale-75 ${wishlistItems.some(i => i.id === product.id) ? 'fill-[#DB4444] text-[#DB4444]' : ''}`} /></button>
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }} className="w-[34px] h-[34px] bg-white dark:bg-zinc-800 dark:text-white rounded-full flex items-center justify-center hover:bg-[#DB4444] hover:text-white transition-colors shadow-xs cursor-pointer border-none"><Visibility className="scale-75" /></button>
                      </div>
                      <img src={getProductImage(product)} alt={product.productName} className="max-w-full max-h-[130px] sm:max-h-[160px] object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-200 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80'; }} />
                      <button onClick={(e) => { e.stopPropagation(); dispatch(addToCart({product, quantity: 1})); }} className="absolute bottom-0 left-0 w-full bg-black text-white text-center py-2.5 text-[14px] font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer border-none">{t('home_add_to_cart')}</button>
                    </div>
                    <div className="pt-4 space-y-1">
                      <h3 className="font-bold text-[15px] sm:text-[16px] text-slate-900 dark:text-zinc-100 truncate">{product.productName}</h3>
                      <div className="flex gap-3 items-center"><span className="text-[#DB4444] font-bold">${currentPrice}</span>{oldPrice && <span className="text-gray-400 line-through font-medium">${oldPrice}</span>}</div>
                      <div className="flex items-center gap-1.5"><span className="text-yellow-500 text-sm">{'★'.repeat(product.rating || 5)}{'☆'.repeat(5 - (product.rating || 5))}</span><span className="text-gray-400 dark:text-zinc-500 text-[13px] sm:text-[14px] font-bold">({product.reviewsCount || 0})</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-16 pb-16">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-5 h-10 bg-[#DB4444] rounded-sm"></div>
            <span className="text-[#DB4444] font-semibold text-[16px]">{t('home_our_products')}</span>
          </div>

          <div className="flex items-center justify-between mb-10">
            <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight leading-none text-slate-900 dark:text-zinc-50">{t('home_explore_products')}</h2>
            <div className="flex gap-2">
              <button onClick={prevExploreSlide} className="w-11 h-11 rounded-full bg-[#F5F5F5] dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors"><ArrowLeft className="text-black dark:text-white scale-110" /></button>
              <button onClick={nextExploreSlide} className="w-11 h-11 rounded-full bg-[#F5F5F5] dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors"><ArrowRight className="text-black dark:text-white scale-110" /></button>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="w-full py-10 text-center text-gray-400 dark:text-zinc-550">{t('home_loading')}</div>
          ) : (
            <div className="space-y-[30px]">
              
              <div className="w-full bg-black dark:bg-zinc-900 h-auto flex flex-col md:flex-row items-center justify-between px-6 sm:px-14 py-12 md:py-0 relative my-16 select-none overflow-hidden gap-8 text-center md:text-left rounded-sm">
                <div className="flex flex-col items-center md:items-start z-10 max-w-[500px]">
                  <span className="text-[#00FF66] font-semibold text-[16px] mb-8">{t('home_categories')}</span>
                  <h2 className="text-white text-[30px] sm:text-[38px] md:text-[48px] font-bold leading-[38px] sm:leading-[48px] md:leading-[60px] tracking-wide mb-8">
                    {t('home_enhance_music')}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 mb-10">
                    <div className="w-16 h-16 rounded-full bg-white flex flex-col items-center justify-center text-black shadow-md"><span className="text-[16px] font-bold leading-none">23</span><span className="text-[11px] font-normal text-black mt-0.5">{t('home_hours')}</span></div>
                    <div className="w-16 h-16 rounded-full bg-white flex flex-col items-center justify-center text-black shadow-md"><span className="text-[16px] font-bold leading-none">05</span><span className="text-[11px] font-normal text-black mt-0.5">{t('home_days')}</span></div>
                    <div className="w-16 h-16 rounded-full bg-white flex flex-col items-center justify-center text-black shadow-md"><span className="text-[16px] font-bold leading-none">59</span><span className="text-[11px] font-normal text-black mt-0.5">{t('home_minutes')}</span></div>
                    <div className="w-16 h-16 rounded-full bg-white flex flex-col items-center justify-center text-black shadow-md"><span className="text-[16px] font-bold leading-none">35</span><span className="text-[11px] font-normal text-black mt-0.5">{t('home_seconds')}</span></div>
                  </div>
                  <button className="bg-[#00FF66] text-black text-[16px] font-bold w-[171px] h-[56px] rounded-xs hover:scale-105 transition-all flex items-center justify-center border-none cursor-pointer">{t('home_buy_now')}</button>
                </div>
                
                <div className="w-full md:w-[50%] h-[240px] sm:h-[300px] md:h-[450px] relative flex items-center justify-center">
                  <div className="absolute w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-white/10 blur-[80px] pointer-events-none z-0"></div>
                  <img src={JBL} alt="JBL Boombox" className="max-w-full max-h-[220px] sm:max-h-[300px] md:max-h-[400px] object-contain z-10 filter drop-shadow-[0_20px_50px_rgba(255,255,255,0.15)]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-[30px]">
                {gridExploreProducts.map((product) => {
                  const hasDiscount = product.hasDiscount || (product.discountPrice !== undefined && product.discountPrice > 0);
                  const currentPrice = hasDiscount && product.discountPrice ? product.discountPrice : product.price;
                  const oldPrice = hasDiscount ? product.price : product.oldPrice;

                  return (
                    <div key={product.id} className="w-full group cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                      <div className="w-full h-[220px] sm:h-[250px] bg-[#F5F5F5] dark:bg-zinc-900 rounded-xs relative flex items-center justify-center p-4 overflow-hidden">
                        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                          <button onClick={(e) => { e.stopPropagation(); dispatch(toggleWishlist(product)); }} className="w-[34px] h-[34px] bg-white dark:bg-zinc-800 dark:text-white rounded-full flex items-center justify-center hover:bg-[#DB4444] hover:text-white transition-colors shadow-xs cursor-pointer border-none"><FavoriteBorder className={`scale-75 ${wishlistItems.some(i => i.id === product.id) ? 'fill-[#DB4444] text-[#DB4444]' : ''}`} /></button>
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }} className="w-[34px] h-[34px] bg-white dark:bg-zinc-800 dark:text-white rounded-full flex items-center justify-center hover:bg-[#DB4444] hover:text-white transition-colors shadow-xs cursor-pointer border-none"><Visibility className="scale-75" /></button>
                        </div>
                        <img src={getProductImage(product)} alt={product.productName} className="max-w-full max-h-[130px] sm:max-h-[160px] object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-200 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80'; }} />
                        <button onClick={(e) => { e.stopPropagation(); dispatch(addToCart({product, quantity: 1})); }} className="absolute bottom-0 left-0 w-full bg-black text-white text-center py-2.5 text-[14px] font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer border-none">{t('home_add_to_cart')}</button>
                      </div>
                      <div className="pt-4 space-y-1">
                        <h3 className="font-bold text-[15px] sm:text-[16px] text-slate-900 dark:text-zinc-100 truncate">{product.productName}</h3>
                        <div className="flex gap-3 items-center"><span className="text-[#DB4444] font-bold">${currentPrice}</span>{oldPrice && <span className="text-gray-400 line-through font-medium">${oldPrice}</span>}</div>
                        <div className="flex items-center gap-1.5"><span className="text-yellow-500 text-sm">{'★'.repeat(product.rating || 5)}{'☆'.repeat(5 - (product.rating || 5))}</span><span className="text-gray-400 dark:text-zinc-500 text-[13px] sm:text-[14px] font-bold">({product.reviewsCount || 0})</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {swiperExploreProducts.length > 0 && (
                <div className="w-full overflow-x-auto md:overflow-x-hidden pt-4 pb-4">
                  <div className="flex gap-[20px] md:gap-[30px] transition-transform duration-150 ease-out" style={{ transform: `translateX(${exploreOffset}px)` }}>
                    {swiperExploreProducts.map((product) => {
                      const hasDiscount = product.hasDiscount || (product.discountPrice !== undefined && product.discountPrice > 0);
                      const currentPrice = hasDiscount && product.discountPrice ? product.discountPrice : product.price;
                      const oldPrice = hasDiscount ? product.price : product.oldPrice;

                      return (
                        <div key={product.id} className="min-w-[250px] sm:min-w-[270px] w-[250px] sm:w-[270px] group cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                          <div className="w-full h-[220px] sm:h-[250px] bg-[#F5F5F5] dark:bg-zinc-900 rounded-xs relative flex items-center justify-center p-4 overflow-hidden">
                            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                              <button onClick={(e) => { e.stopPropagation(); dispatch(toggleWishlist(product)); }} className="w-[34px] h-[34px] bg-white dark:bg-zinc-800 dark:text-white rounded-full flex items-center justify-center hover:bg-[#DB4444] hover:text-white transition-colors shadow-xs cursor-pointer border-none"><FavoriteBorder className={`scale-75 ${wishlistItems.some(i => i.id === product.id) ? 'fill-[#DB4444] text-[#DB4444]' : ''}`} /></button>
                              <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }} className="w-[34px] h-[34px] bg-white dark:bg-zinc-800 dark:text-white rounded-full flex items-center justify-center hover:bg-[#DB4444] hover:text-white transition-colors shadow-xs cursor-pointer border-none"><Visibility className="scale-75" /></button>
                            </div>
                            <img src={getProductImage(product)} alt={product.productName} className="max-w-full max-h-[130px] sm:max-h-[160px] object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-200 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80'; }} />
                            <button onClick={(e) => { e.stopPropagation(); dispatch(addToCart({product, quantity: 1})); }} className="absolute bottom-0 left-0 w-full bg-black text-white text-center py-2.5 text-[14px] font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer border-none">{t('home_add_to_cart')}</button>
                          </div>
                          <div className="pt-4 space-y-1">
                            <h3 className="font-bold text-[15px] sm:text-[16px] text-slate-900 dark:text-zinc-100 truncate">{product.productName}</h3>
                            <div className="flex gap-3 items-center"><span className="text-[#DB4444] font-bold">${currentPrice}</span>{oldPrice && <span className="text-gray-400 line-through font-medium">${oldPrice}</span>}</div>
                            <div className="flex items-center gap-1.5"><span className="text-yellow-500 text-sm">{'★'.repeat(product.rating || 5)}{'☆'.repeat(5 - (product.rating || 5))}</span><span className="text-gray-400 dark:text-zinc-500 text-[13px] sm:text-[14px] font-bold">({product.reviewsCount || 0})</span></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

          <div className="w-full flex justify-center mt-14">
            <button 
              onClick={() => navigate("/explore-products")}
              className="bg-[#DB4444] text-white text-[15px] sm:text-[16px] font-medium px-12 py-4 rounded-xs hover:bg-red-600 transition-colors w-full sm:w-auto cursor-pointer"
            >
              {t('home_view_all_products')}
            </button>
          </div>
        </div>

      </div>

      <div className="w-full bg-white dark:bg-zinc-950 font-sans text-black dark:text-white p-4 sm:p-5 select-none my-16 transition-colors duration-250 border-t border-gray-100 dark:border-zinc-800 pt-16">
        <div className="max-w-[1170px] mx-auto space-y-12">
          
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-5 h-10 bg-[#DB4444] rounded-sm"></div>
              <span className="text-[#DB4444] font-semibold text-[16px]">{t('home_featured')}</span>
            </div>
            <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight leading-none text-slate-900 dark:text-zinc-50">{t('home_new_arrival')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-[30px] h-auto md:h-[600px]">
            
            <div className="col-span-1 md:col-span-2 h-[300px] md:h-full bg-black rounded-xs relative group p-6 flex flex-col justify-end overflow-hidden">
              <img src={ps5} alt="PS5" className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-1"></div>
              <div className="z-10 text-white space-y-3">
                <h3 className="text-[20px] sm:text-[24px] font-bold tracking-wide">{t('home_ps5_title')}</h3>
                <p className="text-[12px] sm:text-[14px] text-gray-200 max-w-[300px]">{t('home_ps5_desc')}</p>
                <a href="#" className="inline-block text-[15px] sm:text-[16px] font-medium border-b border-white pb-1 transition-colors hover:text-[#00FF66] hover:border-[#00FF66]">{t('home_shop_now')}</a>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 h-auto md:h-full grid grid-rows-none md:grid-rows-2 gap-6 md:gap-[30px]">
              
              <div className="row-span-1 h-[250px] md:h-full bg-black rounded-xs relative group flex overflow-hidden p-6 justify-end items-end">
                <img src={woman} alt="Women's Collection" className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-1"></div>
                <div className="z-10 text-white space-y-3 w-full text-left">
                  <h3 className="text-[20px] sm:text-[24px] font-bold tracking-wide">{t('home_womens_title')}</h3>
                  <p className="text-[12px] sm:text-[14px] text-gray-200 max-w-[250px]">{t('home_womens_desc')}</p>
                  <a href="#" className="inline-block text-[15px] sm:text-[16px] font-medium border-b border-white pb-1 transition-colors hover:text-[#00FF66] hover:border-[#00FF66]">{t('home_shop_now')}</a>
                </div>
              </div>

              <div className="row-span-1 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-[30px]">
                
                <div className="bg-black rounded-xs relative group flex flex-col items-start justify-end p-6 h-[220px] md:h-full overflow-hidden">
                  <img src={JBLS} alt="Speakers" className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-1"></div>
                  <div className="z-10 text-white space-y-1.5 text-left">
                    <h3 className="text-[18px] sm:text-[20px] font-bold tracking-wide">{t('home_speakers_title')}</h3>
                    <p className="text-[11px] sm:text-[12px] text-gray-250 max-w-[150px] truncate">{t('home_speakers_desc')}</p>
                    <a href="#" className="inline-block text-[13px] sm:text-[14px] font-medium border-b border-white pb-1 transition-colors hover:text-[#00FF66] hover:border-[#00FF66]">{t('home_shop_now')}</a>
                  </div>
                </div>

                <div className="bg-black rounded-xs relative group flex flex-col items-start justify-end p-6 h-[220px] md:h-full overflow-hidden">
                  <img src={GUCCI} alt="Perfume" className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-1"></div>
                  <div className="z-10 text-white space-y-1.5 text-left">
                    <h3 className="text-[18px] sm:text-[20px] font-bold tracking-wide">{t('home_perfume_title')}</h3>
                    <p className="text-[11px] sm:text-[12px] text-gray-255 max-w-[150px] truncate">{t('home_perfume_desc')}</p>
                    <a href="#" className="inline-block text-[13px] sm:text-[14px] font-medium border-b border-white pb-1 transition-colors hover:text-[#00FF66] hover:border-[#00FF66]">{t('home_shop_now')}</a>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-center pb-12">
            
            <div className="flex flex-col items-center space-y-6">
              <div className="w-[80px] h-[80px] relative">
                <img src={Services} alt="Icon border" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-[18px] sm:text-[20px] font-bold text-slate-900 dark:text-zinc-150 tracking-tight">{t('about_service_delivery_title')}</h4>
              <p className="text-[13px] sm:text-[14px] text-gray-800 dark:text-zinc-400 max-w-[250px]">{t('about_service_delivery_desc')}</p>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div className="w-[80px] h-[80px] relative">
                <img src={Services2} alt="Icon border" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-[18px] sm:text-[20px] font-bold text-slate-900 dark:text-zinc-150 tracking-tight">{t('about_service_support_title')}</h4>
              <p className="text-[13px] sm:text-[14px] text-gray-800 dark:text-zinc-400 max-w-[250px]">{t('about_service_support_desc')}</p>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div className="w-[80px] h-[80px] relative">
                <img src={Services3} alt="Icon border" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-[18px] sm:text-[20px] font-bold text-slate-900 dark:text-zinc-150 tracking-tight">{t('about_service_guarantee_title')}</h4>
              <p className="text-[13px] sm:text-[14px] text-gray-800 dark:text-zinc-400 max-w-[250px]">{t('about_service_guarantee_desc')}</p>
            </div>

          </div>

        </div>
      </div>
      
    </div>
  );
}