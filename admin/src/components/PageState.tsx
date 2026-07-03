import { ReactNode } from "react";
import { AlertCircle, Inbox, RefreshCw } from "lucide-react";

/* ── Loading state ─────────────────────────── */
export function LoadingState() {
  return (
    <div className="page" style={{ gap: 16 }}>
      {/* Skeleton stat cards row */}
      <div className="grid-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card" style={{ height: 108, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="skeleton skeleton-text" style={{ width: "55%" }} />
              <div className="skeleton skeleton-title" style={{ width: "70%" }} />
              <div className="skeleton skeleton-text" style={{ width: "40%" }} />
            </div>
            <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0 }} />
          </div>
        ))}
      </div>

      {/* Skeleton table */}
      <div className="table-wrap">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="skeleton skeleton-text" style={{ width: 160 }} />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="skeleton-row skeleton"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 20px",
              background: "none",
              animation: `shimmer 1.4s ease-in-out ${i * 0.08}s infinite`,
            }}
          >
            <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <div className="skeleton skeleton-text" style={{ width: `${55 + i * 6}%` }} />
              <div className="skeleton skeleton-text" style={{ width: `${30 + i * 4}%` }} />
            </div>
            <div className="skeleton skeleton-text" style={{ width: 80 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Error state ───────────────────────────── */
export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="page-state page-state--error">
      <div className="page-state__icon">
        <AlertCircle size={22} />
      </div>
      <div>
        <div className="page-state__title">Đã có lỗi xảy ra</div>
        <div className="page-state__desc">{message}</div>
      </div>
      {onRetry && (
        <button className="button button--secondary button--sm" type="button" onClick={onRetry}>
          <RefreshCw size={14} />
          Thử lại
        </button>
      )}
    </div>
  );
}

/* ── Empty state ───────────────────────────── */
export function EmptyState({
  title = "Không có dữ liệu",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-state">
      <div className="page-state__icon">
        <Inbox size={22} />
      </div>
      <div>
        <div className="page-state__title">{title}</div>
        {description && <div className="page-state__desc">{description}</div>}
      </div>
      {action}
    </div>
  );
}
