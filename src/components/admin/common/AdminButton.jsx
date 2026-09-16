import { Link } from 'react-router-dom';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97]';

const variants = {
  primary: 'bg-admin-primary text-white hover:bg-admin-primary-hover shadow-sm shadow-admin-primary/20',
  secondary: 'border border-admin-border bg-admin-card-elevated text-slate-700 hover:bg-admin-surface-subtle hover:border-slate-300',
  danger: 'bg-admin-danger text-white hover:bg-red-700 shadow-sm shadow-admin-danger/20',
  cancel: 'bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-sm shadow-[#EF4444]/20',
  success: 'bg-[#25A9EB] text-white hover:bg-[#2098D3] shadow-sm shadow-[#25A9EB]/20',
  ghost: 'text-slate-600 hover:bg-admin-border/40 hover:text-slate-900',
  outline: 'border-2 border-admin-primary text-admin-primary hover:bg-admin-primary hover:text-white',
  accent: 'bg-accent text-white hover:opacity-90',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
};

export default function AdminButton({
  variant = 'primary',
  size = 'md',
  to,
  children,
  className = '',
  ...props
}) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
