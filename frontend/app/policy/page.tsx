import type { Metadata } from "next";
import PolicyView from "../components/PolicyView";

export const metadata: Metadata = {
  title: "Chính sách mua hàng & bảo hành",
  description: "Chi tiết chính sách đổi trả sản phẩm trong vòng 2 ngày, điều kiện bảo hành sản phẩm thủ công và các quy định giao nhận vận chuyển toàn quốc qua Viettel Post.",
  alternates: {
    canonical: "/policy",
  },
  openGraph: {
    title: "Chính sách mua hàng & Bảo hành | YOUniverse",
    description: "Chi tiết chính sách đổi trả sản phẩm trong vòng 2 ngày, điều kiện bảo hành sản phẩm thủ công và các quy định giao nhận vận chuyển toàn quốc qua Viettel Post.",
    url: "/policy",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Chính sách YOUniverse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chính sách mua hàng & bảo hành | YOUniverse",
    description: "Thông tin đổi trả, bảo hành và vận chuyển sản phẩm YOUniverse.",
    images: ["/opengraph-image"],
  },
};

export default function PolicyPage() {
  return <PolicyView />;
}
