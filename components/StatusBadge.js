const STATUS_CONFIG = {
  pending:    { label: 'Pending',    className: 'badge-pending' },
  paid:       { label: 'Paid',       className: 'badge-paid' },
  processing: { label: 'Processing', className: 'badge-processing' },
  shipped:    { label: 'Shipped',    className: 'badge-shipped' },
  delivered:  { label: 'Delivered',  className: 'badge-delivered' },
  cancelled:  { label: 'Cancelled',  className: 'badge-cancelled' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pending;

  return (
    <span className={config.className}>
      {config.label}
    </span>
  );
}
