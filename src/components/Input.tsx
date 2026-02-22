import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        {label}
      </label>
      <input
        {...props}
        style={{
          width: '100%',
          padding: '10px 14px',
          background: 'var(--bg-base)',
          border: `1px solid ${error ? 'var(--accent-pink)' : 'var(--border)'}`,
          borderRadius: 8,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          fontSize: 14,
          transition: 'var(--transition)',
          outline: 'none',
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = error ? '#ff6eb4' : '#7c6af7';
          e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? 'rgba(255,110,180,0.12)' : 'rgba(124,106,247,0.12)'}`;
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = error ? '#ff6eb4' : 'var(--border)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      {error && (
        <span style={{ fontSize: 12, color: 'var(--accent-pink)', fontFamily: 'var(--font-mono)' }}>
          ⚠ {error}
        </span>
      )}
    </div>
  );
}
