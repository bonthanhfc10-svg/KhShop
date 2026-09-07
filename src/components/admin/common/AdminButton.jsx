import { Link } from 'react-router-dom';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

const variants = {
  primary: 'bg-neutral-900 text-white hover:bg-neutral-700 shadow-sm',
  secondary: 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50',
  danger: 'bg-red-600 text-white hover:bg-red-500',
  ghost: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
  outline: 'border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white',
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
