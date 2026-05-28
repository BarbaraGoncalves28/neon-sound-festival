import type { LucideIcon } from 'lucide-react'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon
  label: string
  error?: string
  endAdornment?: ReactNode
}

export function AuthField({
  icon: Icon,
  label,
  error,
  endAdornment,
  className,
  ...props
}: AuthFieldProps) {
  const fieldId =
    props.id ?? props.name ?? label.toLowerCase().replace(/\s+/g, '-')
  const errorId = error ? `${fieldId}-error` : undefined

  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="text-sm font-medium text-white/80">
        {label}
      </label>

      <div
        className={`flex items-center gap-3 rounded-3xl border border-white/10 bg-black/40 px-4 py-3 transition duration-300 focus-within:border-purple-400/70 focus-within:ring-2 focus-within:ring-purple-400/30 ${className ?? ''}`}
      >
        <Icon size={18} className="text-purple-300" />

        <input
          {...props}
          id={fieldId}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className="w-full bg-transparent text-white placeholder:text-white/40 outline-none"
        />

        {endAdornment && (
          <div className="flex items-center">{endAdornment}</div>
        )}
      </div>

      {error && (
        <p id={errorId} className="text-sm text-pink-400">
          {error}
        </p>
      )}
    </div>
  )
}
