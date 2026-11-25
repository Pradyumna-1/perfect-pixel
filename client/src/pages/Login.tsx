import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Lock, User } from 'lucide-react';
import { useAuth } from '../stores/auth-store';
import api from '../services/api-client';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { username, password });
      login(response.data.token);
      navigate('/admin');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Login failed. Please check your connection.',
      );
    }
  };

  return (
    <div className="admin-page flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 font-sans text-slate-900">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-center font-display text-2xl font-semibold text-slate-900">Admin Login</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Sign in to manage Perfect Pixel.</p>
        {error && (
          <div className="mt-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-500" role="alert">
            <AlertCircle size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="grid gap-2">
            <span className="text-xs font-semibold text-slate-700">Username</span>
            <div className="relative">
              <User size={18} strokeWidth={1.8} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin username"
                autoComplete="username"
                required
                className={`${inputClass} pl-10`}
              />
            </div>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold text-slate-700">Password</span>
            <div className="relative">
              <Lock size={18} strokeWidth={1.8} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className={`${inputClass} pl-10 pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition-colors hover:text-blue-500"
              >
                {showPassword ? <EyeOff size={17} strokeWidth={1.8} aria-hidden="true" /> : <Eye size={17} strokeWidth={1.8} aria-hidden="true" />}
              </button>
            </div>
          </label>
          <button type="submit" className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600">
            Login
          </button>
        </form>
        <div className="mt-6 grid gap-2 text-center text-sm">
          <Link to="/forgot-password" className="text-blue-500 hover:text-blue-600 hover:underline">Forgot Password?</Link>
          <Link to="/" className="text-slate-500 hover:text-blue-500 hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
