export default function AdminLoading({ label = 'Loading...' }) {
  return (
    <div
      className="flex w-full flex-col items-center justify-center py-16"
      role="status"
      aria-live="polite"
    >
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-neutral-200" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-neutral-900" />
      </div>
      <span className="mt-4 text-sm font-medium text-neutral-500">{label}</span>
    </div>
  );
}
