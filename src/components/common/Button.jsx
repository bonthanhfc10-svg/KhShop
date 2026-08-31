import { Link } from 'react-router-dom';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  'outline-light': 'btn-outline-light',
};

const sizes = {
  sm: 'px-4 py-2.5 text-[11px]',
  md: 'px-7 py-3.5 text-xs',
  lg: 'px-10 py-5 text-sm',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  className = '',
  children,
  ...props
}) {
  const classes = `${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
