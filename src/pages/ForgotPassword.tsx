import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const ForgotPassword = () => {
    const [identifier, setIdentifier] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // OTP State
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
                if (response.data.fallbackOtp) {
                    setFallbackOtp(response.data.fallbackOtp);
                }
            }

        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to process request. Please try again.');
            }
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
            const response = await api.post('/auth/reset-password-otp', {
                phone,
                otp,
                newPassword
            });
            setMessage(response.data.message);

            // Redirect to login after success
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to verify OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {showOtpForm ? 'Enter OTP' : 'Forgot Password'}
                </h2>

                {!showOtpForm && (
                    <p className="text-gray-400 mb-6 text-sm text-center">
                        Enter your email for a reset link OR phone number for an OTP.
                    </p>
                )}

                {message && (
                    <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded mb-4 text-sm">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {!showOtpForm ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block mb-2 text-sm text-gray-300">Email or Phone</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-accent outline-none text-white placeholder-gray-500"
                                placeholder="user@example.com or 1234567890"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent hover:bg-accent/80 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link/OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleOtpSubmit}>
                        {fallbackOtp && (
                            <div className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 p-4 rounded-lg mb-6 text-sm">
                                <p className="font-bold border-b border-yellow-500/30 pb-2 mb-2">⚠️ Email Service Delayed</p>
                                <p>To help you finish your reset now, use this emergency code:</p>
                                <div className="text-2xl font-mono font-bold tracking-[10px] text-center mt-3 bg-black/40 py-2 rounded">
                                    {fallbackOtp}
                                </div>
                            </div>
                        )}
                        <div className="mb-4">
                            <label className="block mb-2 text-sm text-gray-300">Enter OTP</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-accent outline-none text-white placeholder-gray-500"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-sm text-gray-300">New Password</label>
                            <input
                                type="password"
                                required
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-accent outline-none text-white"
                                placeholder="******"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent hover:bg-accent/80 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-accent hover:underline text-sm">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
