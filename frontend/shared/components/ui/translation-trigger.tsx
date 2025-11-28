"use client"

import * as React from "react"
import { Languages } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { cn } from "@/shared/utils/cn"

interface TranslationTriggerProps {
  translation: string
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  className?: string
  iconClassName?: string
  disabled?: boolean
}

/**
 * TranslationTrigger - A responsive component that shows translations
 * - Desktop (>= 768px): Uses Tooltip (hover to show)
 * - Mobile/Tablet (< 768px): Uses Popover (tap to toggle)
 */
export function TranslationTrigger({
  translation,
  side = "top",
  align = "center",
  className,
  iconClassName,
  disabled = false,
}: TranslationTriggerProps) {
  const [isMobile, setIsMobile] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  // Detect mobile/tablet on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (disabled || !translation) {
    return null
  }

  const triggerButton = (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "p-1 h-7 w-7 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors",
        className
      )}
      aria-label="Show translation"
    >
      <Languages className={cn("h-4 w-4", iconClassName)} />
    </Button>
  )

  const contentText = (
    <p className="text-sm text-gray-700 italic leading-relaxed">
      {translation}
    </p>
  )

  // Mobile: Use Popover (tap to toggle)
  if (isMobile) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
        <PopoverContent
          side={side}
          align={align}
          className="w-auto max-w-xs bg-white border-2 border-emerald-200 shadow-xl"
        >
          {contentText}
        </PopoverContent>
      </Popover>
    )
  }

  // Desktop: Use Tooltip (hover to show)
  return (
    <Tooltip>
      <TooltipTrigger asChild>{triggerButton}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        className="max-w-xs bg-white text-gray-900 border-2 border-emerald-200 shadow-xl"
      >
        {contentText}
      </TooltipContent>
    </Tooltip>
  )
}
