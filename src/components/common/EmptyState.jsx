import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      {Icon && (
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
          <Icon className="h-9 w-9 text-neutral-400" />
        </div>
      )}
      <h3 className="heading-display text-xl sm:text-2xl">{title}</h3>
      {description && (
        <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
          {description}
        </p>
      )}
      {actionLabel && actionTo && (
        <div className="mt-8">
          <Button to={actionTo}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
