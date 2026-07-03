import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle, Save } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ErrorState, LoadingState } from "../components/PageState";
import { OrderStatusBadge, PaymentStatusBadge } from "../components/StatusBadge";
import { useAuth } from "../features/auth/AuthProvider";
import { apiRequest } from "../lib/api";
import { formatCurrency, formatDate } from "../lib/format";
import type { OrderDetail, OrderStatus } from "../types/api";

export default function OrderDetailPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<OrderStatus>("PENDING_PAYMENT");
  const [note, setNote] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["order", id],
    queryFn: () => apiRequest<{ order: OrderDetail }>(`/admin/orders/${id}`, { token }),
    enabled: Boolean(id),
  });

  const order = query.data?.order;
  useEffect(() => {
    if (!order) return;
    setStatus(order.status);
    setNote(order.adminNote ?? "");
    setTrackingCode(order.trackingCode ?? "");
  }, [order]);

  const updateStatus = useMutation({
    mutationFn: () =>
      apiRequest<{ order: OrderDetail }>(`/admin/orders/${id}/status`, {
        method: "PATCH",
        token,
        body: { status, note: note || null, trackingCode: trackingCode || null },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Không cập nhật được đơn hàng."),
  });

  const confirmTransfer = useMutation({
    mutationFn: () => apiRequest(`/admin/orders/${id}/confirm-payment`, { method: "POST", token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Không xác nhận được chuyển khoản."),
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    updateStatus.mutate();
  };

  if (query.isLoading) return <LoadingState />;
  if (query.isError) return <ErrorState message={query.error.message} onRetry={() => query.refetch()} />;
  if (!order) return null;

  const bankTransfer = order.payments.find((payment) => payment.provider === "BANK_TRANSFER");

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>{order.orderCode}</h2>
          <p>{formatDate(order.createdAt)} · {order.customerName}</p>
        </div>
        <Link className="button button--secondary" to="/orders"><ArrowLeft size={16} />Quay lại</Link>
      </div>

      {error && <div className="page-state page-state--error" style={{ minHeight: 0 }}>{error}</div>}

      <div className="split">
        <div className="page">
          <section className="card tai-tho-card">
            <h3>Sản phẩm trong đơn</h3>
            <div className="table-wrap tai-tho-table">
              <table className="table" style={{ minWidth: 720 }}>
                <thead>
                  <tr><th>Sản phẩm</th><th>Mã SKU</th><th>Số lượng</th><th>Đơn giá</th><th>Tổng</th></tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.productName}</strong>
                        {item.variantName && <div className="muted">{item.variantName}</div>}
                        {item.customText && <div className="muted">Khắc tên: {item.customText}</div>}
                      </td>
                      <td className="mono">{item.sku ?? "-"}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.unitPrice)}</td>
                      <td>{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card tai-tho-card">
            <h3>Giao dịch thanh toán</h3>
            <div className="table-wrap tai-tho-table">
              <table className="table" style={{ minWidth: 760 }}>
                <thead><tr><th>Phương thức</th><th>Trạng thái</th><th>Số tiền</th><th>Mã giao dịch</th><th>Biên lai</th></tr></thead>
                <tbody>
                  {order.payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.provider}</td>
                      <td><PaymentStatusBadge status={payment.status} /></td>
                      <td>{formatCurrency(payment.amount)}</td>
                      <td className="mono">{payment.providerTxnId ?? "-"}</td>
                      <td>
                        {payment.receiptUrl ? <a className="button button--secondary" href={payment.receiptUrl} target="_blank">Xem biên lai</a> : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {bankTransfer?.status === "PENDING" && (
              <div style={{ marginTop: 14 }}>
                <button
                  className="button"
                  type="button"
                  onClick={() => confirmTransfer.mutate()}
                  disabled={confirmTransfer.isPending}
                  title="Hệ thống sẽ từ chối nếu khách chưa tải ảnh biên lai."
                >
                  <CheckCircle size={16} /> Xác nhận đã nhận chuyển khoản
                </button>
              </div>
            )}
          </section>
        </div>

        <aside className="page">
          <section className="card tai-tho-card">
            <h3>Tóm tắt đơn hàng</h3>
            <dl className="detail-list">
              <div><dt>Trạng thái đơn</dt><dd><OrderStatusBadge status={order.status} /></dd></div>
              <div><dt>Thanh toán</dt><dd><PaymentStatusBadge status={order.paymentStatus} /></dd></div>
              <div><dt>Tạm tính</dt><dd>{formatCurrency(order.subtotalAmount)}</dd></div>
              <div><dt>Giảm giá</dt><dd>{formatCurrency(order.discountAmount)}</dd></div>
              <div><dt>Phí vận chuyển</dt><dd>{formatCurrency(order.shippingFee)}</dd></div>
              <div><dt>Tổng cộng</dt><dd>{formatCurrency(order.totalAmount)}</dd></div>
            </dl>
          </section>

          <section className="card tai-tho-card">
            <h3>Khách hàng</h3>
            <p><strong>{order.customerName}</strong></p>
            <p className="muted">{order.customerEmail}</p>
            <p className="muted">{order.customerPhone}</p>
            <p>{order.shippingAddress}</p>
            {order.note && <p className="muted">Ghi chú khách hàng: {order.note}</p>}
          </section>

          <form className="card page tai-tho-card" onSubmit={onSubmit}>
            <h3>Cập nhật trạng thái</h3>
            <div className="field">
              <label>Trạng thái đơn hàng</label>
              <select className="select" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
                {["PENDING_PAYMENT", "PAID", "CONFIRMED", "PROCESSING", "SHIPPING", "COMPLETED", "CANCELLED", "REFUNDED"].map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="field"><label>Mã vận đơn</label><input className="input" value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)} /></div>
            <div className="field"><label>Ghi chú nội bộ</label><textarea className="textarea" value={note} onChange={(e) => setNote(e.target.value)} /></div>
            <button className="button" type="submit" disabled={updateStatus.isPending}><Save size={16} />Lưu trạng thái</button>
          </form>
        </aside>
      </div>
    </div>
  );
}
