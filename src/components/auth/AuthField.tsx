import { InputHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  label: string;
  error?: string;
  endAdornment?: ReactNode;
}

export function AuthField({
  icon: Icon,
  label,
  error,
  endAdornment,
  className,
  ...props
}: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/80">{label}</label>

      <div
        className={`flex items-center gap-3 rounded-3xl border border-white/10 bg-black/40 px-4 py-3 transition duration-300 focus-within:border-purple-400/70 ${className ?? ""}`}
      >
        <Icon size={18} className="text-purple-300" />

        <input
          {...props}
          className="w-full bg-transparent text-white placeholder:text-white/40 outline-none"
        />

        {endAdornment && <div className="flex items-center">{endAdornment}</div>}
      </div>

      {error && <p className="text-sm text-pink-400">{error}</p>}
    </div>
  );
}
