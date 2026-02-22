import React, { type ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-base)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(124,106,247,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124,106,247,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)',
      }} />

      {/* Glow orb */}
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,106,247,0.08) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      <div className="animate-fadeUp" style={{
        position: 'relative',
        width: '100%',
        maxWidth: 420,
        margin: '0 24px',
      }}>
        {/* Logo mark */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
          }}>
            <div style={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-pink))',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}>
              ◈
            </div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: '-0.5px',
              color: 'var(--text-primary)',
            }}>
              GroupChat
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 28,
            color: 'var(--text-primary)',
            letterSpacing: '-0.5px',
            marginBottom: 6,
          }}>
            {title}
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--text-secondary)',
          }}>
            {subtitle}
          </p>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '32px 28px',
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
