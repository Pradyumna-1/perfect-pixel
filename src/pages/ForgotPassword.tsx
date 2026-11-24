import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import api from '../api';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fallbackOtp, setFallbackOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setFallbackOtp('');

    try {
      const response = await api.post('/auth/forgot-password', { identifier });
      setMessage(response.data.message);
      if (response.data.method === 'otp') {
        setShowOtpForm(true);
        setPhone(response.data.phone);
        if (response.data.fallbackOtp) setFallbackOtp(response.data.fallbackOtp);
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/auth/reset-password-otp', { phone, otp, newPassword });
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 font-sans text-slate-900">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-center font-display text-2xl font-semibold text-slate-900">
          {showOtpForm ? 'Enter OTP' : 'Forgot Password'}
        </h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          {showOtpForm
            ? 'Enter the code sent to your phone and choose a new password.'
            : 'Enter your email for a reset link or phone number for an OTP.'}
        </p>
        {message && (
          <div className="mt-5 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-600" role="status">
            <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />
            {message}
          </div>
        )}
        {error && (
          <div className="mt-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-500" role="alert">
            <AlertCircle size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}
        {!showOtpForm ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="grid gap-2">
              <span className="text-xs font-semibold text-slate-700">Email or phone</span>
              <div className="relative">
                <Mail size={18} strokeWidth={1.8} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="user@example.com or 1234567890"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </label>
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-50">
              {loading ? 'Sending...' : 'Send Reset Link / OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="mt-6 space-y-4">
            {fallbackOtp && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="mb-2 flex items-center gap-2 border-b border-blue-200 pb-2 text-sm font-semibold text-blue-600">
                  <ShieldCheck size={16} strokeWidth={2} aria-hidden="true" />
                  Email service delayed
                </div>
                <p className="text-sm text-slate-600">Use this verification code to finish your reset now:</p>
                <div className="mt-3 rounded-lg border border-dashed border-blue-400 bg-white px-3 py-2 text-center font-mono text-xl tracking-[0.3em] text-slate-900">
                  {fallbackOtp}
                </div>
              </div>
            )}
            <label className="grid gap-2">
              <span className="text-xs font-semibold text-slate-700">Enter OTP</span>
              <div className="relative">
                <ShieldCheck size={18} strokeWidth={1.8} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-semibold text-slate-700">New password</span>
              <div className="relative">
                <KeyRound size={18} strokeWidth={1.8} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Enter a new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </label>
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-50">
              {loading ? 'Verifying...' : 'Reset Password'}
            </button>
          </form>
        )}
        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-blue-500 hover:text-blue-600 hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
