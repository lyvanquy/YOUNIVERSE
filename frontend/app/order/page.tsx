import type { Metadata } from "next";
import OrderView from "../components/OrderView";

export const metadata: Metadata = {
  title: "Đặt charm cá nhân hóa",
  description: "Tự do mix & match và chế tác bộ charm của bạn. Quy trình 4 bước tùy chỉnh: Chọn hệ Astra, Thêm sở thích Sirius, Khắc châm ngôn Polaris và Thanh toán.",
  alternates: {
    canonical: "/order",
  },
  openGraph: {
    title: "Cùng tạo nên vũ trụ của riêng bạn | Đặt hàng YOUniverse",
    description: "Tự do mix & match và chế tác bộ charm của bạn. Quy trình 4 bước tùy chỉnh: Chọn hệ Astra, Thêm sở thích Sirius, Khắc châm ngôn Polaris và Thanh toán.",
    url: "/order",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Cá nhân hóa YOUniverse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Đặt charm cá nhân hóa | YOUniverse",
    description: "Mix & match Astra, Sirius và Polaris để tạo bộ charm mang dấu ấn riêng.",
    images: ["/opengraph-image"],
  },
};

export default function OrderPage() {
  return <OrderView />;
}
