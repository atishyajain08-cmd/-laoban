import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
}

const styles: Record<string, React.CSSProperties> = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    borderRadius: '2px',
    transition: 'all var(--transition-fast)',
    whiteSpace: 'nowrap' as const,
  },
  primary: {
    backgroundColor: 'var(--color-charcoal)',
    color: 'var(--color-ivory)',
    border: '1px solid var(--color-charcoal)',
  },
  secondary: {
    backgroundColor: 'var(--color-gold)',
    color: 'var(--color-charcoal)',
    border: '1px solid var(--color-gold)',
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--color-charcoal)',
    border: '1px solid var(--color-charcoal)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--color-charcoal)',
    border: '1px solid transparent',
  },
  sm: { padding: '8px 16px', fontSize: '0.75rem' },
  md: { padding: '12px 24px', fontSize: '0.8rem' },
  lg: { padding: '16px 32px', fontSize: '0.85rem' },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      style={{
        ...styles.base,
        ...styles[variant],
        ...styles[size],
        ...(fullWidth ? { width: '100%' } : {}),
        ...style,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        if (variant === 'primary') {
          el.style.backgroundColor = 'var(--color-charcoal-light)';
        } else if (variant === 'outline') {
          el.style.backgroundColor = 'var(--color-charcoal)';
          el.style.color = 'var(--color-ivory)';
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        if (variant === 'primary') {
          el.style.backgroundColor = 'var(--color-charcoal)';
        } else if (variant === 'outline') {
          el.style.backgroundColor = 'transparent';
          el.style.color = 'var(--color-charcoal)';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}
