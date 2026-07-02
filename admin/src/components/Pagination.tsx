import type { Pagination as PaginationType } from "../types/api";

export default function Pagination({
  pagination,
  onPageChange,
}: {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="pagination">
      <span>
        Trang {pagination.page}/{Math.max(pagination.totalPages, 1)} · {pagination.total} dòng
      </span>
      <div>
        <button
          className="button button--secondary"
          type="button"
          disabled={pagination.page <= 1}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          Trước
        </button>
        <button
          className="button button--secondary"
          type="button"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Sau
        </button>
      </div>
    </div>
  );
}
