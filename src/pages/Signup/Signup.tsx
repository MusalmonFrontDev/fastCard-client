import { type FormEvent, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setToken } from "../../UserSlice/userSlice";
import api from "../../lib/axios";
import Dialog from "../../components/ui/Dialog";
import { useTranslation } from "react-i18next";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info";
    onClose?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showDialog = (title: string, message: string, type: "success" | "error" | "info", onClose?: () => void) => {
    setDialog({
      isOpen: true,
      title,
      message,
      type,
      onClose,
    });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showDialog(t('dialog_error'), t('signup_passwords_mismatch'), "error");
      return;
    }
    try {
      const response = await api.post("/Account/register", {
        userName,
        phoneNumber,
        email,
        password,
        confirmPassword,
      });
      const result = response.data;
      if (result.statusCode === 200) {
        const loginResponse = await api.post("/Account/login", {
          userName,
          password,
        });
        const loginResult = loginResponse.data;
        if (loginResult.statusCode === 200 && loginResult.data) {
          dispatch(setToken(loginResult.data));
          showDialog(t('dialog_success'), t('signup_success'), "success", () => {
            navigate("/home");
          });
        } else {
          showDialog(t('dialog_error'), loginResult.errors?.[0] || t('login_error_default'), "error");
        }
      } else {
        showDialog(t('dialog_error'), result.errors?.[0] || t('signup_error_default'), "error");
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.errors?.[0] || error.message || t('signup_error_default');
      showDialog(t('dialog_error'), errorMessage, "error");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-[85vh] font-sans px-4 py-12 bg-gray-50 dark:bg-zinc-950 transition-colors">
        <form onSubmit={handleRegister} className="w-full max-w-[450px] p-6 sm:p-10 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-gray-100 dark:border-zinc-800 transition-colors">
          <h1 className="text-3xl sm:text-4xl font-semibold mb-3 text-slate-900 dark:text-zinc-50 tracking-tight">{t('signup_title')}</h1>
          <p className="text-base text-gray-500 dark:text-zinc-400 mb-8">{t('signup_subtitle')}</p>
          
          <div className="relative mb-6">
            <label className="absolute left-4 -top-2.5 bg-white dark:bg-zinc-900 px-1.5 text-xs font-semibold text-gray-500 dark:text-zinc-400 transition-colors">{t('signup_username')}</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full h-11 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded px-4 text-base text-slate-900 dark:text-zinc-50 outline-none focus:border-red-500 dark:focus:border-red-500 transition-colors"
            />
          </div>

          <div className="relative mb-6">
            <label className="absolute left-4 -top-2.5 bg-white dark:bg-zinc-900 px-1.5 text-xs font-semibold text-gray-500 dark:text-zinc-400 transition-colors">{t('signup_phone')}</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full h-11 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded px-4 text-base text-slate-900 dark:text-zinc-50 outline-none focus:border-red-500 dark:focus:border-red-500 transition-colors"
            />
          </div>

          <div className="relative mb-6">
            <label className="absolute left-4 -top-2.5 bg-white dark:bg-zinc-900 px-1.5 text-xs font-semibold text-gray-500 dark:text-zinc-400 transition-colors">{t('signup_email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded px-4 text-base text-slate-900 dark:text-zinc-50 outline-none focus:border-red-500 dark:focus:border-red-500 transition-colors"
            />
          </div>

          <div className="relative mb-6">
            <label className="absolute left-4 -top-2.5 bg-white dark:bg-zinc-900 px-1.5 text-xs font-semibold text-gray-500 dark:text-zinc-400 transition-colors">{t('signup_password')}</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded pl-4 pr-12 text-base text-slate-900 dark:text-zinc-50 outline-none focus:border-red-500 dark:focus:border-red-500 transition-colors"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 cursor-pointer text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 flex items-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>

          <div className="relative mb-8">
            <label className="absolute left-4 -top-2.5 bg-white dark:bg-zinc-900 px-1.5 text-xs font-semibold text-gray-500 dark:text-zinc-400 transition-colors">{t('signup_confirm_password')}</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full h-11 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded px-4 text-base text-slate-900 dark:text-zinc-50 outline-none focus:border-red-500 dark:focus:border-red-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-[#db4444] hover:bg-red-600 text-white rounded text-base font-semibold transition-colors cursor-pointer border-none"
          >
            {t('signup_button')}
          </button>
        </form>
      </div>
      <div className="text-center mb-10 text-slate-700 dark:text-zinc-300">
        {t('signup_already_have')} 
        <Link to="/login" className="text-sm hover:underline ml-2 font-bold text-red-500 dark:text-red-400">{t('signup_login_link')}</Link>
      </div>
      <Dialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onClose={() => {
          setDialog((prev) => ({ ...prev, isOpen: false }));
          if (dialog.onClose) dialog.onClose();
        }}
      />
    </>
  );
}