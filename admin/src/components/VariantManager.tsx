import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Eye, EyeOff, Image, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../features/auth/AuthProvider";
import { apiRequest } from "../lib/api";
import type { ProductVariant } from "../types/api";

type VariantForm = {
  name: string;
  sku: string;
  imageUrl: string;
  imageAlt: string;
  description: string;
  group: string;
  groupEmoji: string;
  stock: string;
  sortOrder: string;
  isActive: boolean;
};

const emptyForm: VariantForm = {
  name: "",
  sku: "",
  imageUrl: "",
  imageAlt: "",
  description: "",
  group: "",
  groupEmoji: "",
  stock: "0",
  sortOrder: "0",
  isActive: true,
};

const formFromVariant = (v: ProductVariant): VariantForm => ({
  name: v.name,
  sku: v.sku ?? "",
  imageUrl: v.imageUrl ?? "",
  imageAlt: v.imageAlt ?? "",
  description: v.description ?? "",
  group: v.group ?? "",
  groupEmoji: v.groupEmoji ?? "",
  stock: String(v.stock),
  sortOrder: String(v.sortOrder),
  isActive: v.isActive,
});

const formToPayload = (form: VariantForm) => ({
  name: form.name,
  sku: form.sku || null,
  imageUrl: form.imageUrl || null,
  imageAlt: form.imageAlt || null,
  description: form.description || null,
  group: form.group || null,
  groupEmoji: form.groupEmoji || null,
  stock: Number(form.stock),
  sortOrder: Number(form.sortOrder),
  isActive: form.isActive,
});

