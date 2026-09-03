export default function Card({ title, subtitle, action, children, className = '', bodyClassName = '' }) {
  return (
    <div className={`border border-neutral-200 bg-white shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <div>
            {title && <h3 className="font-display text-base font-semibold text-neutral-900">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-sm text-neutral-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
