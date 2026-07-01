import type { Metadata } from "next";
import OrderView from "../components/OrderView";

export const metadata: Metadata = {
  title: "Cùng tạo nên vũ trụ của riêng bạn | Đặt hàng YOUniverse",
  description: "Tự do mix & match và chế tác bộ charm của bạn. Quy trình 4 bước tùy chỉnh: Chọn hệ Astra, Thêm sở thích Sirius, Khắc châm ngôn Polaris và Thanh toán.",
  openGraph: {
    title: "Cùng tạo nên vũ trụ của riêng bạn | Đặt hàng YOUniverse",
    description: "Tự do mix & match và chế tác bộ charm của bạn. Quy trình 4 bước tùy chỉnh: Chọn hệ Astra, Thêm sở thích Sirius, Khắc châm ngôn Polaris và Thanh toán.",
    images: [
      {
        url: "/images/home-banner.png",
        width: 1200,
        height: 630,
        alt: "Cá nhân hóa YOUniverse",
      },
    ],
  },
};

export default function OrderPage() {
  return <OrderView />;
}
