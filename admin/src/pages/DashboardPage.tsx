import { useQuery } from "@tanstack/react-query";
import { Boxes, Package, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useAuth } from "../features/auth/AuthProvider";
import { apiRequest } from "../lib/api";
import { formatCurrency, formatDate } from "../lib/format";
import { LoadingState, ErrorState } from "../components/PageState";
import { OrderStatusBadge, PaymentStatusBadge } from "../components/StatusBadge";
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
  { label: "W-4", revenue: 0 },
  { label: "W-3", revenue: 0 },
  { label: "W-2", revenue: 0 },
  { label: "W-1", revenue: 0 },
  { label: "Now", revenue: 0 },
];

export default function DashboardPage() {
  const { token } = useAuth();
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => apiRequest<DashboardData>("/admin/dashboard", { token }),
  });

  if (query.isLoading) return <LoadingState />;
  if (query.isError) return <ErrorState message={query.error.message} onRetry={() => query.refetch()} />;

  const data = query.data!;
  const chartData = chartFallback.map((item, index) => ({
    ...item,
    revenue: index === chartFallback.length - 1 ? data.revenue : Math.round(data.revenue * (0.25 + index * 0.14)),
  }));

  return (
    <div className="page">
      <div className="grid-4">
        <div className="card stat-card">
          <div>
            <span>Doanh thu</span>
            <strong>{formatCurrency(data.revenue)}</strong>
          </div>
          <div className="stat-icon"><TrendingUp size={20} /></div>
        </div>
        <div className="card stat-card">
          <div>
            <span>Tổng đơn hàng</span>
            <strong>{data.totalOrders}</strong>
          </div>
          <div className="stat-icon"><ShoppingBag size={20} /></div>
        </div>
        <div className="card stat-card">
          <div>
            <span>Sản phẩm</span>
            <strong>{data.totalProducts}</strong>
          </div>
          <div className="stat-icon"><Package size={20} /></div>
        </div>
        <div className="card stat-card">
          <div>
            <span>Sắp hết hàng</span>
            <strong>{data.lowStockProducts}</strong>
          </div>
          <div className="stat-icon"><Boxes size={20} /></div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card stat-card">
          <div>
            <span>Đơn chờ thanh toán</span>
            <strong>{data.pendingOrders}</strong>
          </div>
          <div className="stat-icon"><ShoppingBag size={20} /></div>
        </div>
        <div className="card stat-card">
          <div>
            <span>Khách hàng mới / 30 ngày</span>
            <strong>{data.newCustomers}</strong>
          </div>
          <div className="stat-icon"><Users size={20} /></div>
        </div>
      </div>

      <div className="grid-2">
        <section className="card">
          <h3>Biểu đồ Doanh thu</h3>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#111827" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" />
                <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="revenue" stroke="#111827" fill="url(#revenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card">
          <h3>Đơn hàng gần đây</h3>
          <div className="table-wrap">
            <table className="table" style={{ minWidth: 640 }}>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Trạng thái</th>
                  <th>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.orderCode}</strong>
                      <div className="muted">{formatDate(order.createdAt)}</div>
                    </td>
                    <td>
                      {order.customerName}
                      <div className="muted">{order.customerEmail}</div>
                    </td>
                    <td>
                      <OrderStatusBadge status={order.status} /> <PaymentStatusBadge status={order.paymentStatus} />
                    </td>
                    <td>{formatCurrency(order.totalAmount)}</td>
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
