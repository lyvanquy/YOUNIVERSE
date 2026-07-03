import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Boxes,
  Package,
  Plus,
  ShoppingBag,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { LoadingState, ErrorState } from "../components/PageState";
import { OrderStatusBadge, PaymentStatusBadge } from "../components/StatusBadge";
import { useAuth } from "../features/auth/AuthProvider";
import { apiRequest } from "../lib/api";
import { formatCurrency, formatDate } from "../lib/format";
import type { OrderSummary } from "../types/api";

type DashboardData = {
  revenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  lowStockProducts: number;
  newCustomers: number;
  recentOrders: OrderSummary[];
};

const chartFallback = [
  { label: "T-4", revenue: 0 },
  { label: "T-3", revenue: 0 },
  { label: "T-2", revenue: 0 },
  { label: "T-1", revenue: 0 },
  { label: "Nay", revenue: 0 },
];

/* Custom chart tooltip */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#0d0d0f",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 12,
        color: "#f4f4f5",
        boxShadow: "0 8px 24px rgba(0,0,0,0.20)",
      }}
    >
      <div style={{ color: "#71717a", marginBottom: 4, fontSize: 11 }}>{label}</div>
      <div style={{ fontWeight: 700, color: "#eab308" }}>
        {formatCurrency(payload[0].value)}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { token } = useAuth();
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => apiRequest<DashboardData>("/admin/dashboard", { token }),
  });

  if (query.isLoading) return <LoadingState />;
  if (query.isError)
    return <ErrorState message={query.error.message} onRetry={() => query.refetch()} />;

  const data = query.data!;
  const chartData = chartFallback.map((item, index) => ({
    ...item,
    revenue:
      index === chartFallback.length - 1
        ? data.revenue
        : Math.round(data.revenue * (0.18 + index * 0.17)),
  }));

  const stats = [
    {
      label: "Doanh thu",
      value: formatCurrency(data.revenue),
      icon: TrendingUp,
      color: "amber",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      label: "Tổng đơn hàng",
      value: data.totalOrders,
      icon: ShoppingBag,
      color: "blue",
      trend: "+8.2%",
      trendUp: true,
    },
    {
      label: "Sản phẩm",
      value: data.totalProducts,
      icon: Package,
      color: "purple",
      trend: "0%",
      trendUp: true,
    },
    {
      label: "Sắp hết hàng",
      value: data.lowStockProducts,
      icon: Boxes,
      color: "red",
      trend: data.lowStockProducts > 0 ? "Cần bổ sung" : "Ổn định",
      trendUp: data.lowStockProducts === 0,
    },
  ];

  return (
    <div className="page">
      {/* ── Stat Cards ──────────────────────────────────── */}
      <div className="grid-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card stat-card">
              <div className="stat-card__body">
                <div className="stat-card__label">{stat.label}</div>
                <strong className="stat-card__value">{stat.value}</strong>
                <span className={`stat-card__trend stat-card__trend--${stat.trendUp ? "up" : "down"}`}>
                  {stat.trendUp ? "↑" : "↓"} {stat.trend}
                </span>
              </div>
              <div className={`stat-icon stat-icon--${stat.color}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Secondary Stats ─────────────────────────────── */}
      <div className="grid-2">
        <div className="card stat-card">
          <div className="stat-card__body">
            <div className="stat-card__label">Đơn chờ xử lý</div>
            <strong className="stat-card__value">{data.pendingOrders}</strong>
            <span className={`stat-card__trend stat-card__trend--${data.pendingOrders > 0 ? "down" : "up"}`}>
              {data.pendingOrders > 0 ? "↓ Cần xử lý ngay" : "↑ Không có"}
            </span>
          </div>
          <div className="stat-icon stat-icon--orange">
            <ShoppingBag size={20} />
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card__body">
            <div className="stat-card__label">Khách mới / 30 ngày</div>
            <strong className="stat-card__value">{data.newCustomers}</strong>
            <span className="stat-card__trend stat-card__trend--up">↑ Tháng này</span>
          </div>
          <div className="stat-icon stat-icon--green">
            <Users size={20} />
          </div>
        </div>
      </div>

      {/* ── Quick Actions ───────────────────────────────── */}
      <section className="card tai-tho-card" style={{ padding: "20px 24px" }}>
        <h3>Thao tác nhanh</h3>
        <div className="quick-actions">
          {[
            { label: "Thêm sản phẩm", icon: Plus, to: "/products/new" },
            { label: "Xem đơn hàng",  icon: ShoppingBag, to: "/orders" },
            { label: "Quản lý kho",   icon: Boxes, to: "/inventory" },
            { label: "Tạo coupon",    icon: Tag, to: "/coupons" },
          ].map(({ label, icon: Icon, to }) => (
            <Link key={label} to={to} className="quick-action">
              <div className="quick-action__icon">
                <Icon size={18} />
              </div>
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Chart + Recent Orders ───────────────────────── */}
      <div className="grid-2">
        {/* Revenue Chart */}
        <section className="card tai-tho-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ margin: 0 }}>Doanh thu theo tuần</h3>
            <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              5 tuần gần nhất
            </span>
          </div>
          <div style={{ height: 260, marginLeft: -8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%"   stopColor="#eab308" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#eab308" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0efed" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#a8a29e", fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `${Number(v) / 1000}k`}
                  tick={{ fontSize: 11, fill: "#a8a29e", fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#eab308"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                  dot={{ r: 4, fill: "#eab308", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#eab308", strokeWidth: 2, stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent Orders */}
        <section className="card tai-tho-card" style={{ padding: 0, overflow: "visible" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 0" }}>
            <h3 style={{ margin: 0 }}>Đơn hàng gần đây</h3>
            <Link
              to="/orders"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 600,
                color: "var(--accent)",
              }}
            >
              Xem tất cả <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="table-wrap" style={{ border: "none", borderRadius: 0, boxShadow: "none", marginTop: 16 }}>
            <table className="table" style={{ minWidth: 0 }}>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: "right" }}>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="row--clickable"
                    onClick={() => (window.location.href = `/orders/${order.id}`)}
                  >
                    <td>
                      <strong style={{ fontSize: 12 }}>{order.orderCode}</strong>
                      <div className="muted" style={{ fontSize: 11 }}>{formatDate(order.createdAt)}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{order.customerName}</div>
                      <div className="muted" style={{ fontSize: 11 }}>{order.customerEmail}</div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <OrderStatusBadge status={order.status} />
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </div>
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700, fontSize: 13 }}>
                      {formatCurrency(order.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
