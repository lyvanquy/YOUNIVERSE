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

const STATUS_TABS: { label: string; value: OrderStatus | "" }[] = [
  { label: "Tất cả",         value: "" },
  { label: "Chờ thanh toán", value: "PENDING_PAYMENT" },
  { label: "Đã thanh toán",  value: "PAID" },
  { label: "Đang xử lý",    value: "PROCESSING" },
  { label: "Đang giao",     value: "SHIPPING" },
  { label: "Hoàn thành",    value: "COMPLETED" },
  { label: "Đã huỷ",        value: "CANCELLED" },
];

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
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Đơn hàng</h2>
          <p>Theo dõi đơn hàng, thanh toán, trạng thái vận hành và xác nhận chuyển khoản.</p>
        </div>
        {query.data && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--card-background)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-full)",
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--muted)",
            }}
          >
            Tổng: <span style={{ color: "var(--foreground)" }}>{query.data.pagination.total} đơn</span>
          </div>
        )}
      </div>

      {/* Status Tab Filter */}
      <div className="filter-tabs" style={{ overflowX: "auto", borderRadius: "var(--radius-xl)", padding: 4 }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`filter-tab${status === tab.value ? " filter-tab--active" : ""}`}
            type="button"
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="card toolbar">
        <div className="filters">
          {/* Search */}
          <div className="field">
            <label>Tìm kiếm</label>
            <div className="input-wrap">
              <span className="input-wrap__icon">
                <Search size={14} />
              </span>
              <input
                className="input"
                style={{ width: 220 }}
                placeholder="Mã đơn, tên, email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          {/* Payment status */}
          <div className="field">
            <label>Thanh toán</label>
            <select
              className="select"
              style={{ width: 160 }}
              value={paymentStatus}
              onChange={(e) => { setPaymentStatus(e.target.value as PaymentStatus | ""); setPage(1); }}
            >
              <option value="">Tất cả</option>
              {["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          {/* Date range */}
          <div className="field">
            <label>Từ ngày</label>
            <input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="field">
            <label>Đến ngày</label>
            <input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Content */}
      {query.isLoading ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState message={query.error.message} onRetry={() => query.refetch()} />
      ) : query.data!.items.length === 0 ? (
        <EmptyState
          title="Chưa có đơn hàng phù hợp"
          description={search ? `Không tìm thấy kết quả cho "${search}"` : "Đơn hàng sẽ hiển thị ở đây khi khách đặt."}
        />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Đơn hàng</th>
                  <th>Khách hàng</th>
                  <th>Trạng thái</th>
                  <th>Thanh toán</th>
                  <th style={{ textAlign: "right" }}>Tổng tiền</th>
                  <th style={{ textAlign: "right" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {query.data!.items.map((order) => (
                  <tr key={order.id} className="row--clickable">
                    <td>
                      <strong style={{ fontSize: 13 }}>{order.orderCode}</strong>
                      <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{formatDate(order.createdAt)}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                      <div className="muted" style={{ fontSize: 11 }}>{order.customerEmail}</div>
                      <div className="muted" style={{ fontSize: 11 }}>{order.customerPhone}</div>
                    </td>
                    <td><OrderStatusBadge status={order.status} /></td>
                    <td><PaymentStatusBadge status={order.paymentStatus} /></td>
                    <td style={{ textAlign: "right", fontWeight: 700, fontSize: 13 }}>
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link
                          className="button button--secondary button--sm"
                          to={`/orders/${order.id}`}
                        >
                          <Eye size={14} />
                          Chi tiết
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
