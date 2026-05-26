import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { removeFromCart, updateQuantity } from "../../store/shopSlice";
import { useTranslation } from "react-i18next";

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const cartItems = useSelector((state: RootState) => state.shop.cartItems);

  const [couponCode, setCouponCode] = useState("");

  const handleQuantityChange = (id: number, delta: number, currentQty: number) => {
    const newQty = currentQty + delta;
    if (newQty > 0) {
      dispatch(updateQuantity({ id, quantity: newQty }));
    }
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const BASE_IMAGE_URL = 'https://fastcard-1-o23z.onrender.com/images/';
  
  const getProductImage = (item: any) => {
    if (item?.image) return `${BASE_IMAGE_URL}${item.image}`;
    if (item?.images && Array.isArray(item.images) && item.images.length > 0) return `${BASE_IMAGE_URL}${item.images[0]}`;
    if (item?.productImages && Array.isArray(item.productImages) && item.productImages.length > 0) return `${BASE_IMAGE_URL}${item.productImages[0].image || item.productImages[0]}`;
    if (typeof item?.productImages === 'string') return `${BASE_IMAGE_URL}${item.productImages}`;
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80';
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const hasDiscount = item.hasDiscount || (item.discountPrice !== undefined && item.discountPrice > 0);
    let currentPrice = item.price;
    if (hasDiscount && item.discountPrice) {
      currentPrice = item.discountPrice < item.price ? item.discountPrice : item.price;
    }
    return acc + currentPrice * item.quantity;
  }, 0);
  
  const shipping = 0; 
  const total = subtotal + shipping;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {

    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="max-w-[1170px] mx-auto px-4 py-8 md:py-16 font-sans text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      <div className="flex items-center gap-2 mb-10 text-sm text-gray-500 dark:text-zinc-400">
        <span
          className="hover:text-black dark:hover:text-white cursor-pointer transition-colors"
          onClick={() => navigate("/home")}
        >
          {t('nav_home')}
        </span>
        <span className="mx-2">/</span>
        <span className="text-black dark:text-white font-semibold">{t('cart_title')}</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 dark:border-zinc-800 rounded-lg bg-gray-50/50 dark:bg-zinc-900/35">
          <p className="text-gray-500 dark:text-zinc-400 mb-6 text-lg">{t('cart_empty')}</p>
          <button
            onClick={() => navigate("/home")}
            className="px-8 py-3 bg-[#DB4444] text-white rounded text-sm font-semibold hover:bg-[#c33d3d] transition-colors cursor-pointer border-none"
          >
            {t('cart_go_shopping')}
          </button>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800 text-left text-slate-900 dark:text-white font-semibold">
                  <th className="py-4 font-bold">{t('cart_col_product')}</th>
                  <th className="py-4 font-bold">{t('cart_col_price')}</th>
                  <th className="py-4 font-bold">{t('cart_col_quantity')}</th>
                  <th className="py-4 font-bold text-right">{t('cart_col_subtotal')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-850">
                {cartItems.map((item) => (
                  <tr key={item.id} className="group cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                    <td className="py-6 flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-850">
                        <img src={getProductImage(item)} alt={item.productName} className="w-full h-full object-cover" />
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                          className="absolute -top-1 -left-1 p-1 bg-[#DB4444] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-bold text-slate-800 dark:text-zinc-200">{item.productName}</span>
                    </td>
                    <td className="py-6 text-slate-700 dark:text-zinc-300 font-medium">
                      ${((item.hasDiscount && item.discountPrice) ? (item.discountPrice < item.price ? item.discountPrice : item.price) : item.price).toFixed(2)}
                    </td>
                    <td className="py-6" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center border border-gray-300 dark:border-zinc-700 rounded">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1, item.quantity)}
                          className="px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 cursor-pointer border-none bg-transparent"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-semibold text-sm w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1, item.quantity)}
                          className="px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 cursor-pointer border-none bg-transparent"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-6 text-right font-bold text-[#DB4444] dark:text-red-400">
                      ${(((item.hasDiscount && item.discountPrice) ? (item.discountPrice < item.price ? item.discountPrice : item.price) : item.price) * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="block md:hidden space-y-4 mb-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                className="p-4 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-lg flex flex-col gap-4 shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={getProductImage(item)}
                    alt={item.productName}
                    className="w-16 h-16 rounded object-cover bg-gray-55 border border-gray-100 dark:border-zinc-800"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-zinc-200 line-clamp-1">{item.productName}</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">{t('cart_col_price')}: ${((item.hasDiscount && item.discountPrice) ? (item.discountPrice < item.price ? item.discountPrice : item.price) : item.price).toFixed(2)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                    className="p-2 text-gray-400 hover:text-[#DB4444] hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-colors cursor-pointer border-none bg-transparent"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-zinc-850" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center border border-gray-300 dark:border-zinc-700 rounded">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1, item.quantity)}
                      className="px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 cursor-pointer border-none bg-transparent"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-semibold text-sm w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1, item.quantity)}
                      className="px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 cursor-pointer border-none bg-transparent"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="font-bold text-[#DB4444] dark:text-red-400">
                    {t('cart_col_subtotal')}: ${(((item.hasDiscount && item.discountPrice) ? (item.discountPrice < item.price ? item.discountPrice : item.price) : item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-16">
            <button
              onClick={() => navigate("/home")}
              className="px-8 py-3 border border-gray-300 dark:border-zinc-700 rounded text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors w-full sm:w-auto cursor-pointer"
            >
              {t('cart_return_shop')}
            </button>
            <button
              onClick={() => { /* Cart state is managed in redux */ }}
              className="px-8 py-3 border border-gray-300 dark:border-zinc-700 rounded text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors w-full sm:w-auto cursor-pointer"
            >
              {t('cart_update')}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form onSubmit={handleApplyCoupon} className="lg:col-span-6 flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder={t('cart_coupon_placeholder')}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 h-12 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded px-4 text-sm text-slate-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-red-500 dark:focus:border-red-500 transition-colors"
              />
              <button
                type="submit"
                className="px-8 h-12 bg-[#DB4444] text-white rounded text-sm font-semibold hover:bg-[#c33d3d] transition-colors cursor-pointer border-none whitespace-nowrap"
              >
                {t('cart_apply_coupon')}
              </button>
            </form>

            <div className="lg:col-span-6 border border-gray-300 dark:border-zinc-800 p-6 md:p-8 rounded bg-white dark:bg-zinc-900/50 transition-colors">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">{t('cart_total_title')}</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm pb-4 border-b border-gray-100 dark:border-zinc-800">
                  <span className="text-gray-600 dark:text-zinc-400">{t('cart_subtotal')}</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm pb-4 border-b border-gray-100 dark:border-zinc-800">
                  <span className="text-gray-600 dark:text-zinc-400">{t('cart_shipping')}</span>
                  <span className="font-semibold text-emerald-500">{Number(shipping) === 0 ? t('cart_free') : `$${Number(shipping).toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold pb-6">
                  <span>{t('cart_total')}</span>
                  <span className="text-[#DB4444] dark:text-red-400">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-[#DB4444] text-white rounded text-sm font-semibold hover:bg-[#c33d3d] transition-colors cursor-pointer border-none"
                >
                  {t('cart_checkout_btn')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
