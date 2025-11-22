import type React from "react"

interface LearningMethodProps {
  image: string
  altText: string
  title: string
  description: React.ReactNode
}

export const LearningMethod: React.FC<LearningMethodProps> = ({ image, altText, title, description }) => {
  return (
    <article className="flex flex-row items-center gap-10 max-md:flex-col">
      <div className="flex-shrink-0 w-full max-w-[532px]">
        <img
          src={image || "/placeholder.svg"}
          alt={altText}
          className="w-full h-auto rounded-[20px] border-[1px] border-dashed border-[#666] object-cover"
        />
      </div>
      <div className="flex flex-col max-w-[520px]">
        <h3 className="text-[#3F3F3F] text-[40px] mb-6 max-md:text-[32px] max-sm:text-[28px]">{title}</h3>
        <p className="text-[#666] text-xl max-md:text-lg max-sm:text-base">{description}</p>
      </div>
    </article>
  )
}
