import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const STAT_CARDS = [
    { key: 'total', label: 'Total Shipment', color: '#6b7280' },
    { key: 'pending', label: 'Pending', color: '#f59e0b' },
    { key: 'picked_up', label: 'Picked Up', color: '#3b82f6' },
    { key: 'in_transit', label: 'In Transit', color: '#8b5cf6' },
    { key: 'out_for_delivery', label: 'Out for Delivery', color: '#06b6d4' },
    { key: 'delivered', label: 'Delivered', color: '#10b981' },
    { key: 'cancelled', label: 'Cancelled', color: '#ef4444' },
];

export default function SenderDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setstats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/shipments/stats');
                setstats(res.data.stats);
            } catch (err) {
                setError('Failed to load stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
                            Welcome back, {user?.name || 'User'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Here is your shipment overview and activity metrics.
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition duration-150 shadow-sm"
                    >
                        Logout
                    </button>
                </div>

                {/* Stats Cards Grid */}
                {loading ? (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                        <p className="text-sm text-slate-400 font-medium animate-pulse">Loading stats...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-sm font-medium text-red-600">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {STAT_CARDS.map((card) => (
                            <div
                                key={card.key}
                                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between transition-all duration-150 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        {card.label}
                                    </span>
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: card.color }}
                                    />
                                </div>
                                <p
                                    className="text-3xl font-bold mt-4 tracking-tight"
                                    style={{ color: card.color }}
                                >
                                    {stats[card.key] ?? 0}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Manage & Quick Actions Workspace */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Manage your Shipments</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Choose an operations workspace below to create new dispatches or track ongoing items.
                        </p>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/sender/create-shipment')}
                            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Create New Shipment
                        </button>

                        <button
                            onClick={() => navigate('/sender/my-shipments')}
                            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/10 transition duration-150 shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            My Shipments
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}