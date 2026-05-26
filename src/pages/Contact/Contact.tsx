import PhoneIcon from '@mui/icons-material/LocalPhoneOutlined';
import MailIcon from '@mui/icons-material/MailOutlineOutlined';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-[#f9f9f9] dark:bg-zinc-950 min-h-screen py-10 px-4 md:px-16 transition-colors duration-200">
      <div className="max-w-[1170px] mx-auto">
        
        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 mb-10 text-gray-500 dark:text-zinc-400 text-[14px]">
          <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">{t('nav_home')}</Link>
          <span>/</span>
          <span className="font-medium text-black dark:text-zinc-200">{t('nav_contact')}</span>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Левая панель: Информация */}
          <div className="col-span-12 lg:col-span-4">
            <div className="p-8 h-full flex flex-col justify-between rounded-[4px] border border-[#f0f0f0] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] transition-colors">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-[#DB4444] rounded-full flex items-center justify-center text-white">
                    <PhoneIcon fontSize="small" />
                  </div>
                  <h3 className="text-base font-semibold text-black dark:text-zinc-100">{t('contact_call_to_us')}</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-zinc-300 mb-4">{t('contact_call_desc')}</p>
                <p className="text-sm text-gray-900 dark:text-zinc-100">{t('contact_phone')}</p>
              </div>

              <hr className="my-8 border-t border-[#e0e0e0] dark:border-zinc-800" />

              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-[#DB4444] rounded-full flex items-center justify-center text-white">
                    <MailIcon fontSize="small" />
                  </div>
                  <h3 className="text-base font-semibold text-black dark:text-zinc-100">{t('contact_write_to_us')}</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-zinc-300 mb-4">{t('contact_write_desc')}</p>
                <p className="text-sm text-gray-900 dark:text-zinc-100 mb-2">{t('contact_email_customer')}</p>
                <p className="text-sm text-gray-900 dark:text-zinc-100">{t('contact_email_support')}</p>
              </div>
            </div>
          </div>

          {/* Правая панель: Форма */}
          <div className="col-span-12 lg:col-span-8">
            <div className="p-8 h-full rounded-[4px] border border-[#f0f0f0] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] transition-colors">
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-8">
                
                {/* Три поля в ряд */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder={t('contact_placeholder_name')}
                    className="w-full bg-[#F5F5F5] dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 rounded px-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#DB4444] transition-colors border-none"
                  />
                  <input
                    type="email"
                    placeholder={t('contact_placeholder_email')}
                    className="w-full bg-[#F5F5F5] dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 rounded px-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#DB4444] transition-colors border-none"
                  />
                  <input
                    type="tel"
                    placeholder={t('contact_placeholder_phone')}
                    className="w-full bg-[#F5F5F5] dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 rounded px-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#DB4444] transition-colors border-none"
                  />
                </div>

                {/* Поле сообщения */}
                <div>
                  <textarea
                    placeholder={t('contact_placeholder_message')}
                    rows={7}
                    className="w-full bg-[#F5F5F5] dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 rounded px-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#DB4444] transition-colors resize-none border-none"
                  />
                </div>

                {/* Кнопка отправки */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#DB4444] hover:bg-[#c33d3d] text-white px-12 py-4 text-sm font-semibold rounded-[4px] w-full md:w-auto transition-colors border-none cursor-pointer"
                  >
                    {t('contact_send_button')}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}