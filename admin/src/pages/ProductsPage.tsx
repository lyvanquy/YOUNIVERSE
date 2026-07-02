import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
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
    mutationFn: (id: string) => apiRequest(`/admin/products/${id}`, { method: "DELETE", token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Products</h2>
          <p>Quản lý catalog, trạng thái bán, ảnh, giá và tồn kho ban đầu.</p>
        </div>
        <Link className="button" to="/admin/products/new">
          <Plus size={16} />
          New Product
        </Link>
      </div>

      <div className="card toolbar">
        <div className="filters">
          <div className="field">
            <label>Search</label>
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: 10, top: 12, color: "#71717a" }} />
              <input className="input" style={{ paddingLeft: 34 }} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            </div>
          </div>
          <div className="field">
            <label>Line</label>
            <select className="select" value={line} onChange={(e) => { setLine(e.target.value as ProductLine | ""); setPage(1); }}>
              <option value="">All</option>
              <option value="ASTRA">ASTRA</option>
              <option value="SIRIUS">SIRIUS</option>
              <option value="POLARIS">POLARIS</option>
            </select>
          </div>
          <div className="field">
            <label>Status</label>
            <select className="select" value={status} onChange={(e) => { setStatus(e.target.value as ProductStatus | ""); setPage(1); }}>
              <option value="">All</option>
              <option value="DRAFT">DRAFT</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>
      </div>

      {query.isLoading ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState message={query.error.message} onRetry={() => query.refetch()} />
      ) : query.data!.items.length === 0 ? (
        <EmptyState title="Chưa có sản phẩm phù hợp" />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Line</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {query.data!.items.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img className="product-thumb" src={product.images[0]?.url ?? "/images/logo-youniverse.png"} alt="" />
                        <div>
                          <strong>{product.name}</strong>
                          <div className="muted mono">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>{product.productLine}</td>
                    <td>
                      <strong>{formatCurrency(product.salePrice ?? product.price)}</strong>
                      {product.salePrice && <div className="muted" style={{ textDecoration: "line-through" }}>{formatCurrency(product.price)}</div>}
                    </td>
                    <td>{product.inventory?.quantity ?? 0}</td>
                    <td><ProductStatusBadge status={product.status} /></td>
                    <td>
                      <div className="row-actions">
                        <Link className="button button--secondary" to={`/admin/products/${product.id}/edit`}>
                          <Edit size={15} />
                          Edit
                        </Link>
                        <button
                          className="button button--danger"
                          type="button"
                          onClick={() => {
                            if (confirm(`Archive ${product.name}?`)) archive.mutate(product.id);
                          }}
                          disabled={archive.isPending}
                        >
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
    </div>
  );
}
