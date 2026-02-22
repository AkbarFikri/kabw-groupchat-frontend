import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!username || !password) return 'Please fill in all fields';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 50) return 'Username must be at most 50 characters';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      await register(username, password);
      navigate('/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join GroupChat and start chatting"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Input
          label="Username"
          type="text"
          placeholder="choose a username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
          autoComplete="username"
        />
        <Input
          label="Password"
          type="password"
          placeholder="min. 6 characters"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
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
          Create Account →
        </Button>

        <p style={{
          textAlign: 'center',
          fontSize: 13,
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ color: 'var(--text-accent)', textDecoration: 'none' }}
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
