import type React from "react"

interface LearningMethodProps {
  image?: string
  altText: string
  title: string
  description: React.ReactNode
  children?: React.ReactNode
}

export const LearningMethod: React.FC<LearningMethodProps> = ({ image, altText, title, description, children }) => {
  return (
    <article className="flex flex-row items-center gap-10 max-md:flex-col">
      <div className="flex-shrink-0 w-full max-w-[532px]">
        {children || (
          <img
            src={image || "/placeholder.svg"}
            alt={altText}
            className="w-full h-auto rounded-[20px] border-[1px] border-dashed border-ds-border object-cover"
          />
        )}
      </div>
      <div className="flex flex-col max-w-[520px]">
        <h3 className="font-title text-neutral-600 text-[40px] font-semibold mb-6 max-md:text-[32px] max-sm:text-[28px]">{title}</h3>
        <p className="font-body text-gray-600 text-xl leading-relaxed max-md:text-lg max-sm:text-base">{description}</p>
      </div>
    </article>
  )
}
