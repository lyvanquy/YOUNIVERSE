import type { Metadata } from "next";
import { Nunito, Montserrat, Space_Grotesk, Inter } from "next/font/google";
import YouniverseApp from "./YouniverseApp";
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
  title: "YOUniverse",
  description: "A galaxy to hold, a story to be told.",
  icons: {
    icon: "/favicon.ico?v=1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="vi" 
      className={`h-full antialiased ${nunito.variable} ${montserrat.variable} ${spaceGrotesk.variable} ${inter.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <YouniverseApp>{children}</YouniverseApp>
      </body>
    </html>
  );
}

