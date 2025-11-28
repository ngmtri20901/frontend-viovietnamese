import Image from "next/image"
import Link from "next/link"

export function AppLogo({
  className = "",
  size = "medium",
}: { className?: string; size?: "small" | "medium" | "large" }) {
  const dimensions = {
    small: { width: 120, height: 40 },
    medium: { width: 180, height: 60 },
    large: { width: 240, height: 80 },
  }

  const { width, height } = dimensions[size]

  return (
    <Link href="/" className={`block ${className}`}>
      <Image
        src="/images/brand/logo.png"
        alt="VietnameseNext Logo"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
    </Link>
  )
}
