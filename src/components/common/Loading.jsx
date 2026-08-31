export default function Loading({ full = false, label = 'Loading…' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        full ? 'min-h-[70vh]' : 'py-16'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-neutral-200" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-black border-b-black" />
      </div>
      <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">
        {label}
      </span>
    </div>
  );
}
