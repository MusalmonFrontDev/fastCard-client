import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { clearCart } from "../../store/shopSlice";
import { useTranslation } from "react-i18next";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const cartItems = useSelector((state: RootState) => state.shop.cartItems);

  const [orderPlaced, setOrderPlaced] = useState(false);

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

  const BASE_IMAGE_URL = 'https://fastcard-1-o23z.onrender.com/images/';
  const getProductImage = (item: any) => {
    if (item?.image) return `${BASE_IMAGE_URL}${item.image}`;
    if (item?.images && Array.isArray(item.images) && item.images.length > 0) return `${BASE_IMAGE_URL}${item.images[0]}`;
    if (item?.productImages && Array.isArray(item.productImages) && item.productImages.length > 0) return `${BASE_IMAGE_URL}${item.productImages[0].image || item.productImages[0]}`;
    if (typeof item?.productImages === 'string') return `${BASE_IMAGE_URL}${item.productImages}`;
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80';
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    dispatch(clearCart());
    setTimeout(() => {
      navigate("/home");
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-[1170px] mx-auto px-4 py-32 flex flex-col items-center justify-center font-sans text-slate-900 dark:text-zinc-100">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4">{t('checkout_payment_success')}</h2>
        <p className="text-gray-500 dark:text-zinc-400 text-center max-w-md">
          {t('checkout_payment_desc')}
        </p>
      </div>
    );
  }

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
        <span
          className="hover:text-black dark:hover:text-white cursor-pointer transition-colors"
          onClick={() => navigate("/cart")}
        >
          {t('checkout_view_cart')}
        </span>
        <span className="mx-2">/</span>
        <span className="text-black dark:text-white font-semibold">{t('checkout_title')}</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">{t('checkout_billing_details')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 dark:text-zinc-400 mb-2">{t('checkout_first_name')}</label>
            <input type="text" className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-4 py-3 focus:outline-none focus:border-[#DB4444]" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 dark:text-zinc-400 mb-2">{t('checkout_last_name')}</label>
            <input type="text" className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-4 py-3 focus:outline-none focus:border-[#DB4444]" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 dark:text-zinc-400 mb-2">{t('checkout_street')}</label>
            <input type="text" className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-4 py-3 focus:outline-none focus:border-[#DB4444]" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 dark:text-zinc-400 mb-2">{t('checkout_apartment')}</label>
            <input type="text" className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-4 py-3 focus:outline-none focus:border-[#DB4444]" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 dark:text-zinc-400 mb-2">{t('checkout_city')}</label>
            <input type="text" className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-4 py-3 focus:outline-none focus:border-[#DB4444]" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 dark:text-zinc-400 mb-2">{t('checkout_phone')}</label>
            <input type="tel" className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-4 py-3 focus:outline-none focus:border-[#DB4444]" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 dark:text-zinc-400 mb-2">{t('checkout_email')}</label>
            <input type="email" className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-4 py-3 focus:outline-none focus:border-[#DB4444]" />
          </div>
          <div className="flex items-center gap-3 mt-6">
            <input type="checkbox" id="save-info" className="w-4 h-4 accent-[#DB4444]" />
            <label htmlFor="save-info" className="text-sm text-slate-800 dark:text-zinc-300">{t('checkout_save_info')}</label>
          </div>
        </form>

        <div className="flex flex-col gap-6 w-full lg:max-w-md">
          {cartItems.map(item => {
             const hasDiscount = item.hasDiscount || (item.discountPrice !== undefined && item.discountPrice > 0);
             let currentPrice = item.price;
             if (hasDiscount && item.discountPrice) {
               currentPrice = item.discountPrice < item.price ? item.discountPrice : item.price;
             }
             return (
               <div key={item.id} className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <img src={getProductImage(item)} alt={item.productName} className="w-12 h-12 object-contain bg-gray-50 dark:bg-zinc-800 rounded" />
                   <span className="text-sm font-medium">{item.productName} x {item.quantity}</span>
                 </div>
                 <span className="text-sm font-medium">${(currentPrice * item.quantity).toFixed(2)}</span>
               </div>
             )
          })}
          
          <div className="flex justify-between border-b border-gray-200 dark:border-zinc-800 pb-4 mt-4">
            <span>{t('cart_subtotal')}</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 dark:border-zinc-800 pb-4">
            <span>{t('cart_shipping')}</span>
            <span className="text-emerald-500">{t('cart_free')}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>{t('cart_total')}</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="space-y-4 mb-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" className="w-4 h-4 accent-black" />
                <span>{t('checkout_bank')}</span>
              </label>
              <div className="flex gap-2">
                 <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] flex items-center justify-center">VISA</div>
                 <div className="w-8 h-5 bg-red-500 rounded text-white text-[8px] flex items-center justify-center">MC</div>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="payment" defaultChecked className="w-4 h-4 accent-black" />
              <span>{t('checkout_cash')}</span>
            </label>
          </div>

          <div className="flex gap-4">
            <input type="text" placeholder={t('cart_coupon_placeholder')} className="flex-1 border border-gray-300 dark:border-zinc-700 rounded px-4 h-12 focus:outline-none" />
            <button className="px-6 h-12 bg-[#DB4444] text-white rounded font-medium hover:bg-[#c33d3d] transition-colors border-none cursor-pointer">{t('checkout_apply')}</button>
          </div>

          <button form="checkout-form" type="submit" className="mt-4 px-8 py-4 bg-[#DB4444] text-white rounded font-medium hover:bg-[#c33d3d] transition-colors self-start border-none cursor-pointer w-full sm:w-auto">
            {t('checkout_place_order')}
          </button>
        </div>
      </div>
    </div>
  );
}
