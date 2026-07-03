import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ErrorState, LoadingState } from "../components/PageState";
import { useAuth } from "../features/auth/AuthProvider";
import { apiRequest } from "../lib/api";
import type { Product, ProductLine, ProductStatus } from "../types/api";

type ProductForm = {
  name: string;
  slug: string;
  productLine: ProductLine;
  badge: string;
  shortDescription: string;
  description: string;
  price: string;
  salePrice: string;
  sku: string;
  stockQuantity: string;
  lowStockThreshold: string;
  status: ProductStatus;
  isFeatured: boolean;
  allowCustomize: boolean;
  metaTitle: string;
  metaDescription: string;
  imageUrl: string;
  imageAlt: string;
};

const initialForm: ProductForm = {
  name: "",
  slug: "",
  productLine: "ASTRA",
  badge: "",
  shortDescription: "",
  description: "",
  price: "129000",
  salePrice: "",
  sku: "",
  stockQuantity: "0",
  lowStockThreshold: "5",
  status: "DRAFT",
  isFeatured: false,
  allowCustomize: true,
  metaTitle: "",
  metaDescription: "",
  imageUrl: "",
  imageAlt: "",
};

export default function ProductFormPage({ mode }: { mode: "create" | "edit" }) {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [error, setError] = useState<string | null>(null);

  const productQuery = useQuery({
    queryKey: ["product", id],
    queryFn: () => apiRequest<{ product: Product }>(`/admin/products/${id}`, { token }),
    enabled: mode === "edit" && Boolean(id),
  });

  useEffect(() => {
    const product = productQuery.data?.product;
    if (!product) return;
    setForm({
      name: product.name,
      slug: product.slug,
      productLine: product.productLine,
      badge: product.badge ?? "",
      shortDescription: product.shortDescription,
      description: product.description ?? "",
      price: String(product.price),
      salePrice: product.salePrice === null ? "" : String(product.salePrice),
      sku: product.sku ?? "",
      stockQuantity: String(product.inventory?.quantity ?? 0),
      lowStockThreshold: String(product.inventory?.lowStockThreshold ?? 5),
      status: product.status,
      isFeatured: product.isFeatured,
      allowCustomize: product.allowCustomize,
      metaTitle: product.metaTitle ?? "",
      metaDescription: product.metaDescription ?? "",
      imageUrl: product.images[0]?.url ?? "",
      imageAlt: product.images[0]?.alt ?? product.name,
    });
  }, [productQuery.data]);

  const saveMutation = useMutation({
    mutationFn: (payload: unknown) =>
      mode === "create"
        ? apiRequest<{ product: Product }>("/admin/products", { method: "POST", token, body: payload })
        : apiRequest<{ product: Product }>(`/admin/products/${id}`, { method: "PATCH", token, body: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Không lưu được sản phẩm."),
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const body = new FormData();
      body.set("file", file);
      return apiRequest<{ url: string }>("/upload/image", { method: "POST", token, body });
    },
    onSuccess: (data) => setForm((current) => ({ ...current, imageUrl: data.url })),
    onError: (err) => setError(err instanceof Error ? err.message : "Upload ảnh thất bại."),
  });

  const update = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => setForm((current) => ({ ...current, [key]: value }));

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const images = form.imageUrl.trim()
      ? [{ url: form.imageUrl.trim(), alt: form.imageAlt.trim() || form.name, sortOrder: 0, isPrimary: true }]
      : [];

    saveMutation.mutate({
      name: form.name,
      slug: form.slug || undefined,
      productLine: form.productLine,
      badge: form.badge || null,
      shortDescription: form.shortDescription,
      description: form.description || null,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      sku: form.sku || null,
      stockQuantity: Number(form.stockQuantity),
      lowStockThreshold: Number(form.lowStockThreshold),
      images,
      status: form.status,
      isFeatured: form.isFeatured,
      allowCustomize: form.allowCustomize,
      metaTitle: form.metaTitle || null,
      metaDescription: form.metaDescription || null,
    });
  };

  if (productQuery.isLoading) return <LoadingState />;
  if (productQuery.isError) return <ErrorState message={productQuery.error.message} onRetry={() => productQuery.refetch()} />;

  return (
    <form className="page" onSubmit={onSubmit}>
      <div className="page-header">
        <div>
          <h2>{mode === "create" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}</h2>
          <p>Thông tin sản phẩm, SEO, ảnh chính và tồn kho.</p>
        </div>
        <div className="row-actions">
          <Link className="button button--secondary" to="/products"><ArrowLeft size={16} />Quay lại</Link>
          <button className="button" type="submit" disabled={saveMutation.isPending}><Save size={16} />Lưu lại</button>
        </div>
      </div>

      {error && <div className="page-state page-state--error" style={{ minHeight: 0 }}>{error}</div>}

      <div className="split">
        <section className="card page tai-tho-card">
          <h3>Thông tin sản phẩm</h3>
          <div className="grid-2">
            <div className="field"><label>Tên sản phẩm</label><input className="input" value={form.name} onChange={(e) => update("name", e.target.value)} required /></div>
            <div className="field"><label>Đường dẫn (Slug)</label><input className="input" value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="tự động tạo nếu bỏ trống" /></div>
          </div>
          <div className="grid-3">
            <div className="field">
              <label>Dòng sản phẩm</label>
              <select className="select" value={form.productLine} onChange={(e) => update("productLine", e.target.value as ProductLine)}>
                <option value="ASTRA">ASTRA</option><option value="SIRIUS">SIRIUS</option><option value="POLARIS">POLARIS</option>
              </select>
            </div>
            <div className="field"><label>Nhãn đính kèm (Badge)</label><input className="input" value={form.badge} onChange={(e) => update("badge", e.target.value)} /></div>
            <div className="field">
              <label>Trạng thái</label>
              <select className="select" value={form.status} onChange={(e) => update("status", e.target.value as ProductStatus)}>
                <option value="DRAFT">Nháp (DRAFT)</option><option value="ACTIVE">Đang hoạt động (ACTIVE)</option><option value="INACTIVE">Ngừng hoạt động (INACTIVE)</option><option value="ARCHIVED">Đã lưu trữ (ARCHIVED)</option>
              </select>
            </div>
          </div>
          <div className="field"><label>Mô tả ngắn</label><textarea className="textarea" value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} required /></div>
          <div className="field"><label>Mô tả chi tiết</label><textarea className="textarea" value={form.description} onChange={(e) => update("description", e.target.value)} /></div>
          <div className="grid-2">
            <div className="field"><label>Giá bán</label><input className="input" type="number" value={form.price} onChange={(e) => update("price", e.target.value)} required /></div>
            <div className="field"><label>Giá khuyến mãi</label><input className="input" type="number" value={form.salePrice} onChange={(e) => update("salePrice", e.target.value)} /></div>
          </div>
          <div className="grid-3">
            <div className="field"><label>Mã sản phẩm (SKU)</label><input className="input" value={form.sku} onChange={(e) => update("sku", e.target.value)} /></div>
            <div className="field"><label>Số lượng tồn kho</label><input className="input" type="number" value={form.stockQuantity} onChange={(e) => update("stockQuantity", e.target.value)} /></div>
            <div className="field"><label>Mức báo động sắp hết</label><input className="input" type="number" value={form.lowStockThreshold} onChange={(e) => update("lowStockThreshold", e.target.value)} /></div>
          </div>
          <div className="grid-2">
            <label><input type="checkbox" checked={form.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} /> Sản phẩm nổi bật</label>
            <label><input type="checkbox" checked={form.allowCustomize} onChange={(e) => update("allowCustomize", e.target.checked)} /> Cho phép tùy biến (Custom)</label>
          </div>
        </section>

        <aside className="card page tai-tho-card">
          <h3>Hình ảnh chính</h3>
          {form.imageUrl && <img src={form.imageUrl} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 12, border: "1px solid var(--border-color)" }} />}
          <div className="field"><label>Đường dẫn ảnh (URL)</label><input className="input" value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} /></div>
          <div className="field"><label>Chú thích ảnh (Alt)</label><input className="input" value={form.imageAlt} onChange={(e) => update("imageAlt", e.target.value)} /></div>
          <label className="button button--secondary">
            <Upload size={16} /> Tải ảnh lên
            <input hidden type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadMutation.mutate(e.target.files[0])} />
          </label>
          <h3>Cấu hình SEO</h3>
          <div className="field"><label>Tiêu đề SEO (Meta Title)</label><input className="input" value={form.metaTitle} onChange={(e) => update("metaTitle", e.target.value)} /></div>
          <div className="field"><label>Mô tả SEO (Meta Description)</label><textarea className="textarea" value={form.metaDescription} onChange={(e) => update("metaDescription", e.target.value)} /></div>
        </aside>
      </div>
    </form>
  );
}
