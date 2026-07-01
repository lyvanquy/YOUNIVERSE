import type { Metadata } from "next";
import AboutView from "../components/AboutView";

export const metadata: Metadata = {
  title: "Câu chuyện của chúng mình | YOUniverse",
  description: "Khởi nguồn từ UEH.ISB, YOUniverse ra đời để phá vỡ các giới hạn rập khuôn, giúp thế hệ trẻ bộc lộ bản sắc và tự tin khẳng định cá tính qua những dải charm tinh tế.",
  openGraph: {
    title: "Câu chuyện của chúng mình | YOUniverse",
    description: "Khởi nguồn từ UEH.ISB, YOUniverse ra đời để phá vỡ các giới hạn rập khuôn, giúp thế hệ trẻ bộc lộ bản sắc và tự tin khẳng định cá tính qua những dải charm tinh tế.",
    images: [
      {
        url: "/images/home-banner.png",
        width: 1200,
        height: 630,
        alt: "Về chúng tôi - YOUniverse",
      },
    ],
  },
};

export default function AboutPage() {
  return <AboutView />;
}
