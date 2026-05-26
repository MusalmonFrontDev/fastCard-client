import { useState, useEffect } from "react";
import { Trash2, ShoppingCart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../store/store";
import { toggleWishlist, addToCart, moveWishlistToCart, type Product } from "../../store/shopSlice";
import api from "../../lib/axios";

export default function Wishlist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlistItems = useSelector((state: RootState) => state.shop.wishlistItems);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  const BASE_IMAGE_URL = 'https://fastcard-1-o23z.onrender.com/images/';

  useEffect(() => {
    api.get('https://fastcard-1-o23z.onrender.com/api/Product/get-products')
      .then(res => {
        const json = res.data;
        const allProducts: Product[] = Array.isArray(json.data?.products || json.data || json.products || json)
          ? (json.data?.products || json.data || json.products || json)
          : [];

        setRecommendations(allProducts.slice(0, 4));
      })
      .catch(err => console.error(err));
  }, []);

  const getProductImage = (p: Product) => {
    if (p?.image) return `${BASE_IMAGE_URL}${p.image}`;
    if (p?.images && Array.isArray(p.images) && p.images.length > 0) return `${BASE_IMAGE_URL}${p.images[0]}`;
    if (p?.productImages && Array.isArray(p.productImages) && p.productImages.length > 0) return `${BASE_IMAGE_URL}${p.productImages[0].image || p.productImages[0]}`;
    if (typeof p?.productImages === 'string') return `${BASE_IMAGE_URL}${p.productImages}`;
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80';
  };

  const handleRemove = (product: Product) => {
    dispatch(toggleWishlist(product));
  };

  const handleMoveAllToBag = () => {
    dispatch(moveWishlistToCart());
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <div className="max-w-[1170px] mx-auto px-4 py-8 md:py-16 font-sans text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
          Wishlist ({wishlistItems.length})
        </h1>
        {wishlistItems.length > 0 && (
          <button
            onClick={handleMoveAllToBag}
            className="px-6 py-3 border border-gray-300 dark:border-zinc-700 rounded text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Move All To Bag
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 dark:border-zinc-800 rounded-lg mb-20 bg-gray-50/50 dark:bg-zinc-900/35">
          <p className="text-gray-500 dark:text-zinc-400 mb-4">Your wishlist is empty.</p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2.5 bg-[#DB4444] text-white rounded text-sm font-semibold hover:bg-[#c33d3d] transition-colors cursor-pointer border-none"
          >
            Go Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {wishlistItems.map((product) => {
            const hasDiscount = product.hasDiscount || (product.discountPrice !== undefined && product.discountPrice > 0);
            let currentPrice = product.price;
            let oldPrice = product.oldPrice;
            if (hasDiscount && product.discountPrice) {
              if (product.discountPrice < product.price) { currentPrice = product.discountPrice; oldPrice = product.price; }
              else { currentPrice = product.price; oldPrice = product.discountPrice; }
            }
            const discountPercent = product.discount || (oldPrice && currentPrice ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : undefined);

            return (
              <div key={product.id} className="group flex flex-col relative bg-white dark:bg-zinc-900 rounded-md overflow-hidden border border-gray-100 dark:border-zinc-800 transition-colors shadow-xs cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                <div className="relative w-full aspect-square bg-gray-50 dark:bg-zinc-850 flex items-center justify-center overflow-hidden">
                  <img
                    src={getProductImage(product)}
                    alt={product.productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {discountPercent && discountPercent > 0 && (
                    <span className="absolute top-3 left-3 bg-[#DB4444] text-white text-xs font-bold px-2.5 py-1 rounded">
                      -{discountPercent}%
                    </span>
                  )}

                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(product); }}
                    className="absolute top-3 right-3 p-2 bg-white dark:bg-zinc-800 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 transition-colors shadow-sm cursor-pointer border-none"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                    className="absolute bottom-0 left-0 w-full py-2.5 bg-slate-950/90 dark:bg-zinc-800/90 hover:bg-slate-900 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all md:opacity-0 md:group-hover:opacity-100 cursor-pointer border-none"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add To Cart
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col gap-2 bg-white dark:bg-zinc-900 transition-colors">
                  <h3 className="font-bold text-slate-800 dark:text-zinc-150 line-clamp-1">
                    {product.productName}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-red-500 dark:text-red-400 font-bold">
                      ${currentPrice.toFixed(2)}
                    </span>
                    {oldPrice && (
                      <span className="text-gray-400 dark:text-zinc-550 line-through text-sm">
                        ${oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-5 h-10 bg-[#DB4444] rounded-[4px]" />
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Just For You</h2>
        </div>
        <button
          onClick={() => navigate("/explore-products")}
          className="px-6 py-3 border border-gray-300 dark:border-zinc-700 rounded text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          See All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => {
          const hasDiscount = product.hasDiscount || (product.discountPrice !== undefined && product.discountPrice > 0);
          let currentPrice = product.price;
          let oldPrice = product.oldPrice;
          if (hasDiscount && product.discountPrice) {
            if (product.discountPrice < product.price) { currentPrice = product.discountPrice; oldPrice = product.price; }
            else { currentPrice = product.price; oldPrice = product.discountPrice; }
          }
          const discountPercent = product.discount || (oldPrice && currentPrice ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : undefined);

          return (
            <div key={product.id} className="group flex flex-col relative bg-white dark:bg-zinc-900 rounded-md overflow-hidden border border-gray-100 dark:border-zinc-800 transition-colors shadow-xs cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
              <div className="relative w-full aspect-square bg-gray-50 dark:bg-zinc-850 flex items-center justify-center overflow-hidden">
                <img
                  src={getProductImage(product)}
                  alt={product.productName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {discountPercent && discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-[#DB4444] text-white text-xs font-bold px-2.5 py-1 rounded">
                    -{discountPercent}%
                  </span>
                )}

                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                    className="p-2 bg-white dark:bg-zinc-800 rounded-full text-gray-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white transition-colors shadow-sm cursor-pointer border-none"
                    aria-label="Quick View"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                  className="absolute bottom-0 left-0 w-full py-2.5 bg-slate-950/90 dark:bg-zinc-800/90 hover:bg-slate-900 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all md:opacity-0 md:group-hover:opacity-100 cursor-pointer border-none"
                >
                  <ShoppingCart className="w-4 h-4" /> Add To Cart
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col gap-2 bg-white dark:bg-zinc-900 transition-colors">
                <h3 className="font-bold text-slate-800 dark:text-zinc-150 line-clamp-1">
                  {product.productName}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-red-500 dark:text-red-400 font-bold">
                    ${currentPrice.toFixed(2)}
                  </span>
                  {oldPrice && (
                    <span className="text-gray-400 dark:text-zinc-550 line-through text-sm">
                      ${oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
