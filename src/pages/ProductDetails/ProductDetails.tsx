import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Minus, Plus, Heart, Truck, RefreshCw, ShoppingCart } from "lucide-react";
import api from "../../lib/axios";  
import { useDispatch, useSelector } from "react-redux";
import { addToCart, toggleWishlist, type Product } from "../../store/shopSlice";
import type { RootState } from "../../store/store";
import { FavoriteBorder, Visibility } from "@mui/icons-material";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("#A0BCE0");
  const [selectedSize, setSelectedSize] = useState<string>("M");
  
  const wishlistItems = useSelector((state: RootState) => state.shop.wishlistItems);
  const isWishlisted = product ? wishlistItems.some(item => item.id === product.id) : false;

  const BASE_IMAGE_URL = 'https://fastcard-1-o23z.onrender.com/images/';

  useEffect(() => {
    setLoading(true);
    api.get('https://fastcard-1-o23z.onrender.com/api/Product/get-products')
      .then(res => {
        const json = res.data;
        const allProducts: Product[] = Array.isArray(json.data?.products || json.data || json.products || json) 
          ? (json.data?.products || json.data || json.products || json) 
          : [];
        
        const foundProduct = allProducts.find(p => p.id === Number(id));
        if (foundProduct) {
          setProduct(foundProduct);

          const related = allProducts.filter(p => p.id !== foundProduct.id && (p.categoryId === foundProduct.categoryId || p.brandId === foundProduct.brandId)).slice(0, 4);
          if (related.length < 4) {
             const others = allProducts.filter(p => p.id !== foundProduct.id && !related.some(r => r.id === p.id)).slice(0, 4 - related.length);
             setRelatedProducts([...related, ...others]);
          } else {
             setRelatedProducts(related);
          }
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading product details...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Product not found</h2>
      <button onClick={() => navigate('/home')} className="px-6 py-2 bg-[#DB4444] text-white rounded">Go Home</button>
    </div>;
  }

  const getProductImage = (p: Product) => {
    if (p?.image) return `${BASE_IMAGE_URL}${p.image}`;
    if (p?.images && Array.isArray(p.images) && p.images.length > 0) return `${BASE_IMAGE_URL}${p.images[0]}`;
    if (p?.productImages && Array.isArray(p.productImages) && p.productImages.length > 0) return `${BASE_IMAGE_URL}${p.productImages[0].image || p.productImages[0]}`;
    if (typeof p?.productImages === 'string') return `${BASE_IMAGE_URL}${p.productImages}`;
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80';
  };

  const mainImage = getProductImage(product);
  
  const hasDiscount = product.hasDiscount || (product.discountPrice !== undefined && product.discountPrice > 0);
  let currentPrice = product.price;
  if (hasDiscount && product.discountPrice) {
    currentPrice = product.discountPrice < product.price ? product.discountPrice : product.price;
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity }));
    navigate("/cart");
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product));
  };

  return (
    <div className="max-w-[1170px] mx-auto px-4 py-8 md:py-16 font-sans text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-10 text-sm text-gray-500 dark:text-zinc-400">
        <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/home")}>Home</span>
        <span className="mx-2">/</span>
        <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/explore-products")}>Products</span>
        <span className="mx-2">/</span>
        <span className="text-black dark:text-white font-semibold">{product.productName}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-24">
        {/* Left: Images */}
        <div className="flex flex-col-reverse md:flex-row gap-4 h-[500px]">
          <div className="flex flex-row md:flex-col gap-4 overflow-auto scrollbar-none w-full md:w-[170px]">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="w-20 h-20 md:w-full md:flex-1 bg-[#F5F5F5] dark:bg-zinc-900 rounded-md p-2 flex items-center justify-center shrink-0 cursor-pointer border border-transparent hover:border-[#DB4444] transition-colors">
                <img src={mainImage} alt="Thumbnail" className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
          <div className="flex-1 bg-[#F5F5F5] dark:bg-zinc-900 rounded-md p-8 flex items-center justify-center">
             <img src={mainImage} alt={product.productName} className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight mb-3 text-slate-900 dark:text-white">{product.productName}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-4 h-4 ${star <= (product.rating || 5) ? 'fill-[#FFAD33] text-[#FFAD33]' : 'text-gray-300 dark:text-zinc-700'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-zinc-400">({product.reviewsCount || 150} Reviews)</span>
            <span className="text-gray-300 dark:text-zinc-700">|</span>
            <span className="text-emerald-500 text-sm font-semibold">In Stock</span>
          </div>

          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            ${currentPrice.toFixed(2)}
          </div>

          <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed mb-6 pb-6 border-b border-gray-200 dark:border-zinc-800">
            PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.
          </p>

          {/* Colors */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-lg font-medium">Colours:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedColor("#A0BCE0")}
                className={`w-5 h-5 rounded-full bg-[#A0BCE0] border-2 shadow-sm ${selectedColor === "#A0BCE0" ? 'border-black dark:border-white ring-2 ring-[#A0BCE0] ring-offset-1 dark:ring-offset-zinc-950' : 'border-transparent'}`}
              />
              <button 
                onClick={() => setSelectedColor("#E07575")}
                className={`w-5 h-5 rounded-full bg-[#E07575] border-2 shadow-sm ${selectedColor === "#E07575" ? 'border-black dark:border-white ring-2 ring-[#E07575] ring-offset-1 dark:ring-offset-zinc-950' : 'border-transparent'}`}
              />
            </div>
          </div>

          {/* Sizes */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-lg font-medium">Size:</span>
            <div className="flex gap-4">
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-8 h-8 rounded border text-sm font-medium transition-colors ${
                    selectedSize === size 
                    ? 'bg-[#DB4444] border-[#DB4444] text-white' 
                    : 'border-gray-300 dark:border-zinc-700 hover:border-[#DB4444] dark:hover:border-zinc-500'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mb-10">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-300 dark:border-zinc-700 rounded overflow-hidden h-11 w-32">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="flex-1 h-full flex items-center justify-center font-semibold border-x border-gray-300 dark:border-zinc-700">
                {quantity}
              </div>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-full flex items-center justify-center bg-[#DB4444] text-white hover:bg-[#c33d3d] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={handleBuyNow}
              className="h-11 px-10 bg-[#DB4444] text-white rounded font-medium hover:bg-[#c33d3d] transition-colors"
            >
              Buy Now
            </button>

            <button 
              onClick={handleToggleWishlist}
              className="h-11 w-11 border border-gray-300 dark:border-zinc-700 rounded flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#DB4444] text-[#DB4444]' : 'text-gray-600 dark:text-zinc-300'}`} />
            </button>
          </div>

          {/* Delivery Options */}
          <div className="border border-gray-300 dark:border-zinc-700 rounded flex flex-col">
            <div className="flex items-center gap-4 p-4 md:p-6 border-b border-gray-300 dark:border-zinc-700">
              <Truck className="w-8 h-8 text-slate-900 dark:text-white" />
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Free Delivery</h4>
                <p className="text-xs text-slate-900 dark:text-zinc-300 underline cursor-pointer font-medium">Enter your postal code for Delivery Availability</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 md:p-6">
              <RefreshCw className="w-8 h-8 text-slate-900 dark:text-white" />
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Return Delivery</h4>
                <p className="text-xs text-slate-900 dark:text-zinc-300 font-medium">Free 30 Days Delivery Returns. <span className="underline cursor-pointer">Details</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Items */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-5 h-10 bg-[#DB4444] rounded-[4px]" />
          <h2 className="text-[20px] font-bold text-[#DB4444]">Related Item</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map(rel => {
            const relHasDiscount = rel.hasDiscount || (rel.discountPrice !== undefined && rel.discountPrice > 0);
            let relCurrentPrice = rel.price;
            let relOldPrice = rel.oldPrice;
            if (relHasDiscount && rel.discountPrice) {
              if (rel.discountPrice < rel.price) {
                relCurrentPrice = rel.discountPrice;
                relOldPrice = rel.price;
              } else {
                relCurrentPrice = rel.price;
                relOldPrice = rel.discountPrice;
              }
            }
            const discountPercent = rel.discount || (relOldPrice && relCurrentPrice ? Math.round(((relOldPrice - relCurrentPrice) / relOldPrice) * 100) : undefined);

            return (
              <div key={rel.id} className="group flex flex-col relative bg-white dark:bg-zinc-900 rounded overflow-hidden border border-gray-100 dark:border-zinc-850 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => {navigate(`/product/${rel.id}`); window.scrollTo(0,0);}}>
                <div className="relative aspect-square w-full bg-[#F5F5F5] dark:bg-zinc-800 flex items-center justify-center p-4 overflow-hidden">
                  {discountPercent && discountPercent > 0 && (
                    <div className="absolute top-3 left-3 bg-[#DB4444] text-white text-[11px] font-bold px-2 py-0.5 rounded-xs">
                      -{discountPercent}%
                    </div>
                  )}
                  {rel.id % 3 === 0 && !discountPercent && (
                    <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-xs">
                      NEW
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                    <button 
                      onClick={(e) => { e.stopPropagation(); dispatch(toggleWishlist(rel)); }}
                      className="w-[34px] h-[34px] bg-white dark:bg-zinc-900 dark:text-white rounded-full flex items-center justify-center hover:bg-[#DB4444] hover:text-white dark:hover:bg-[#DB4444] transition-colors shadow-sm border-none cursor-pointer"
                    >
                      <FavoriteBorder className="scale-75" />
                    </button>
                    <button className="w-[34px] h-[34px] bg-white dark:bg-zinc-900 dark:text-white rounded-full flex items-center justify-center hover:bg-[#DB4444] hover:text-white dark:hover:bg-[#DB4444] transition-colors shadow-sm border-none cursor-pointer">
                      <Visibility className="scale-75" />
                    </button>
                  </div>
                  <img
                    src={getProductImage(rel)}
                    alt={rel.productName}
                    className="max-w-full max-h-[140px] sm:max-h-[160px] object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80'; }}
                  />
                  <button 
                    onClick={(e) => { e.stopPropagation(); dispatch(addToCart({ product: rel, quantity: 1 })); }}
                    className="absolute bottom-0 left-0 w-full py-2.5 bg-black text-white text-center text-sm font-semibold transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 cursor-pointer border-none flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add To Cart
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col gap-2 bg-white dark:bg-zinc-900 transition-colors">
                  <h3 className="font-bold text-[15px] sm:text-[16px] text-slate-800 dark:text-zinc-150 line-clamp-1 group-hover:text-[#DB4444] transition-colors">
                    {rel.productName}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[#DB4444] font-bold">${relCurrentPrice}</span>
                    {relOldPrice && (
                      <span className="text-gray-400 dark:text-zinc-500 line-through text-[13px]">${relOldPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-yellow-500 text-sm">
                      {'★'.repeat(rel.rating || 5)}{'☆'.repeat(5 - (rel.rating || 5))}
                    </span>
                    <span className="text-gray-400 dark:text-zinc-500 text-[13px] font-bold">
                      ({rel.reviewsCount || 0})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
