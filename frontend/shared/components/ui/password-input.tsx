'use client'

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/shared/utils/cn"

type PasswordInputProps = Omit<React.ComponentProps<"input">, 'type'>

function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        data-slot="input"
        className={cn(
          // Base styles
          "h-12 w-full min-w-0 px-4 py-3 pr-12 text-base",
          "rounded-xl border-[3px] border-gray-300",
          "bg-white text-gray-900",
          "transition-all duration-200",
          "outline-none",

          // Placeholder styles
          "placeholder:text-gray-400 placeholder:font-normal",

          // Selection styles
          "selection:bg-ds-primary selection:text-white",

          // Focus styles
          "focus:border-ds-primary focus:ring-4 focus:ring-ds-primary/20",
          "focus:shadow-[0_4px_8px_color-mix(in_srgb,var(--ds-primary)_15%,transparent)]",

          // Error/Invalid styles
          "aria-invalid:border-ds-error aria-invalid:ring-4 aria-invalid:ring-ds-error/20",
          "aria-invalid:animate-shake",

          // Disabled styles
          "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60",

          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2",
          "p-1 rounded-md",
          "text-gray-400 hover:text-gray-600",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ds-primary/50"
        )}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  )
}

export { PasswordInput }