export default function VariantManager({ productId }: { productId: string }) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<VariantForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const variantsQuery = useQuery({
    queryKey: ["variants", productId],
    queryFn: () =>
      apiRequest<{ variants: ProductVariant[] }>(`/admin/products/${productId}/variants`, { token }),
  });

  const variants = variantsQuery.data?.variants ?? [];

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["variants", productId] });
    queryClient.invalidateQueries({ queryKey: ["product", productId] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: unknown) =>
      apiRequest(`/admin/products/${productId}/variants`, { method: "POST", token, body: payload }),
    onSuccess: () => {
      invalidate();
      setShowForm(false);
      setForm(emptyForm);
      setError(null);
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Lỗi tạo biến thể"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ variantId, payload }: { variantId: string; payload: unknown }) =>
      apiRequest(`/admin/products/${productId}/variants/${variantId}`, { method: "PATCH", token, body: payload }),
    onSuccess: () => {
      invalidate();
      setEditingId(null);
      setForm(emptyForm);
      setError(null);
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Lỗi cập nhật biến thể"),
  });

  const deleteMutation = useMutation({
    mutationFn: (variantId: string) =>
      apiRequest(`/admin/products/${productId}/variants/${variantId}`, { method: "DELETE", token }),
    onSuccess: () => invalidate(),
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const body = new FormData();
      body.set("file", file);
      return apiRequest<{ url: string }>("/upload/image", { method: "POST", token, body });
    },
    onSuccess: (data) => setForm((f) => ({ ...f, imageUrl: data.url })),
    onError: (err) => setError(err instanceof Error ? err.message : "Upload ảnh thất bại"),
  });

  const update = <K extends keyof VariantForm>(key: K, value: VariantForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const startCreate = () => {
    const nextSort = variants.length > 0 ? Math.max(...variants.map((v) => v.sortOrder)) + 1 : 0;
    setForm({ ...emptyForm, sortOrder: String(nextSort) });
    setEditingId(null);
    setShowForm(true);
    setError(null);
  };

  const startEdit = (v: ProductVariant) => {
    setForm(formFromVariant(v));
    setEditingId(v.id);
    setShowForm(true);
    setError(null);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  const onSubmit = () => {
    if (!form.name.trim()) return;
    const payload = formToPayload(form);
    if (editingId) {
      updateMutation.mutate({ variantId: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleReorder = (variantId: string, direction: "up" | "down") => {
    const idx = variants.findIndex((v) => v.id === variantId);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= variants.length) return;

    const current = variants[idx];
    const swap = variants[swapIdx];

    updateMutation.mutate({ variantId: current.id, payload: { sortOrder: swap.sortOrder } });
    updateMutation.mutate({ variantId: swap.id, payload: { sortOrder: current.sortOrder } });
  };

  const toggleActive = (v: ProductVariant) => {
    updateMutation.mutate({ variantId: v.id, payload: { isActive: !v.isActive } });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <section className="card page variant-manager">
      <div className="variant-manager__header">
        <div>
          <h3>Biến thể hiển thị</h3>
          <p className="muted" style={{ fontSize: 12, marginTop: 2 }}>
            Quản lý các mẫu charm hiển thị trên trang khám phá ({variants.length} biến thể)
          </p>
        </div>
        {!showForm && (
          <button className="button button--sm" type="button" onClick={startCreate}>
            <Plus size={14} /> Thêm
          </button>
        )}
      </div>

      {error && (
        <div className="variant-error">{error}</div>
      )}

      {/* Variant list */}
      {variantsQuery.isLoading ? (
        <div className="variant-loading">Đang tải...</div>
      ) : variants.length === 0 && !showForm ? (
        <div className="variant-empty">
          <Image size={24} />
          <span>Chưa có biến thể nào</span>
          <button className="button button--secondary button--sm" type="button" onClick={startCreate}>
            <Plus size={14} /> Thêm biến thể đầu tiên
          </button>
        </div>
      ) : (
        <div className="variant-list">
          {variants.map((v, idx) => (
            <div
              key={v.id}
              className={`variant-card ${editingId === v.id ? "variant-card--editing" : ""} ${!v.isActive ? "variant-card--inactive" : ""}`}
              onClick={() => editingId !== v.id && startEdit(v)}
            >
              <div className="variant-card__thumb">
                {v.imageUrl ? (
                  <img src={v.imageUrl} alt={v.imageAlt ?? v.name} />
                ) : (
                  <div className="variant-card__no-img"><Image size={18} /></div>
                )}
              </div>
              <div className="variant-card__info">
                <div className="variant-card__name">{v.name}</div>
                <div className="variant-card__meta">
                  {v.sku && <span className="mono">{v.sku}</span>}
                  <span>Tồn: {v.stock}</span>
                  {v.group && <span>{v.groupEmoji} {v.group}</span>}
                </div>
              </div>
              <div className="variant-card__actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="button button--icon button--secondary"
                  type="button"
                  title="Lên"
                  disabled={idx === 0 || isSaving}
                  onClick={() => handleReorder(v.id, "up")}
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  className="button button--icon button--secondary"
                  type="button"
                  title="Xuống"
                  disabled={idx === variants.length - 1 || isSaving}
                  onClick={() => handleReorder(v.id, "down")}
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  className="button button--icon button--secondary"
                  type="button"
                  title={v.isActive ? "Ẩn" : "Hiện"}
                  onClick={() => toggleActive(v)}
                  disabled={isSaving}
                >
                  {v.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  className="button button--icon button--secondary"
                  type="button"
                  title="Xóa"
                  style={{ color: "var(--color-red)", borderColor: "rgba(239,68,68,0.20)" }}
                  onClick={() => {
                    if (confirm(`Xóa biến thể "${v.name}"?`)) deleteMutation.mutate(v.id);
                  }}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inline form */}
      {showForm && (
        <div className="variant-form">
          <div className="variant-form__title">
            {editingId ? "Chỉnh sửa biến thể" : "Thêm biến thể mới"}
            <button className="button button--icon button--secondary" type="button" onClick={cancelForm}>
              <X size={14} />
            </button>
          </div>

          <div className="grid-2">
            <div className="field">
              <label>Tên biến thể *</label>
              <input className="input" value={form.name} onChange={(e) => update("name", e.target.value)} required placeholder="VD: Hệ Mặt Trời" />
            </div>
            <div className="field">
              <label>Mã SKU</label>
              <input className="input" value={form.sku} onChange={(e) => update("sku", e.target.value)} placeholder="VD: ASTRA-SUN" />
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label>Nhóm (Group)</label>
              <input className="input" value={form.group} onChange={(e) => update("group", e.target.value)} placeholder="VD: Những người bạn 4 chân" />
            </div>
            <div className="field">
              <label>Emoji nhóm</label>
              <input className="input" value={form.groupEmoji} onChange={(e) => update("groupEmoji", e.target.value)} placeholder="VD: 🐾" />
            </div>
          </div>

          <div className="field">
            <label>Mô tả</label>
            <textarea className="textarea" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Mô tả ngắn cho biến thể..." rows={2} />
          </div>

          <div className="variant-form__image-section">
            <div className="field" style={{ flex: 1 }}>
              <label>Đường dẫn ảnh</label>
              <input className="input" value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} placeholder="URL ảnh hoặc tải lên..." />
            </div>
            <label className="button button--secondary button--sm" style={{ alignSelf: "flex-end" }}>
              <Upload size={14} /> Tải ảnh
              <input hidden type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadMutation.mutate(e.target.files[0])} />
            </label>
          </div>
          {form.imageUrl && (
            <img src={form.imageUrl} alt="" className="variant-form__preview" />
          )}

          <div className="field">
            <label>Chú thích ảnh (Alt)</label>
            <input className="input" value={form.imageAlt} onChange={(e) => update("imageAlt", e.target.value)} placeholder="Mô tả ảnh cho SEO..." />
          </div>

          <div className="grid-3">
            <div className="field">
              <label>Tồn kho</label>
              <input className="input" type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} min={0} />
            </div>
            <div className="field">
              <label>Thứ tự hiển thị</label>
              <input className="input" type="number" value={form.sortOrder} onChange={(e) => update("sortOrder", e.target.value)} min={0} />
            </div>
            <div className="field" style={{ display: "flex", alignItems: "flex-end", paddingBottom: 2 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <input type="checkbox" checked={form.isActive} onChange={(e) => update("isActive", e.target.checked)} />
                Hiển thị
              </label>
            </div>
          </div>

          <div className="variant-form__footer">
            <button className="button button--secondary" type="button" onClick={cancelForm}>Hủy</button>
            <button className="button" type="button" onClick={onSubmit} disabled={isSaving || !form.name.trim()}>
              <Save size={14} /> {editingId ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
