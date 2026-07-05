import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { translations } from "../../locales";
import {
  apiRequest,
  ApiError,
  type ApiProduct,
  type ProductDetailData,
} from "../../lib/api";

const SITE_URL = "https://youniverse.io.vn";

const getVietnameseDescription = (product: ApiProduct) => {
  if (product.productLine === "ASTRA") return translations.vi.charmAstraDesc;
  if (product.productLine === "SIRIUS") return translations.vi.charmSiriusDesc;
  return translations.vi.charmPolarisDesc;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const absoluteUrl = (value: string) => {
  try {
    return new URL(value, SITE_URL).toString();
  } catch {
    return `${SITE_URL}/opengraph-image`;
  }
};

async function getProduct(slug: string): Promise<ApiProduct | null> {
  try {
    const data = await apiRequest<ProductDetailData>(
      `/products/${encodeURIComponent(slug)}`,
      { next: { revalidate: 300, tags: [`product-${slug}`] } },
    );
    return data.product;
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) return null;
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Không tìm thấy sản phẩm",
      robots: { index: false, follow: false },
    };
  }

  const description = product.metaDescription ?? getVietnameseDescription(product);
  const image = product.images.find((item) => item.isPrimary) ?? product.images[0];
  const canonicalPath = `/products/${encodeURIComponent(product.slug)}`;
  const socialImage = image ? absoluteUrl(image.url) : `${SITE_URL}/opengraph-image`;

  return {
    title: product.metaTitle ? { absolute: product.metaTitle } : product.name,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: `${product.name} | YOUniverse`,
      description,
      url: canonicalPath,
      type: "website",
      images: [{ url: socialImage, alt: image?.alt ?? product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | YOUniverse`,
      description,
      images: [socialImage],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const primaryImage = product.images.find((item) => item.isPrimary) ?? product.images[0];
  const imageUrl = primaryImage?.url ?? `/images/${product.productLine.toLowerCase()}-core.png`;
  const currentPrice = product.salePrice ?? product.price;
  const description = getVietnameseDescription(product);
  const canonicalUrl = `${SITE_URL}/products/${encodeURIComponent(product.slug)}`;
  const inStock = (product.inventory?.quantity ?? 0) > 0;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${canonicalUrl}#product`,
      name: product.name,
      description,
      image: product.images.length > 0
        ? product.images.map((image) => absoluteUrl(image.url))
        : [absoluteUrl(imageUrl)],
      ...(product.sku ? { sku: product.sku } : {}),
      category: product.category?.name ?? `Charm ${product.productLine}`,
      brand: {
        "@type": "Brand",
        name: "YOUniverse",
      },
      offers: {
        "@type": "Offer",
        url: canonicalUrl,
        priceCurrency: "VND",
        price: currentPrice,
        availability: inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@id": `${SITE_URL}/#organization` },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Trang chủ",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Sản phẩm",
          item: `${SITE_URL}/products`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: product.name,
          item: canonicalUrl,
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
      <JsonLd id="product-structured-data" data={structuredData} />

      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-stone-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-stone-900">Trang chủ</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/products" className="hover:text-stone-900">Sản phẩm</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-stone-900" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <article className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="overflow-hidden rounded-3xl bg-stone-100 aspect-[4/3]">
          <img
            src={imageUrl}
            alt={primaryImage?.alt ?? product.name}
            width={1200}
            height={900}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
            Charm {product.productLine}
          </p>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-stone-950 sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-5 text-base leading-7 text-stone-600">
            {description}
          </p>



          <p className={`mt-3 text-sm font-semibold ${inStock ? "text-emerald-700" : "text-rose-600"}`}>
            {inStock ? "Còn hàng" : "Tạm hết hàng"}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/order?product=${encodeURIComponent(product.slug)}`}
              className="rounded-full bg-stone-950 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-stone-800"
            >
              Cá nhân hóa và đặt hàng
            </Link>
            <Link
              href="/products"
              className="rounded-full border border-stone-300 px-7 py-3.5 text-sm font-bold text-stone-800 transition hover:border-stone-500"
            >
              Xem sản phẩm khác
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
