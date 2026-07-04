import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YOUniverse - Phụ kiện & Charm cá nhân hóa",
    short_name: "YOUniverse",
    description: "Tự thiết kế charm và phụ kiện thủ công mang dấu ấn riêng của bạn.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#0c0a09",
    lang: "vi",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
