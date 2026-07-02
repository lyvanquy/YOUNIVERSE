export function LoadingState({ label = "Đang tải dữ liệu..." }: { label?: string }) {
  return (
    <div className="page-state">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="page-state page-state--error">
      <strong>Không tải được dữ liệu</strong>
      <span>{message}</span>
      {onRetry && (
        <button className="button button--secondary" type="button" onClick={onRetry}>
          Thử lại
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="page-state">
      <strong>{title}</strong>
      {description && <span>{description}</span>}
    </div>
  );
}
