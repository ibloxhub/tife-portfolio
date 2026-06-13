import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getSettings } from "@/lib/services/settings.service";

export async function generateMetadata(): Promise<Metadata> {
  const result = await getSettings();
  const settings = result.data;

  const seoDefaults = settings?.seo_defaults as { metaTitle?: string, metaDescription?: string } | null;
  const defaultTitle = seoDefaults?.metaTitle || settings?.site_name || "IBlox Studio";
  const defaultDescription = seoDefaults?.metaDescription || settings?.tagline || "Premium cinematic videography and photography for brands, weddings, and editorial campaigns worldwide.";

  return {
    title: {
      template: `%s | ${settings?.site_name || 'IBlox Studio'}`,
      default: defaultTitle,
    },
    description: defaultDescription,
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      siteName: settings?.site_name || "IBlox Studio",
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDescription,
    },
  };
}

import { ProgressBarProvider } from "@/components/providers/progress-bar-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ProgressBarProvider>{children}</ProgressBarProvider>
      </body>
    </html>
  );
}
