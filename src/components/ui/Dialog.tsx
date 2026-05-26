import { type FormEvent } from "react";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error" | "info";
}

export default function Dialog({ isOpen, onClose, title, message, type = "info" }: DialogProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: FormEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-12 h-12 text-emerald-500" />;
      case "error":
        return <XCircle className="w-12 h-12 text-rose-500" />;
      default:
        return <AlertCircle className="w-12 h-12 text-amber-500" />;
    }
  };

  const getHeaderColor = () => {
    switch (type) {
      case "success":
        return "text-emerald-600 dark:text-emerald-450";
      case "error":
        return "text-rose-600 dark:text-rose-455";
      default:
        return "text-slate-800 dark:text-zinc-100";
    }
  };

  return (
    <div
      onClick={handleBackdropClick as any}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300"
    >
      <div className="relative w-full max-w-md p-6 overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-zinc-800 transform scale-100 transition-all duration-300 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-350 transition-colors p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          {getIcon()}
        </div>

        <h3 className={`text-xl font-semibold mb-2 ${getHeaderColor()}`}>
          {title}
        </h3>

        <p className="text-slate-600 dark:text-zinc-300 text-sm mb-6 leading-relaxed">
          {message}
        </p>

        <button
          onClick={onClose}
          className={`w-full py-2.5 px-4 text-white font-medium rounded-lg shadow-md hover:shadow-lg active:scale-98 transition-all duration-150 ${
            type === "success"
              ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
              : type === "error"
              ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
              : "bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/20"
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
}
