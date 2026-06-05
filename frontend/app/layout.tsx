import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YOUniverse",
  description: "A galaxy to hold, a story to be told.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
