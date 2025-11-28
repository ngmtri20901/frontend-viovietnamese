import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-offset-2 active:translate-y-1 uppercase tracking-wide",
  {
    variants: {
      variant: {
        // Primary - Vibrant Pink (Duolingo style with bottom shadow)
        default: [
          "bg-ds-primary text-ds-primary-foreground rounded-2xl",
          "shadow-[0_6px_0_0_var(--ds-primary-active)]",
          "hover:bg-ds-primary-hover hover:-translate-y-0.5 hover:shadow-[0_8px_0_0_var(--ds-primary-active)]",
          "active:shadow-[0_2px_0_0_var(--ds-primary-active)] active:translate-y-1",
          "focus-visible:ring-ds-primary/30",
        ].join(" "),

        // Secondary - Purple
        secondary: [
          "bg-ds-secondary text-ds-secondary-foreground rounded-2xl",
          "shadow-[0_6px_0_0_var(--ds-secondary-active)]",
          "hover:bg-ds-secondary-hover hover:-translate-y-0.5 hover:shadow-[0_8px_0_0_var(--ds-secondary-active)]",
          "active:shadow-[0_2px_0_0_var(--ds-secondary-active)] active:translate-y-1",
          "focus-visible:ring-ds-secondary/30",
        ].join(" "),

        // Accent - Golden Yellow
        accent: [
          "bg-ds-accent text-ds-accent-foreground rounded-2xl",
          "shadow-[0_6px_0_0_var(--ds-accent-active)]",
          "hover:bg-ds-accent-hover hover:-translate-y-0.5 hover:shadow-[0_8px_0_0_var(--ds-accent-active)]",
          "active:shadow-[0_2px_0_0_var(--ds-accent-active)] active:translate-y-1",
          "focus-visible:ring-ds-accent/30",
        ].join(" "),

        // Destructive - Error Red
        destructive: [
          "bg-ds-error text-white rounded-2xl",
          "shadow-[0_6px_0_0_var(--ds-error-active)]",
          "hover:bg-[#ff5e5e] hover:-translate-y-0.5 hover:shadow-[0_8px_0_0_var(--ds-error-active)]",
          "active:shadow-[0_2px_0_0_var(--ds-error-active)] active:translate-y-1",
          "focus-visible:ring-ds-error/30",
        ].join(" "),

        // Outline - White with border
        outline: [
          "border-3 border-gray-300 bg-white text-gray-700 rounded-2xl",
          "shadow-[0_4px_0_0_rgba(0,0,0,0.1)]",
          "hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_rgba(0,0,0,0.1)]",
          "active:shadow-[0_2px_0_0_rgba(0,0,0,0.1)] active:translate-y-0.5",
          "focus-visible:ring-gray-300/50",
        ].join(" "),

        // Ghost - Transparent with hover fill
        ghost: [
          "rounded-2xl text-gray-700 bg-transparent",
          "hover:bg-gray-100",
          "active:bg-gray-200",
          "focus-visible:ring-gray-300/50",
        ].join(" "),

        // Link - Text only
        link: "text-ds-primary underline-offset-4 hover:underline active:text-ds-primary-active",
      },
      size: {
        sm: "h-10 px-4 text-xs rounded-xl",
        default: "h-12 px-6 py-3 text-sm",
        lg: "h-14 px-8 py-4 text-base",
        xl: "h-16 px-10 py-5 text-lg",
        icon: "size-12 rounded-2xl",
        "icon-sm": "size-10 rounded-xl",
        "icon-lg": "size-14 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
