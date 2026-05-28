/**
 * Reusable loading spinner
 */
export default function Spinner({ color = "#00E5FF", size = "md" }) {
  const dim = size === "sm" ? "w-5 h-5" : size === "lg" ? "w-10 h-10" : "w-7 h-7";
  return (
    <div
      className={`${dim} border-2 rounded-full animate-spin`}
      style={{
        borderColor: `${color}33`,
        borderTopColor: color,
      }}
    />
  );
}