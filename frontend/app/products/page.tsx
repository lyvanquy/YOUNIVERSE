import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import ProductsView from "../components/ProductsView";
import { apiRequest, type ProductListData } from "../lib/api";

export const metadata: Metadata = {
  title: "Charm cá nhân hóa Astra, Sirius & Polaris",
  description: "Trang danh sách các dòng charm cá nhân hóa độc bản: Astra (Unique), Sirius (Passion) và Polaris (Inspiring). Hãy tự thiết kế và kể câu chuyện của riêng bạn.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Khám phá các Hành tinh Charm | YOUniverse",
    description: "Trang danh sách các dòng charm cá nhân hóa độc bản: Astra (Unique), Sirius (Passion) và Polaris (Inspiring). Hãy tự thiết kế và kể câu chuyện của riêng bạn.",
    url: "/products",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Sản phẩm YOUniverse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Charm cá nhân hóa Astra, Sirius & Polaris | YOUniverse",
    description: "Khám phá các dòng charm thủ công kể câu chuyện và cá tính của riêng bạn.",
    images: ["/opengraph-image"],
  },
};

export const revalidate = 300;

export default async function ProductsPage() {
  let products: ProductListData["items"] = [];
  let initialError: string | null = null;

  try {
    const data = await apiRequest<ProductListData>(
      "/products?page=1&limit=50&sort=newest",
      { next: { revalidate: 300, tags: ["products"] } },
    );
    products = data.items;
  } catch {
    initialError = "Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.";
  }

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Sản phẩm charm cá nhân hóa YOUniverse",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://youniverse.io.vn/products/${encodeURIComponent(product.slug)}`,
      name: product.name,
    })),
  };

  return (
    <>
      {products.length > 0 && <JsonLd id="product-list-structured-data" data={itemList} />}
      <ProductsView initialProducts={products} initialError={initialError} />
    </>
  );
}
