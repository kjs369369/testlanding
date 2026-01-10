import type { Metadata } from "next";
import { Space_Grotesk, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

const siteUrl = "https://landingtest12.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "aimay 식물관리기",
    template: "%s | aimay AI",
  },
  description: "식물관리의 시작. 물 주기, 햇빛, 비료 일정을 자동으로 관리하고 알림을 받으세요.",
  alternates: {
    canonical: siteUrl,
    languages: { ko: `${siteUrl}/` },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "aimay 식물관리기",
    description: "당신의 식물을 스마트하게 관리하세요. 물 주기, 햇빛, 비료 일정을 자동으로 관리하고 알림을 받으세요.",
    siteName: "aimay",
    locale: "ko_KR",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: "aimay 식물관리기 - 스마트한 식물 관리의 시작",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "aimay 식물관리기",
    description: "당신의 식물을 스마트하게 관리하세요.",
    images: [`${siteUrl}/logo.png`],
    site: "@aimay",
    creator: "@aimay",
  },
  keywords: ["식물관리AI", "식물 관리", "물주기 알림", "식물 앱"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${spaceGrotesk.variable} ${notoSansKR.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-stone-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
