import type { Metadata } from "next";
import ProductsViewWrapper from "./ProductsViewWrapper";

export const metadata: Metadata = {
  title: "Khám phá các Hành tinh Charm | YOUniverse",
  description: "Trang danh sách các dòng charm cá nhân hóa độc bản: Astra (Unique), Sirius (Passion) và Polaris (Inspiring). Hãy tự thiết kế và kể câu chuyện của riêng bạn.",
  openGraph: {
    title: "Khám phá các Hành tinh Charm | YOUniverse",
    description: "Trang danh sách các dòng charm cá nhân hóa độc bản: Astra (Unique), Sirius (Passion) và Polaris (Inspiring). Hãy tự thiết kế và kể câu chuyện của riêng bạn.",
    images: [
      {
        url: "/images/home-banner.png",
        width: 1200,
        height: 630,
        alt: "Sản phẩm YOUniverse",
      },
    ],
  },
};

export default function ProductsPage() {
  return <ProductsViewWrapper />;
}
