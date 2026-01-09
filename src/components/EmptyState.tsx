type Props = {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
};

export default function EmptyState({
  title,
  subtitle,
  actionText,
  onAction,
}: Props) {
  return (
    <div className="empty-state">
      <h3 className="empty-title">{title}</h3>
      {subtitle && <p className="empty-subtitle">{subtitle}</p>}

      {actionText && onAction && (
        <button className="control-btn" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}
