import { useQuery } from "@tanstack/react-query";
import { Eye, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import Pagination from "../components/Pagination";
import { EmptyState, ErrorState, LoadingState } from "../components/PageState";
import { OrderStatusBadge, PaymentStatusBadge } from "../components/StatusBadge";
import { useAuth } from "../features/auth/AuthProvider";
import { apiRequest, buildQuery } from "../lib/api";
import { formatCurrency, formatDate } from "../lib/format";
import type { OrderStatus, Pagination as PaginationType, PaymentStatus, OrderSummary } from "../types/api";

type OrderListData = {
  items: OrderSummary[];
  pagination: PaginationType;
};

export default function OrdersPage() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const query = useQuery({
    queryKey: ["orders", page, search, status, paymentStatus, from, to],
    queryFn: () =>
      apiRequest<OrderListData>(
        `/admin/orders${buildQuery({ page, limit: 15, search, status, paymentStatus, from, to })}`,
        { token },
      ),
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Đơn hàng</h2>
          <p>Theo dõi đơn hàng, thanh toán, trạng thái vận hành và xác nhận chuyển khoản.</p>
        </div>
      </div>

      <div className="card toolbar">
        <div className="filters">
          <div className="field">
            <label>Tìm kiếm</label>
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: 10, top: 12, color: "#71717a" }} />
              <input className="input" style={{ paddingLeft: 34 }} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            </div>
          </div>
          <div className="field">
            <label>Trạng thái đơn hàng</label>
            <select className="select" value={status} onChange={(e) => { setStatus(e.target.value as OrderStatus | ""); setPage(1); }}>
              <option value="">Tất cả</option>
              {["PENDING_PAYMENT", "PAID", "CONFIRMED", "PROCESSING", "SHIPPING", "COMPLETED", "CANCELLED", "REFUNDED"].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Thanh toán</label>
            <select className="select" value={paymentStatus} onChange={(e) => { setPaymentStatus(e.target.value as PaymentStatus | ""); setPage(1); }}>
              <option value="">Tất cả</option>
              {["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="field"><label>Từ ngày</label><input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
          <div className="field"><label>Đến ngày</label><input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        </div>
      </div>

      {query.isLoading ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState message={query.error.message} onRetry={() => query.refetch()} />
      ) : query.data!.items.length === 0 ? (
        <EmptyState title="Chưa có đơn hàng phù hợp" />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Đơn hàng</th>
                  <th>Khách hàng</th>
                  <th>Trạng thái đơn hàng</th>
                  <th>Thanh toán</th>
                  <th>Tổng tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {query.data!.items.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.orderCode}</strong>
                      <div className="muted">{formatDate(order.createdAt)}</div>
                    </td>
                    <td>
                      {order.customerName}
                      <div className="muted">{order.customerEmail}</div>
                      <div className="muted">{order.customerPhone}</div>
                    </td>
                    <td><OrderStatusBadge status={order.status} /></td>
                    <td><PaymentStatusBadge status={order.paymentStatus} /></td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                    <td>
                      <div className="row-actions">
                        <Link className="button button--secondary" to={`/admin/orders/${order.id}`}>
                          <Eye size={15} /> Chi tiết
                        </Link>
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
    </div>
  );
}
