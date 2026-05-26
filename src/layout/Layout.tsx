import { useState, useEffect, useRef } from 'react';
import { Heart, Search, ShoppingCart, User, LogOut, Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { logout } from '../UserSlice/userSlice';
import fast from '../components/img/fast.png';
import { useTranslation } from 'react-i18next';

import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Layout = () => {
  const { t, i18n } = useTranslation();
  const token = useSelector((state: RootState) => state.users.token);
  const wishlistItems = useSelector((state: RootState) => state.shop.wishlistItems);
  const cartItems = useSelector((state: RootState) => state.shop.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    navigate("/login");
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-200">
      <header className="w-full border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-[1170px] mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 cursor-pointer select-none">
            <div className="flex flex-col relative w-10 h-7 justify-center">
              <img src={fast} alt="" className="dark:brightness-110" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-50">fastcart</span>
          </Link>

          <nav className="hidden md:flex items-center gap-12 text-base font-normal text-slate-900 dark:text-zinc-200">
            <Link to="/home" className="pb-1 border-b-2 border-slate-950 dark:border-zinc-50 font-medium">{t('nav_home')}</Link>
            <Link to="/contact" className="hover:text-gray-600 dark:hover:text-zinc-400 transition-colors">{t('nav_contact')}</Link>
            <Link to="/about" className="hover:text-gray-600 dark:hover:text-zinc-400 transition-colors">{t('nav_about')}</Link>
            {!token && (
              <Link to="/signup" className="hover:text-gray-600 dark:hover:text-zinc-400 transition-colors">{t('nav_signup')}</Link>
            )}
          </nav>

          <div className="flex items-center gap-3 sm:gap-6">
            
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleDarkMode}
                  className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-slate-900 dark:text-zinc-200 transition-colors focus:outline-none cursor-pointer"
                  aria-label="Toggle Theme"
                >
                  {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
                </button>
                <div className="relative flex items-center border border-gray-200 dark:border-zinc-700 rounded-md bg-transparent overflow-hidden h-9 px-1">
                  <Globe className="w-4 h-4 text-slate-700 dark:text-zinc-300 ml-1 mr-1" />
                  <select
                    value={i18n.language?.startsWith('ru') ? 'ru' : 'en'}
                    onChange={changeLanguage}
                    className="bg-transparent text-sm text-slate-800 dark:text-zinc-100 focus:outline-none cursor-pointer appearance-none pr-3"
                  >
                    <option value="en">EN</option>
                    <option value="ru">RU</option>
                  </select>
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={t('search_placeholder')}
                  className="w-[240px] bg-gray-100 dark:bg-zinc-800 py-2.5 pl-5 pr-10 rounded-md text-sm text-slate-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none border-none"
                />
                <Search className="absolute right-3 w-5 h-5 text-slate-900 dark:text-zinc-200 cursor-pointer" />
              </div>

              <div className="flex items-center gap-4">
                <Link to="/wishlist" className="text-slate-950 dark:text-zinc-200 hover:text-gray-600 dark:hover:text-zinc-400 transition-colors relative">
                  <Heart className="w-6 h-6" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#DB4444] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="text-slate-950 dark:text-zinc-200 hover:text-gray-600 dark:hover:text-zinc-400 transition-colors relative">
                  <ShoppingCart className="w-6 h-6" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#DB4444] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
                
                <div className="relative" ref={dropdownRef}>
                  {token ? (
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="text-slate-950 dark:text-zinc-200 hover:text-gray-600 dark:hover:text-zinc-400 transition-colors focus:outline-none flex items-center cursor-pointer"
                      aria-label="Profile Menu"
                    >
                      <User className="w-6 h-6" />
                    </button>
                  ) : (
                    <Link to="/login" className="text-slate-950 dark:text-zinc-200 hover:text-gray-600 dark:hover:text-zinc-400 transition-colors" aria-label="Login">
                      <User className="w-6 h-6" />
                    </Link>
                  )}

                  {token && isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-zinc-800 ring-1 ring-black/5 dark:ring-zinc-700 focus:outline-none z-50">
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span>{t('menu_my_account')}</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer border-none"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>{t('menu_logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="flex md:hidden items-center gap-2">
              <div className="relative flex items-center border border-gray-200 dark:border-zinc-700 rounded-md bg-transparent overflow-hidden h-8 px-1">
                <Globe className="w-3 h-3 text-slate-700 dark:text-zinc-300 ml-1 mr-0.5" />
                <select
                  value={i18n.language?.startsWith('ru') ? 'ru' : 'en'}
                  onChange={changeLanguage}
                  className="bg-transparent text-xs text-slate-800 dark:text-zinc-100 focus:outline-none cursor-pointer appearance-none pr-2"
                >
                  <option value="en">EN</option>
                  <option value="ru">RU</option>
                </select>
              </div>

              <button
                onClick={toggleDarkMode}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-850 text-slate-900 dark:text-zinc-200 transition-colors focus:outline-none cursor-pointer"
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700 dark:text-zinc-400" />}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-850 text-slate-900 dark:text-zinc-200 transition-colors focus:outline-none cursor-pointer"
                aria-label="Toggle Mobile Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <div className="relative ml-auto flex h-full w-[280px] flex-col overflow-y-auto bg-white dark:bg-zinc-900 p-6 shadow-2xl transition-transform duration-300 ease-in-out z-50">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-850 pb-4 mb-6">
              <Link to="/home" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-zinc-50">fastcart</span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-slate-900 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  placeholder={t('search_placeholder')}
                  className="w-full bg-gray-100 dark:bg-zinc-800 py-2 pl-4 pr-10 rounded-md text-sm text-slate-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none border-none"
                />
                <Search className="absolute right-3 w-5 h-5 text-slate-900 dark:text-zinc-200 cursor-pointer" />
              </div>
            </div>
            
            <nav className="flex flex-col gap-4 text-base font-semibold text-slate-900 dark:text-zinc-200 mb-8">
              <Link
                to="/home"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-gray-50 dark:border-zinc-800/40 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                {t('nav_home')}
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-gray-50 dark:border-zinc-800/40 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                {t('nav_contact')}
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-gray-50 dark:border-zinc-800/40 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                {t('nav_about')}
              </Link>
              {!token && (
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 border-b border-gray-50 dark:border-zinc-800/40 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  {t('nav_signup')}
                </Link>
              )}
            </nav>
            
            <div className="mt-auto border-t border-gray-100 dark:border-zinc-800 pt-6">
              <div className="flex items-center justify-around gap-4 text-slate-900 dark:text-zinc-200">
                <Link
                  to="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1 hover:text-red-500 transition-colors relative"
                  aria-label="Wishlist"
                >
                  <div className="relative">
                    <Heart className="w-6 h-6" />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#DB4444] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {wishlistItems.length}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium">{t('nav_wishlist')}</span>
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1 hover:text-red-500 transition-colors relative"
                  aria-label="Cart"
                >
                  <div className="relative">
                    <ShoppingCart className="w-6 h-6" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#DB4444] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {cartItems.length}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium">{t('nav_cart')}</span>
                </Link>
                
                {token ? (
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col items-center gap-1 hover:text-red-500 transition-colors"
                    aria-label="Profile"
                  >
                    <User className="w-6 h-6" />
                    <span className="text-[11px] font-medium">{t('nav_profile')}</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col items-center gap-1 hover:text-red-500 transition-colors"
                    aria-label="Login"
                  >
                    <User className="w-6 h-6" />
                    <span className="text-[11px] font-medium">{t('nav_login')}</span>
                  </Link>
                )}
              </div>
              
              {token && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="mt-6 w-full py-2.5 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 font-semibold rounded-md hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors text-sm cursor-pointer border-none"
                >
                  {t('menu_logout')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>

      <footer className="w-full bg-black text-white pt-20 pb-6 font-sans">
        <div className="max-w-[1170px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-start">
          
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold tracking-wide">{t('footer_exclusive')}</h2>
            <h3 className="text-xl font-medium">{t('footer_subscribe')}</h3>
            <p className="text-sm text-gray-300">{t('footer_subscribe_text')}</p>
            <div className="relative flex items-center max-w-[210px] border-2 border-white rounded bg-black py-2 px-4">
              <input type="email" placeholder={t('footer_email_placeholder')} className="w-full bg-transparent text-sm text-gray-300 focus:outline-none placeholder-gray-500 pr-6" />
              <SendOutlinedIcon className="absolute right-3 text-white cursor-pointer" sx={{ fontSize: 20 }} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-medium tracking-wide">{t('footer_support')}</h2>
            <p className="text-sm text-gray-300 leading-6 whitespace-pre-wrap">{t('footer_address')}</p>
            <p className="text-sm text-gray-300">exclusive@gmail.com</p>
            <p className="text-sm text-gray-300">+88015-88888-9999</p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-medium tracking-wide">{t('footer_account')}</h2>
            <Link to="/" className="text-sm text-gray-300 hover:underline">{t('menu_my_account')}</Link>
            <Link to="/" className="text-sm text-gray-300 hover:underline">{t('footer_login_register')}</Link>
            <Link to="/cart" className="text-sm text-gray-300 hover:underline">{t('nav_cart')}</Link>
            <Link to="/wishlist" className="text-sm text-gray-300 hover:underline">{t('nav_wishlist')}</Link>
            <Link to="/home" className="text-sm text-gray-300 hover:underline">{t('footer_shop')}</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-medium tracking-wide">{t('footer_quick_link')}</h2>
            <Link to="/" className="text-sm text-gray-300 hover:underline">{t('footer_privacy_policy')}</Link>
            <Link to="/" className="text-sm text-gray-300 hover:underline">{t('footer_terms_of_use')}</Link>
            <Link to="/" className="text-sm text-gray-300 hover:underline">{t('footer_faq')}</Link>
            <Link to="/contact" className="text-sm text-gray-300 hover:underline">{t('nav_contact')}</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-medium tracking-wide">{t('footer_social')}</h2>
            <div className="flex items-center gap-6">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-white hover:text-gray-400 transition-colors"><FacebookIcon sx={{ fontSize: 24 }} /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-white hover:text-gray-400 transition-colors"><TwitterIcon sx={{ fontSize: 24 }} /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white hover:text-gray-400 transition-colors"><InstagramIcon sx={{ fontSize: 24 }} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-white hover:text-gray-400 transition-colors"><LinkedInIcon sx={{ fontSize: 24 }} /></a>
            </div>
          </div>

        </div>

        <div className="w-full border-t border-zinc-900 mt-16 pt-6 text-center text-zinc-650 text-base">
          <p>{t('footer_copyright')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;