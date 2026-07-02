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
        <Link className="button button--secondary" to="/admin/orders"><ArrowLeft size={16} />Back</Link>
      </div>

      {error && <div className="page-state page-state--error" style={{ minHeight: 0 }}>{error}</div>}

      <div className="split">
        <div className="page">
          <section className="card">
            <h3>Items</h3>
            <div className="table-wrap">
              <table className="table" style={{ minWidth: 720 }}>
                <thead>
                  <tr><th>Product</th><th>SKU</th><th>Qty</th><th>Unit</th><th>Total</th></tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.productName}</strong>
                        {item.variantName && <div className="muted">{item.variantName}</div>}
                        {item.customText && <div className="muted">Custom: {item.customText}</div>}
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

          <section className="card">
            <h3>Payments</h3>
            <div className="table-wrap">
              <table className="table" style={{ minWidth: 760 }}>
                <thead><tr><th>Provider</th><th>Status</th><th>Amount</th><th>Txn</th><th>Receipt</th></tr></thead>
                <tbody>
                  {order.payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.provider}</td>
                      <td><PaymentStatusBadge status={payment.status} /></td>
                      <td>{formatCurrency(payment.amount)}</td>
                      <td className="mono">{payment.providerTxnId ?? "-"}</td>
                      <td>
                        {payment.receiptUrl ? <a className="button button--secondary" href={payment.receiptUrl} target="_blank">View receipt</a> : "-"}
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
                  title="Backend sẽ từ chối nếu khách chưa upload bill chuyển khoản."
                >
                  <CheckCircle size={16} /> Confirm bank transfer
                </button>
              </div>
            )}
          </section>
        </div>

        <aside className="page">
          <section className="card">
            <h3>Summary</h3>
            <dl className="detail-list">
              <div><dt>Order status</dt><dd><OrderStatusBadge status={order.status} /></dd></div>
              <div><dt>Payment</dt><dd><PaymentStatusBadge status={order.paymentStatus} /></dd></div>
              <div><dt>Subtotal</dt><dd>{formatCurrency(order.subtotalAmount)}</dd></div>
              <div><dt>Discount</dt><dd>{formatCurrency(order.discountAmount)}</dd></div>
              <div><dt>Shipping</dt><dd>{formatCurrency(order.shippingFee)}</dd></div>
              <div><dt>Total</dt><dd>{formatCurrency(order.totalAmount)}</dd></div>
            </dl>
          </section>

          <section className="card">
            <h3>Customer</h3>
            <p><strong>{order.customerName}</strong></p>
            <p className="muted">{order.customerEmail}</p>
            <p className="muted">{order.customerPhone}</p>
            <p>{order.shippingAddress}</p>
            {order.note && <p className="muted">Note: {order.note}</p>}
          </section>

          <form className="card page" onSubmit={onSubmit}>
            <h3>Update Status</h3>
            <div className="field">
              <label>Status</label>
              <select className="select" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
                {["PENDING_PAYMENT", "PAID", "CONFIRMED", "PROCESSING", "SHIPPING", "COMPLETED", "CANCELLED", "REFUNDED"].map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="field"><label>Tracking Code</label><input className="input" value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)} /></div>
            <div className="field"><label>Admin Note</label><textarea className="textarea" value={note} onChange={(e) => setNote(e.target.value)} /></div>
            <button className="button" type="submit" disabled={updateStatus.isPending}><Save size={16} />Save status</button>
          </form>
        </aside>
      </div>
    </div>
  );
}
