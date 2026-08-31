export const ColorSelector = ({ colors, selectedId, onColorChange }) => {
  if (!colors || colors.length === 0) return null;

  const preview = colors.slice(0, 4).map((c, i) => ({
    ...c,
    key: c.id != null ? c.id : i,
  }));
  const extra = colors.length - preview.length;

  return (
    <div className="flex flex-wrap gap-2">
      {preview.map((c) => (
        <button
          key={c.key}
          onClick={() => onColorChange(c)}
          type="button"
          aria-label={`Select color ${c.name}`}
          title={c.name}
          className={`relative h-[60px] w-[60px] shrink-0 overflow-hidden border object-contain p-1 transition-all sm:h-[70px] sm:w-[70px] lg:h-20 lg:w-20 ${
            selectedId === c.id
              ? 'border-2 border-neutral-900'
              : 'border hover:border-neutral-900'
          }`}
        >
          <img
            src={c.image}
            alt={c.name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </button>
      ))}
      {extra > 0 && (
        <span className="flex h-[60px] w-[60px] items-center justify-center border border-neutral-200 p-1 text-xs font-bold text-neutral-500 sm:h-[70px] sm:w-[70px] lg:h-20 lg:w-20">
          +{extra}
        </span>
      )}
    </div>
  );
}
