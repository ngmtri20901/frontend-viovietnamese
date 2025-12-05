"use client"

import type React from "react"
import { Button } from "@/shared/components/ui/button"
import Link from "next/link"


const DoubleUnderline = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>

      {/* SVG underline hand-drawn */}
      <svg
        className="absolute left-0 right-0 w-full h-[12px] bottom-[-2px]"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
      >
        {/* Nét dưới – mờ */}
        <path
          d="M2 8 C 30 2, 70 14, 98 6"
          stroke="rgba(168, 85, 247, 0.25)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Nét trên – đậm + hiệu ứng "tưa" */}
        <path
          className="animate-handdraw"
          d="M2 4 C 30 0, 70 10, 98 3"
          stroke="#a855f7"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            filter: "url(#roughEdge)"
          }}
        />
        <defs>
          {/* Blur nhẹ tạo hiệu ứng đầu nét tưa */}
          <filter id="roughEdge">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" />
          </filter>
        </defs>
      </svg>

      <style>{`
        @keyframes handdraw {
          from {
            stroke-dasharray: 0 200;
          }
          to {
            stroke-dasharray: 200 0;
          }
        }
        .animate-handdraw {
          stroke-dasharray: 200 0;
          animation: handdraw 1.5s ease-out infinite;
        }
      `}</style>
    </span>
  );
};


// 2. Component cho hiệu ứng vòng tròn Oval (Affordable)
const OvalHighlight = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="relative inline-block px-2 mx-1">
      <span className="relative z-10">{children}</span>
      {/* SVG vẽ vòng tròn */}
      <svg
        className="absolute top-[-10%] left-[-5%] w-[110%] h-[120%] z-0 pointer-events-none overflow-visible"
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
      >
        <path
          d="M10,30 Q40,5 100,5 T190,30 Q190,55 100,55 T10,30"
          fill="none"
          stroke="#F9C449" /* Màu đỏ (red-500) hoặc đổi màu tùy ý */
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-oval-draw"
        />
      </svg>

      {/* CSS Keyframes cho nét vẽ SVG */}
      <style>{`
        .animate-oval-draw {
          stroke-dasharray: 450; /* Độ dài ước lượng của đường vẽ */
          stroke-dashoffset: 450; /* Bắt đầu ẩn hoàn toàn */
          animation: drawOval 3s ease-out infinite 0.5s; /* Delay 0.5s để chờ người dùng nhìn thấy */
        }
        @keyframes drawOval {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </span>
  );
};
export const Hero: React.FC = () => {
  const handleExploreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const methodsSection = document.getElementById('methods')
    if (methodsSection) {
      methodsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-10 py-20">
      {/* Left side: Text and buttons */}
      <div className="flex flex-col max-w-[650px]">
      <h1 className="font-display text-ds-primary text-[54px] leading-[1.3] tracking-tight font-bold mb-6 max-md:text-[44px] max-sm:text-4xl">
          More <DoubleUnderline>Structure</DoubleUnderline> Than 
          <span className="text-neutral-400"> Duolingo</span>.
          More <OvalHighlight>Affordable</OvalHighlight> Than 
          <span className="text-neutral-400"> iTalki</span>.
        </h1>

        
        <p className="font-body text-slate-500 text-[22px] leading-relaxed mb-10 max-md:text-xl max-sm:text-lg">
          Book-based lessons, clear progression, practice activities for every topic — powered by AI. And yes, you can start for <span className="font-bold">free</span>.
        </p>
        
        <div className="flex gap-4 max-sm:flex-col"> 
          <Link href="/auth/sign-up"> 
            <Button size="lg" className="text-lg"> Start Free </Button> 
          </Link>
          <a href="#methods" onClick={handleExploreClick}>
            <Button variant="outline" size="lg" className="text-base"> 
              <span>Explore</span> 
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6.98953 15.75L10.4843 19.25M10.4843 19.25L13.9791 15.75M10.4843 19.25V1.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> </svg> 
            </Button>
          </a> </div>
      </div>

      {/* Right side: Image */}
      <div className="flex-shrink-0">
        <img
          src="/images/brand/landing/hero.webp"
          alt="Person learning Vietnamese with flags"
          className="w-[500px] h-auto rounded-[10px] object-cover"
        />
      </div>
    </section>
  )
}
