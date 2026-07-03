import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import Badge from "../components/Badge";
import Pagination from "../components/Pagination";
import { EmptyState, ErrorState, LoadingState } from "../components/PageState";
import { useAuth } from "../features/auth/AuthProvider";
import { apiRequest, buildQuery } from "../lib/api";
import { compactDate, formatCurrency } from "../lib/format";
import type { Coupon, CouponType, Pagination as PaginationType } from "../types/api";

type CouponData = {
  items: Coupon[];
  pagination: PaginationType;
};

type CouponForm = {
  code: string;
  name: string;
  description: string;
  type: CouponType;
  value: string;
  minOrderAmount: string;
  maxDiscountAmount: string;
  usageLimit: string;
  usagePerUser: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
};

const emptyForm: CouponForm = {
  code: "",
  name: "",
  description: "",
  type: "PERCENTAGE",
  value: "10",
  minOrderAmount: "",
  maxDiscountAmount: "",
  usageLimit: "",
  usagePerUser: "",
  startsAt: "",
  endsAt: "",
  isActive: true,
};

function toDateInput(value: string | null) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

export default function CouponsPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<CouponForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["coupons", page, search, isActive],
    queryFn: () => apiRequest<CouponData>(`/admin/coupons${buildQuery({ page, limit: 15, search, isActive })}`, { token }),
  });

  useEffect(() => {
    if (!editing) {
      setForm(emptyForm);
      return;
    }

    setForm({
      code: editing.code,
      name: editing.name,
      description: editing.description ?? "",
      type: editing.type,
      value: String(editing.value),
      minOrderAmount: editing.minOrderAmount === null ? "" : String(editing.minOrderAmount),
      maxDiscountAmount: editing.maxDiscountAmount === null ? "" : String(editing.maxDiscountAmount),
      usageLimit: editing.usageLimit === null ? "" : String(editing.usageLimit),
      usagePerUser: editing.usagePerUser === null ? "" : String(editing.usagePerUser),
      startsAt: toDateInput(editing.startsAt),
      endsAt: toDateInput(editing.endsAt),
      isActive: editing.isActive,
    });
  }, [editing]);

  const payload = () => ({
    code: form.code,
    name: form.name,
    description: form.description || null,
    type: form.type,
    value: Number(form.value),
    minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
    maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
    usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
    usagePerUser: form.usagePerUser ? Number(form.usagePerUser) : null,
    startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
    endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
    isActive: form.isActive,
  });

  const save = useMutation({
    mutationFn: () =>
      editing
        ? apiRequest(`/admin/coupons/${editing.id}`, { method: "PATCH", token, body: payload() })
        : apiRequest("/admin/coupons", { method: "POST", token, body: payload() }),
    onSuccess: () => {
      setModalOpen(false);
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Không lưu được coupon."),
  });

  const disable = useMutation({
    mutationFn: (id: string) => apiRequest(`/admin/coupons/${id}`, { method: "DELETE", token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });

  const update = <K extends keyof CouponForm>(key: K, value: CouponForm[K]) => setForm((current) => ({ ...current, [key]: value }));

  const openCreate = () => {
    setError(null);
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setError(null);
    setEditing(coupon);
    setModalOpen(true);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    save.mutate();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Mã giảm giá</h2>
          <p>Tạo và quản lý mã giảm giá, giới hạn sử dụng và thời gian hiệu lực.</p>
        </div>
        <button className="button" type="button" onClick={openCreate}><Plus size={16} />Thêm mã giảm giá</button>
      </div>

      <div className="card toolbar tai-tho-card">
        <div className="filters">
          <div className="field"><label>Tìm kiếm</label><input className="input" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></div>
          <div className="field">
            <label>Trạng thái</label>
            <select className="select" value={isActive} onChange={(e) => { setIsActive(e.target.value); setPage(1); }}>
              <option value="">Tất cả</option><option value="true">Đang kích hoạt</option><option value="false">Ngừng kích hoạt</option>
            </select>
          </div>
        </div>
      </div>

      {query.isLoading ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState message={query.error.message} onRetry={() => query.refetch()} />
      ) : query.data!.items.length === 0 ? (
        <EmptyState title="Chưa có coupon phù hợp" />
      ) : (
        <>
          <div className="table-wrap tai-tho-table">
            <table className="table">
              <thead><tr><th>Mã</th><th>Loại giảm giá</th><th>Giá trị</th><th>Đã dùng</th><th>Kích hoạt</th><th>Hạn sử dụng</th><th></th></tr></thead>
              <tbody>
                {query.data!.items.map((coupon) => (
                  <tr key={coupon.id}>
                    <td><strong>{coupon.code}</strong><div className="muted">{coupon.name}</div></td>
                    <td>{coupon.type}</td>
                    <td>{coupon.type === "PERCENTAGE" ? `${coupon.value}%` : formatCurrency(coupon.value)}</td>
                    <td>{coupon.usedCount}/{coupon.usageLimit ?? "∞"}</td>
                    <td>{coupon.isActive ? <Badge tone="green">Đang chạy</Badge> : <Badge tone="red">Dừng</Badge>}</td>
                    <td>{compactDate(coupon.startsAt)} → {compactDate(coupon.endsAt)}</td>
                    <td>
                      <div className="row-actions">
                        <button className="button button--secondary" type="button" onClick={() => openEdit(coupon)}><Edit size={15} />Sửa</button>
                        <button className="button button--danger" type="button" onClick={() => disable.mutate(coupon.id)} disabled={disable.isPending}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={query.data!.pagination} onPageChange={setPage} />
        </>
      )}

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <form className="modal page" onSubmit={onSubmit} onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>{editing ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá"}</h3>
              <button className="button button--secondary" type="button" onClick={() => setModalOpen(false)}>Đóng</button>
            </div>
            {error && <div className="page-state page-state--error" style={{ minHeight: 0 }}>{error}</div>}
            <div className="grid-2">
              <div className="field"><label>Mã giảm giá</label><input className="input" value={form.code} onChange={(e) => update("code", e.target.value.toUpperCase())} required /></div>
              <div className="field"><label>Tên chương trình</label><input className="input" value={form.name} onChange={(e) => update("name", e.target.value)} required /></div>
            </div>
            <div className="grid-2">
              <div className="field">
                <label>Loại giảm giá</label>
                <select className="select" value={form.type} onChange={(e) => update("type", e.target.value as CouponType)}>
                  <option value="PERCENTAGE">Phần trăm (PERCENTAGE)</option><option value="FIXED_AMOUNT">Số tiền cố định (FIXED_AMOUNT)</option><option value="FREE_SHIPPING">Miễn phí giao hàng (FREE_SHIPPING)</option>
                </select>
              </div>
              <div className="field"><label>Giá trị giảm</label><input className="input" type="number" value={form.value} onChange={(e) => update("value", e.target.value)} required /></div>
            </div>
            <div className="field"><label>Mô tả</label><textarea className="textarea" value={form.description} onChange={(e) => update("description", e.target.value)} /></div>
            <div className="grid-2">
              <div className="field"><label>Đơn hàng tối thiểu</label><input className="input" type="number" value={form.minOrderAmount} onChange={(e) => update("minOrderAmount", e.target.value)} /></div>
              <div className="field"><label>Số tiền giảm tối đa</label><input className="input" type="number" value={form.maxDiscountAmount} onChange={(e) => update("maxDiscountAmount", e.target.value)} /></div>
            </div>
            <div className="grid-2">
              <div className="field"><label>Giới hạn số lần dùng</label><input className="input" type="number" value={form.usageLimit} onChange={(e) => update("usageLimit", e.target.value)} /></div>
              <div className="field"><label>Giới hạn mỗi khách hàng</label><input className="input" type="number" value={form.usagePerUser} onChange={(e) => update("usagePerUser", e.target.value)} /></div>
            </div>
            <div className="grid-2">
              <div className="field"><label>Bắt đầu từ ngày</label><input className="input" type="date" value={form.startsAt} onChange={(e) => update("startsAt", e.target.value)} /></div>
              <div className="field"><label>Kết thúc vào ngày</label><input className="input" type="date" value={form.endsAt} onChange={(e) => update("endsAt", e.target.value)} /></div>
            </div>
            <label><input type="checkbox" checked={form.isActive} onChange={(e) => update("isActive", e.target.checked)} /> Kích hoạt sử dụng</label>
            <button className="button" type="submit" disabled={save.isPending}>Lưu mã giảm giá</button>
          </form>
        </div>
      )}
    </div>
  );
}
