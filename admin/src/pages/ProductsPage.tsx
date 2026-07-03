import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import Pagination from "../components/Pagination";
import { EmptyState, ErrorState, LoadingState } from "../components/PageState";
import { ProductStatusBadge } from "../components/StatusBadge";
import { useAuth } from "../features/auth/AuthProvider";
import { apiRequest, buildQuery } from "../lib/api";
import { formatCurrency } from "../lib/format";
import type { ProductLine, ProductListData, ProductStatus } from "../types/api";

export default function ProductsPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [line, setLine] = useState<ProductLine | "">("");
  const [status, setStatus] = useState<ProductStatus | "">("");

  const query = useQuery({
    queryKey: ["products", page, search, line, status],
    queryFn: () =>
      apiRequest<ProductListData>(
        `/admin/products${buildQuery({ page, limit: 12, search, line, status })}`,
        { token },
      ),
  });

  const archive = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/admin/products/${id}`, { method: "DELETE", token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  return (
    <div className="page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2>Sản phẩm</h2>
          <p>Quản lý catalog, trạng thái bán, ảnh, giá và tồn kho ban đầu.</p>
        </div>
        <Link className="button" to="/products/new">
          <Plus size={15} />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Toolbar / Filters */}
      <div className="card toolbar tai-tho-card">
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
                placeholder="Tên, slug..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* Product line */}
          <div className="field">
            <label>Dòng sản phẩm</label>
            <select
              className="select"
              style={{ width: 160 }}
              value={line}
              onChange={(e) => {
                setLine(e.target.value as ProductLine | "");
                setPage(1);
              }}
            >
              <option value="">Tất cả</option>
              <option value="ASTRA">ASTRA</option>
              <option value="SIRIUS">SIRIUS</option>
              <option value="POLARIS">POLARIS</option>
            </select>
          </div>

          {/* Status */}
          <div className="field">
            <label>Trạng thái</label>
            <select
              className="select"
              style={{ width: 180 }}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as ProductStatus | "");
                setPage(1);
              }}
            >
              <option value="">Tất cả</option>
              <option value="DRAFT">Nháp</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="INACTIVE">Ngừng hoạt động</option>
              <option value="ARCHIVED">Đã lưu trữ</option>
            </select>
          </div>
        </div>

        {/* Result count */}
        {query.data && (
          <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
            {query.data.pagination.total} sản phẩm
          </span>
        )}
      </div>

      {/* Table */}
      {query.isLoading ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState message={query.error.message} onRetry={() => query.refetch()} />
      ) : query.data!.items.length === 0 ? (
        <EmptyState
          title="Chưa có sản phẩm phù hợp"
          description={search ? `Không tìm thấy kết quả cho "${search}"` : "Thêm sản phẩm đầu tiên để bắt đầu."}
          action={
            !search && (
              <Link to="/products/new" className="button button--sm">
                <Plus size={14} />
                Thêm sản phẩm
              </Link>
            )
          }
        />
      ) : (
        <>
          <div className="table-wrap tai-tho-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Dòng</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: "right" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {query.data!.items.map((product) => (
                  <tr key={product.id}>
                    {/* Product info */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img
                          className="product-thumb"
                          src={product.images[0]?.url ?? "/images/logo-youniverse.png"}
                          alt={product.name}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{product.name}</div>
                          <div className="muted mono" style={{ marginTop: 2 }}>{product.slug}</div>
                        </div>
                      </div>
                    </td>

                    {/* Line */}
                    <td>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          background: "var(--background)",
                          border: "1px solid var(--border-color)",
                          borderRadius: 6,
                          padding: "2px 8px",
                        }}
                      >
                        {product.productLine}
                      </span>
                    </td>

                    {/* Price */}
                    <td>
                      <strong style={{ fontSize: 13 }}>
                        {formatCurrency(product.salePrice ?? product.price)}
                      </strong>
                      {product.salePrice && (
                        <div
                          className="muted"
                          style={{ textDecoration: "line-through", fontSize: 12, marginTop: 2 }}
                        >
                          {formatCurrency(product.price)}
                        </div>
                      )}
                    </td>

                    {/* Stock */}
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color:
                            (product.inventory?.quantity ?? 0) <= 5
                              ? "var(--color-red)"
                              : "var(--foreground)",
                        }}
                      >
                        {product.inventory?.quantity ?? 0}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <ProductStatusBadge status={product.status} />
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="row-actions">
                        <Link
                          className="button button--secondary button--sm"
                          to={`/products/${product.id}/edit`}
                          title="Chỉnh sửa"
                        >
                          <Edit size={14} />
                          Sửa
                        </Link>
                        <button
                          className="button button--icon button--secondary"
                          type="button"
                          title="Xóa / Lưu trữ"
                          onClick={() => {
                            if (confirm(`Lưu trữ sản phẩm "${product.name}"?`))
                              archive.mutate(product.id);
                          }}
                          disabled={archive.isPending}
                          style={{ color: "var(--color-red)", borderColor: "rgba(239,68,68,0.20)" }}
                        >
                          <Trash2 size={14} />
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
    </div>
  );
}
