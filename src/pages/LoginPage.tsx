import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(username, password);
      navigate('/chat');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Input
          label="Username"
          type="text"
          placeholder="enter username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
          autoComplete="username"
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && (
          <div style={{
            padding: '10px 14px',
            background: 'rgba(255,110,180,0.08)',
            border: '1px solid rgba(255,110,180,0.2)',
            borderRadius: 8,
            fontSize: 13,
            color: 'var(--accent-pink)',
            fontFamily: 'var(--font-mono)',
          }}>
            {error}
          </div>
        )}

        <Button type="submit" fullWidth loading={loading}>
          Sign In →
        </Button>

        <p style={{
          textAlign: 'center',
          fontSize: 13,
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          No account?{' '}
          <Link
            to="/register"
            style={{ color: 'var(--text-accent)', textDecoration: 'none' }}
          >
            Register here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
