type StatusCardProps = {
  label: string;
  count: number;
  onClick: () => void;
};

function StatusCard({ label, count, onClick }: StatusCardProps) {
  return (
    <button type="button" className="status-card" onClick={onClick}>
      <span>{label}</span>
      <strong>{count} 件</strong>
    </button>
  );
}

export default StatusCard;
