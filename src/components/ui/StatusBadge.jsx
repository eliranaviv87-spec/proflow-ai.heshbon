/**
 * Shared document status badge
 */
const STATUS_MAP = {
  Verified: { label: "מאומת", color: "#00E5FF" },
  Archived: { label: "הותאם", color: "#4ade80" },
  Pending_Review: { label: "ממתין", color: "#FFAB00" },
  Processing: { label: "מעבד...", color: "#B388FF" },
};

export default function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label: status, color: "#fff" };
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full"
      style={{
        background: `${s.color}18`,
        color: s.color,
        border: `1px solid ${s.color}33`,
      }}
    >
      {s.label}
    </span>
  );
}