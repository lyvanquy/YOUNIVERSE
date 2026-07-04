import type { Metadata } from "next";
import AboutView from "../components/AboutView";

export const metadata: Metadata = {
  title: "Câu chuyện của chúng mình",
  description: "Khởi nguồn từ UEH.ISB, YOUniverse ra đời để phá vỡ các giới hạn rập khuôn, giúp thế hệ trẻ bộc lộ bản sắc và tự tin khẳng định cá tính qua những dải charm tinh tế.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Câu chuyện của chúng mình | YOUniverse",
    description: "Khởi nguồn từ UEH.ISB, YOUniverse ra đời để phá vỡ các giới hạn rập khuôn, giúp thế hệ trẻ bộc lộ bản sắc và tự tin khẳng định cá tính qua những dải charm tinh tế.",
    url: "/about",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Về chúng tôi - YOUniverse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Câu chuyện của chúng mình | YOUniverse",
    description: "Khám phá câu chuyện, sứ mệnh và tầm nhìn của YOUniverse.",
    images: ["/opengraph-image"],
  },
};

export default function AboutPage() {
  return <AboutView />;
}
