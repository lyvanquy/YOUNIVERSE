import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Nunito, Montserrat, Space_Grotesk } from "next/font/google";
import YouniverseApp from "./YouniverseApp";
import JsonLd from "./components/JsonLd";
import { AUTH_SESSION_HINT_KEY } from "./lib/api";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://youniverse.io.vn"),
  title: {
    default: "YOUniverse - Phụ kiện & Charm cá nhân hóa độc bản",
    template: "%s | YOUniverse",
  },
  description: "Unspoken Desires, Bespoken YOUniverse. YOUniverse chuyên cung cấp các sản phẩm charm thủ công tinh tế giúp bạn khẳng định bản sắc cá nhân và giao tiếp thầm lặng.",
  keywords: ["YOUniverse", "charm ca nhan hoa", "phu kien ca nhan hoa", "moc khoa thu cong", "custom charm", "Astra", "Sirius", "Polaris", "UEH ISB"],
  authors: [{ name: "YOUniverse Team" }],
  creator: "YOUniverse",
  publisher: "YOUniverse",
  category: "Phụ kiện cá nhân hóa",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico?v=2",
    apple: "/icon.png",
  },
  openGraph: {
    title: "YOUniverse - Phụ kiện & Charm cá nhân hóa độc bản",
    description: "Unspoken Desires, Bespoken YOUniverse. Tự thiết kế vũ trụ móc khóa của riêng bạn.",
    url: "https://youniverse.io.vn",
    siteName: "YOUniverse",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "YOUniverse - Phụ kiện và charm cá nhân hóa",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YOUniverse - Phụ kiện & Charm cá nhân hóa độc bản",
    description: "Tự thiết kế vũ trụ móc khóa của riêng bạn.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c0a09",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const storedLanguage = cookieStore.get("youniverse_lang")?.value;
  const initialLanguage: "en" | "vi" = storedLanguage === "en" ? "en" : "vi";
  const encodedSessionName = cookieStore.get(AUTH_SESSION_HINT_KEY)?.value;
  let initialSessionName: string | null = null;

  if (encodedSessionName) {
    try {
      initialSessionName = decodeURIComponent(encodedSessionName).slice(0, 100);
    } catch {
      initialSessionName = null;
    }
  }

  return (
    <html 
      lang={initialLanguage}
      className={`h-full antialiased ${nunito.variable} ${montserrat.variable} ${spaceGrotesk.variable} ${initialLanguage === "vi" ? "lang-vi" : ""}`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd
          id="site-structured-data"
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://youniverse.io.vn/#organization",
                name: "YOUniverse",
                url: "https://youniverse.io.vn/",
                logo: "https://youniverse.io.vn/icon.png",
                description: "Thương hiệu phụ kiện và charm thủ công cá nhân hóa dành cho thế hệ trẻ.",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "279 Nguyễn Tri Phương, Phường 5, Quận 10",
                  addressLocality: "Thành phố Hồ Chí Minh",
                  addressCountry: "VN",
                },
                sameAs: [
                  "https://www.tiktok.com/@youniverse_ueh.isb",
                  "https://www.instagram.com/youniverse_since2026/",
                ],
              },
              {
                "@type": "WebSite",
                "@id": "https://youniverse.io.vn/#website",
                url: "https://youniverse.io.vn/",
                name: "YOUniverse",
                inLanguage: "vi-VN",
                publisher: { "@id": "https://youniverse.io.vn/#organization" },
              },
            ],
          }}
        />
        <YouniverseApp
          initialLanguage={initialLanguage}
          initialSessionName={initialSessionName}
        >
          {children}
        </YouniverseApp>
      </body>
    </html>
  );
}

