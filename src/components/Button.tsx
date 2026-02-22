import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  loading = false,
  fullWidth = false,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '10px 20px',
    borderRadius: 8,
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    fontWeight: 500,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    border: 'none',
    transition: 'all 150ms ease',
    width: fullWidth ? '100%' : undefined,
    opacity: disabled || loading ? 0.6 : 1,
    letterSpacing: '0.02em',
    ...style,
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, var(--accent), #9b8cf7)',
      color: '#fff',
      boxShadow: '0 2px 12px rgba(124,106,247,0.3)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border)',
    },
    danger: {
      background: 'transparent',
      color: 'var(--accent-pink)',
      border: '1px solid rgba(255,110,180,0.3)',
    },
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={e => {
        if (disabled || loading) return;
        const el = e.currentTarget;
        if (variant === 'primary') el.style.transform = 'translateY(-1px)';
        if (variant === 'ghost') el.style.borderColor = 'var(--border-bright)';
        if (variant === 'ghost') el.style.color = 'var(--text-primary)';
        if (variant === 'danger') el.style.background = 'rgba(255,110,180,0.08)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.transform = '';
        if (variant === 'ghost') { el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-secondary)'; }
        if (variant === 'danger') el.style.background = 'transparent';
      }}
    >
      {loading ? (
        <span style={{
          display: 'inline-block',
          width: 14,
          height: 14,
          border: '2px solid rgba(255,255,255,0.3)',
          borderTopColor: '#fff',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite',
        }} />
      ) : null}
      {children}
    </button>
  );
}
