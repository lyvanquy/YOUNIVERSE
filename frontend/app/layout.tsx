import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Nunito, Montserrat, Space_Grotesk, Inter } from "next/font/google";
import YouniverseApp from "./YouniverseApp";
import { AUTH_SESSION_HINT_KEY } from "./lib/api";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://youniverse.io.vn"),
  title: {
    default: "YOUniverse - Phụ kiện & Charm cá nhân hóa độc bản",
    template: "%s | YOUniverse",
  },
  description: "A galaxy to hold, a story to be told. YOUniverse chuyên cung cấp các sản phẩm charm thủ công tinh tế giúp bạn khẳng định bản sắc cá nhân và giao tiếp thầm lặng.",
  keywords: ["YOUniverse", "charm ca nhan hoa", "phu kien ca nhan hoa", "moc khoa thu cong", "custom charm", "Astra", "Sirius", "Polaris", "UEH ISB"],
  authors: [{ name: "YOUniverse Team" }],
  icons: {
    icon: "/favicon.ico?v=2",
  },
  openGraph: {
    title: "YOUniverse - Phụ kiện & Charm cá nhân hóa độc bản",
    description: "A galaxy to hold, a story to be told. Tự thiết kế vũ trụ móc khóa của riêng bạn.",
    url: "https://youniverse.io.vn",
    siteName: "YOUniverse",
    images: [
      {
        url: "/images/home-banner.png",
        width: 1200,
        height: 630,
        alt: "YOUniverse Cosmos",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YOUniverse - Phụ kiện & Charm cá nhân hóa độc bản",
    description: "Tự thiết kế vũ trụ móc khóa của riêng bạn.",
    images: ["/images/home-banner.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const storedLanguage = cookieStore.get("youniverse_lang")?.value;
  const initialLanguage: "en" | "vi" = storedLanguage === "vi" ? "vi" : "en";
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
      className={`h-full antialiased ${nunito.variable} ${montserrat.variable} ${spaceGrotesk.variable} ${inter.variable} ${initialLanguage === "vi" ? "lang-vi" : ""}`}
    >
      <body className="min-h-full flex flex-col">
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

