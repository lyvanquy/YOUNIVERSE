import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { FormEvent, useState } from "react";

import Pagination from "../components/Pagination";
import { EmptyState, ErrorState, LoadingState } from "../components/PageState";
import Badge from "../components/Badge";
import { useAuth } from "../features/auth/AuthProvider";
import { apiRequest, buildQuery } from "../lib/api";
import { formatDate } from "../lib/format";
import type { InventoryChangeType, InventoryItem, Pagination as PaginationType } from "../types/api";

type InventoryData = {
  items: InventoryItem[];
  pagination: PaginationType;
};

export default function InventoryPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [lowStock, setLowStock] = useState("");
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const [type, setType] = useState<InventoryChangeType>("IMPORT");
  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["inventory", page, search, lowStock],
    queryFn: () => apiRequest<InventoryData>(`/admin/inventory${buildQuery({ page, limit: 15, search, lowStock })}`, { token }),
  });

  const adjust = useMutation({
    mutationFn: () =>
      apiRequest(`/admin/inventory/${selected!.productId}/adjust`, {
        method: "PATCH",
        token,
        body: { type, quantity: Number(quantity), note: note || null },
      }),
    onSuccess: () => {
      setSelected(null);
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Không điều chỉnh được kho."),
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    adjust.mutate();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Inventory</h2>
          <p>Theo dõi tồn kho, cảnh báo low-stock và ghi log điều chỉnh.</p>
        </div>
      </div>

      <div className="card toolbar">
        <div className="filters">
          <div className="field"><label>Search</label><input className="input" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></div>
          <div className="field">
            <label>Low Stock</label>
            <select className="select" value={lowStock} onChange={(e) => { setLowStock(e.target.value); setPage(1); }}>
              <option value="">All</option><option value="true">Low stock only</option><option value="false">Healthy only</option>
            </select>
          </div>
        </div>
      </div>

      {query.isLoading ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState message={query.error.message} onRetry={() => query.refetch()} />
      ) : query.data!.items.length === 0 ? (
        <EmptyState title="Không có dữ liệu tồn kho" />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Product</th><th>Qty</th><th>Sold</th><th>Threshold</th><th>Logs</th><th></th></tr></thead>
              <tbody>
                {query.data!.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img className="product-thumb" src={item.product.imageUrl ?? "/images/logo-youniverse.png"} alt="" />
                        <div><strong>{item.product.name}</strong><div className="muted">{item.product.productLine} · {item.product.status}</div></div>
                      </div>
                    </td>
                    <td><strong>{item.quantity}</strong> {item.isLowStock && <Badge tone="red">LOW</Badge>}</td>
                    <td>{item.soldQuantity}</td>
                    <td>{item.lowStockThreshold}</td>
                    <td>
                      {item.logs.slice(0, 2).map((log) => (
                        <div key={log.id} className="muted">{log.type} {log.quantity} · {formatDate(log.createdAt)}</div>
                      ))}
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="button button--secondary" type="button" onClick={() => setSelected(item)}>
                          <SlidersHorizontal size={15} /> Adjust
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

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <form className="modal page" onSubmit={onSubmit} onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <div><h3>Adjust Inventory</h3><p className="muted">{selected.product.name}</p></div>
              <button className="button button--secondary" type="button" onClick={() => setSelected(null)}>Close</button>
            </div>
            {error && <div className="page-state page-state--error" style={{ minHeight: 0 }}>{error}</div>}
            <div className="grid-2">
              <div className="field">
                <label>Type</label>
                <select className="select" value={type} onChange={(e) => setType(e.target.value as InventoryChangeType)}>
                  <option value="IMPORT">IMPORT</option><option value="EXPORT">EXPORT</option><option value="ADJUSTMENT">ADJUSTMENT</option>
                </select>
              </div>
              <div className="field"><label>Quantity</label><input className="input" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} /></div>
            </div>
            <div className="field"><label>Note</label><textarea className="textarea" value={note} onChange={(e) => setNote(e.target.value)} /></div>
            <button className="button" type="submit" disabled={adjust.isPending}>Save adjustment</button>
          </form>
        </div>
      )}
    </div>
  );
}
