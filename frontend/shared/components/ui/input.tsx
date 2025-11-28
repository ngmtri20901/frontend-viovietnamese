import * as React from "react"

import { cn } from "@/shared/utils/cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        "h-12 w-full min-w-0 px-4 py-3 text-base",
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

        // File input styles
        "file:text-gray-700 file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-semibold file:mr-4",

        className
      )}
      {...props}
    />
  )
}

export { Input }
