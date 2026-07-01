import type { Metadata } from "next";
import PolicyView from "../components/PolicyView";

export const metadata: Metadata = {
  title: "Chính sách mua hàng & Bảo hành | YOUniverse",
  description: "Chi tiết chính sách đổi trả sản phẩm trong vòng 2 ngày, điều kiện bảo hành sản phẩm thủ công và các quy định giao nhận vận chuyển toàn quốc qua Viettel Post.",
  openGraph: {
    title: "Chính sách mua hàng & Bảo hành | YOUniverse",
    description: "Chi tiết chính sách đổi trả sản phẩm trong vòng 2 ngày, điều kiện bảo hành sản phẩm thủ công và các quy định giao nhận vận chuyển toàn quốc qua Viettel Post.",
    images: [
      {
        url: "/images/home-banner.png",
        width: 1200,
        height: 630,
        alt: "Chính sách YOUniverse",
      },
    ],
  },
};

export default function PolicyPage() {
  return <PolicyView />;
}
