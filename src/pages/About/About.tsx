import { useNavigate } from "react-router-dom";
import { Store, DollarSign, ShoppingBag, Users, Truck, Headphones, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function About() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const stats = [
    {
      icon: <Store className="w-10 h-10" />,
      value: "10.5k",
      label: t('about_stat_sellers'),
    },
    {
      icon: <DollarSign className="w-10 h-10" />,
      value: "33k",
      label: t('about_stat_monthly'),
    },
    {
      icon: <ShoppingBag className="w-10 h-10" />,
      value: "45.5k",
      label: t('about_stat_customers'),
    },
    {
      icon: <Users className="w-10 h-10" />,
      value: "25k",
      label: t('about_stat_annual'),
    },
  ];

  const services = [
    {
      icon: <Truck className="w-10 h-10 text-white" />,
      title: t('about_service_delivery_title'),
      desc: t('about_service_delivery_desc'),
    },
    {
      icon: <Headphones className="w-10 h-10 text-white" />,
      title: t('about_service_support_title'),
      desc: t('about_service_support_desc'),
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-white" />,
      title: t('about_service_guarantee_title'),
      desc: t('about_service_guarantee_desc'),
    },
  ];

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
        <span className="text-black dark:text-white font-semibold">{t('nav_about')}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-20">
        <div className="md:col-span-6 flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t('about_title')}
          </h1>
          <p className="text-base text-gray-600 dark:text-zinc-300 leading-7">
            {t('about_p1')}
          </p>
          <p className="text-base text-gray-600 dark:text-zinc-300 leading-7">
            {t('about_p2')}
          </p>
        </div>
        <div className="md:col-span-6 rounded-lg overflow-hidden h-[300px] md:h-[400px]">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1000"
            alt={t('about_title')}
            className="w-full h-full object-cover shadow-md hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-8 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-[#DB4444] dark:hover:bg-[#DB4444] hover:text-white dark:hover:text-white hover:border-[#DB4444] dark:hover:border-[#DB4444] group transition-all duration-300 shadow-xs cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-6 group-hover:bg-white/20 group-hover:text-white text-slate-900 dark:text-zinc-100 transition-colors duration-300">
              <div className="w-12 h-12 rounded-full bg-slate-900 dark:bg-zinc-700 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#DB4444] transition-colors duration-300">
                {stat.icon}
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-2 tracking-tight">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 group-hover:text-white/90 text-center font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
        {services.map((service, idx) => (
          <div key={idx} className="flex flex-col items-center text-center px-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center mb-6">
              <div className="w-14 h-14 rounded-full bg-slate-950 dark:bg-zinc-700 flex items-center justify-center">
                {service.icon}
              </div>
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-wide">
              {service.title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              {service.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
