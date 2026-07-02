import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import Badge from "../components/Badge";
import Pagination from "../components/Pagination";
import { EmptyState, ErrorState, LoadingState } from "../components/PageState";
import { useAuth } from "../features/auth/AuthProvider";
import { apiRequest, buildQuery } from "../lib/api";
import { formatDate } from "../lib/format";
import type { Pagination as PaginationType, UserRole, UserStatus } from "../types/api";

type UserRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  orderCount: number;
  cartCount: number;
  createdAt: string;
  updatedAt: string;
};

type UserData = {
  items: UserRow[];
  pagination: PaginationType;
};

export default function UsersPage() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [status, setStatus] = useState<UserStatus | "">("");

  const query = useQuery({
    queryKey: ["users", page, search, role, status],
    queryFn: () => apiRequest<UserData>(`/admin/users${buildQuery({ page, limit: 15, search, role, status })}`, { token }),
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Users</h2>
          <p>Xem tài khoản khách hàng và admin. Backend hiện hỗ trợ read-only.</p>
        </div>
      </div>

      <div className="card toolbar">
        <div className="filters">
          <div className="field"><label>Search</label><input className="input" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></div>
          <div className="field">
            <label>Role</label>
            <select className="select" value={role} onChange={(e) => { setRole(e.target.value as UserRole | ""); setPage(1); }}>
              <option value="">All</option><option value="CUSTOMER">CUSTOMER</option><option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div className="field">
            <label>Status</label>
            <select className="select" value={status} onChange={(e) => { setStatus(e.target.value as UserStatus | ""); setPage(1); }}>
              <option value="">All</option><option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option><option value="BANNED">BANNED</option>
            </select>
          </div>
        </div>
      </div>

      {query.isLoading ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState message={query.error.message} onRetry={() => query.refetch()} />
      ) : query.data!.items.length === 0 ? (
        <EmptyState title="Không có user phù hợp" />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Orders</th><th>Carts</th><th>Created</th></tr></thead>
              <tbody>
                {query.data!.items.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.fullName}</strong>
                      <div className="muted">{user.email}</div>
                      <div className="muted">{user.phone ?? "-"}</div>
                    </td>
                    <td><Badge tone={user.role === "ADMIN" ? "purple" : "blue"}>{user.role}</Badge></td>
                    <td><Badge tone={user.status === "ACTIVE" ? "green" : user.status === "BANNED" ? "red" : "amber"}>{user.status}</Badge></td>
                    <td>{user.orderCount}</td>
                    <td>{user.cartCount}</td>
                    <td>{formatDate(user.createdAt)}</td>
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
