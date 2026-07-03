import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import Pagination from "../components/Pagination";
import { EmptyState, ErrorState, LoadingState } from "../components/PageState";
import { useAuth } from "../features/auth/AuthProvider";
import { apiRequest, buildQuery } from "../lib/api";
import { formatDate } from "../lib/format";
import type { Feedback, Pagination as PaginationType } from "../types/api";

type FeedbackData = {
  feedbacks?: Feedback[];
  items?: Feedback[];
  pagination: PaginationType;
};

export default function FeedbacksPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: ["feedbacks", page, search],
    queryFn: () => apiRequest<FeedbackData>(`/admin/feedbacks${buildQuery({ page, limit: 15, search })}`, { token }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiRequest(`/admin/feedbacks/${id}`, { method: "DELETE", token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feedbacks"] }),
  });

  const items = query.data?.items ?? query.data?.feedbacks ?? [];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Ý kiến phản hồi</h2>
          <p>Phản hồi khách gửi từ form “Unleash Your YOUniverse”.</p>
        </div>
      </div>

      <div className="card toolbar">
        <div className="filters">
          <div className="field"><label>Tìm kiếm</label><input className="input" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></div>
        </div>
      </div>

      {query.isLoading ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState message={query.error.message} onRetry={() => query.refetch()} />
      ) : items.length === 0 ? (
        <EmptyState title="Chưa có feedback phù hợp" />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Người gửi</th><th>Nội dung phản hồi</th><th>Ngày gửi</th><th></th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.fullName}</strong><div className="muted">{item.email}</div></td>
                    <td style={{ maxWidth: 520 }}>{item.message}</td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="button button--danger"
                          type="button"
                          disabled={remove.isPending}
                          onClick={() => {
                            if (confirm("Xóa phản hồi này?")) remove.mutate(item.id);
                          }}
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
