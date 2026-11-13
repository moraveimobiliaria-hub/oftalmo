export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  const text = light ? "text-white" : "text-navy";
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${text} ${className}`}>
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M2 16C6 9 11 6 16 6s10 3 14 10c-4 7-9 10-14 10S6 23 2 16Z" fill="none" stroke="#8ecae6" strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="16" cy="16" r="5.2" fill="#2ec4b6" />
        <circle cx="16" cy="16" r="2.2" fill="#0b2545" />
      </svg>
      <span className="text-xl">
        Ofta<span className="text-aqua">Study</span>
      </span>
    </span>
  );
}
