import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from '../api/auth';
import { useAuth } from "../context/AuthContext";

const roleRedirects = {
    sender: "/sender/dashboard",
    tracker: "/tracker/dashboard",
};

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.email || !form.password) {
            setError('Email and password are required');
            return;
        }

        setLoading(true);
        try {
            const data = await loginUser(form);
            login(data.user, data.token);
            navigate(roleRedirects[data.user.role] || '/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Subtle Background Glow Decorative Blur */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 backdrop-blur-sm transition-all">

                {/* Header / Branding */}
                <div className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white shadow-md shadow-slate-900/10 mb-5">
                        {/* Logistics Box/Shipment Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.75}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                            />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Logistics Tracker
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-500">
                        Welcome back! Please sign in to your account.
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mt-6 flex items-start gap-2.5 p-3.5 text-sm text-red-600 bg-red-50/80 border border-red-100 rounded-xl text-left font-medium">
                        <svg className="w-5 h-5 shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form className="mt-6 space-y-4 text-left" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                            Email address
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="name@company.com"
                            onChange={handleChange}
                            required
                            className="block w-full px-3.5 py-2.5 text-slate-900 placeholder-slate-400 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-sm"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Password
                            </label>
                        </div>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            required
                            className="block w-full px-3.5 py-2.5 text-slate-900 placeholder-slate-400 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 shadow-sm mt-4"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Authenticating...
                            </span>
                        ) : (
                            'Sign in'
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <p className="text-center text-sm text-slate-500 mt-8">
                    New to the platform?{' '}
                    <Link to="/register" className="font-semibold text-slate-900 hover:underline transition duration-150">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}