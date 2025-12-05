import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/shared/components/providers";

const geistSans = localFont({
  src: [
    {
      path: "../public/fonts/geist/Geist-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/geist/Geist-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/geist/Geist-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/geist/Geist-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: [
    {
      path: "../public/fonts/geist-mono/GeistMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/geist-mono/GeistMono-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/geist-mono/GeistMono-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
  display: "swap",
});

// Duolingo-inspired fonts for Vietnamese
const baloo = localFont({
  src: [
    {
      path: "../public/fonts/baloo/Baloo2-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/baloo/Baloo2-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/baloo/Baloo2-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/baloo/Baloo2-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/baloo/Baloo2-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-baloo",
  display: "swap",
});

const mitr = localFont({
  src: [
    {
      path: "../public/fonts/mitr/Mitr-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/mitr/Mitr-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/mitr/Mitr-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-mitr",
  display: "swap",
});

const varela = localFont({
  src: [
    {
      path: "../public/fonts/varela/VarelaRound-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-varela",
  display: "swap",
});

const quicksand = localFont({
  src: [
    {
      path: "../public/fonts/quicksand/Quicksand-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/quicksand/Quicksand-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/quicksand/Quicksand-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/quicksand/Quicksand-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/quicksand/Quicksand-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-quicksand",
  display: "swap",
});

const lexend = localFont({
  src: [
    {
      path: "../public/fonts/lexend/Lexend-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/lexend/Lexend-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/lexend/Lexend-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/lexend/Lexend-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/lexend/Lexend-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/lexend/Lexend-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/lexend/Lexend-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/lexend/Lexend-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/lexend/Lexend-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VioVietnamese – Learn Vietnamese",
  description: "Master Vietnamese with interactive flashcards, exercises, and AI-powered practice. Learn vocabulary, grammar, and conversation skills through engaging, gamified lessons.",
  keywords: ["learn vietnamese", "vietnamese language", "vietnamese learning app", "vietnamese flashcards", "vietnamese lessons", "AI vietnamese tutor"],
  authors: [{ name: "VioVietnamese Team" }],
  icons: {
    icon: [
      { url: "/images/icon/favicon/favicon.ico", sizes: "any" },
      { url: "/images/icon/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/images/icon/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/images/icon/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/images/icon/favicon/site.webmanifest",
  openGraph: {
    title: "VioVietnamese – Learn Vietnamese",
    description: "Master Vietnamese with interactive flashcards, exercises, and AI-powered practice.",
    type: "website",
    locale: "vi_VN",
    siteName: "VioVietnamese",
  },
  twitter: {
    card: "summary_large_image",
    title: "VioVietnamese – Learn Vietnamese",
    description: "Master Vietnamese with interactive flashcards, exercises, and AI-powered practice.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${baloo.variable} ${mitr.variable} ${varela.variable} ${quicksand.variable} ${lexend.variable} ${geistSans.variable} ${geistMono.variable}`}>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
