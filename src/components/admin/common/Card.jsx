export default function Card({ title, subtitle, action, children, className = '', bodyClassName = '' }) {
  return (
    <div className={`rounded-xl border border-admin-border bg-admin-card shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-admin-border-subtle px-5 py-4">
          <div>
            {title && <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
