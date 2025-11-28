import type { Metadata } from "next";
import { Geist, Geist_Mono, Baloo_2, Mitr, Varela_Round, Quicksand, Lexend } from "next/font/google";
import "./globals.css";
import { Providers } from "@/shared/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Duolingo-inspired fonts for Vietnamese
const baloo = Baloo_2({
  subsets: ['vietnamese', 'latin'],
  variable: '--font-baloo',
  display: 'swap',
});

const mitr = Mitr({
  weight: ['400', '500', '600'],
  subsets: ['vietnamese', 'latin'],
  variable: '--font-mitr',
  display: 'swap',
});

const varela = Varela_Round({
  weight: ['400'],
  subsets: ['vietnamese', 'latin'],
  variable: '--font-varela',
  display: 'swap',
});

const quicksand = Quicksand({
  subsets: ['vietnamese', 'latin'],
  variable: '--font-quicksand',
  display: 'swap',
});

const lexend = Lexend({
  subsets: ['vietnamese', 'latin'],
  variable: '--font-lexend',
  display: 'swap',
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
