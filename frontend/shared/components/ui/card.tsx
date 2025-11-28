import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/utils/cn"

const cardVariants = cva(
  "bg-white text-gray-900 flex flex-col gap-6 py-6 transition-all",
  {
    variants: {
      variant: {
        // Default - Clean card with border and subtle shadow
        default: [
          "rounded-[20px] border-[3px] border-gray-200",
          "shadow-[0_4px_8px_color-mix(in_srgb,var(--ds-primary)_12%,transparent)]",
        ].join(" "),

        // Interactive - Card with hover effect and bottom shadow
        interactive: [
          "rounded-[20px] border-[3px] border-gray-200",
          "shadow-[0_4px_0_0_rgba(0,0,0,0.1)]",
          "hover:shadow-[0_6px_0_0_rgba(0,0,0,0.15)] hover:-translate-y-1",
          "active:shadow-[0_2px_0_0_rgba(0,0,0,0.1)] active:translate-y-0.5",
          "cursor-pointer",
        ].join(" "),

        // Highlighted - Pink accent border
        highlighted: [
          "rounded-[20px] border-[3px] border-ds-primary",
          "shadow-[0_4px_8px_color-mix(in_srgb,var(--ds-primary)_20%,transparent)]",
        ].join(" "),

        // Success - Purple accent border
        success: [
          "rounded-[20px] border-[3px] border-ds-secondary",
          "shadow-[0_4px_8px_color-mix(in_srgb,var(--ds-secondary)_20%,transparent)]",
        ].join(" "),

        // Accent - Yellow accent border
        accent: [
          "rounded-[20px] border-[3px] border-ds-accent",
          "shadow-[0_4px_8px_color-mix(in_srgb,var(--ds-accent)_20%,transparent)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Card({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
