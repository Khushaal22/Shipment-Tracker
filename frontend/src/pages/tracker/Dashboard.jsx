import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const STATUS_COLORS = {
    pending: '#f59e0b',
    picked_up: '#3b82f6',
    in_transit: '#8b5cf6',
    out_for_delivery: '#06b6d4',
    delivered: '#10b981',
    cancelled: '#ef4444',
};

const STATUS_LABELS = {
    pending: 'Pending',
    picked_up: 'Picked Up',
    in_transit: 'In Transit',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

export default function TrackerDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [trackingNumber, setTrackingNumber] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleTrack = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);
        if (!trackingNumber) {
            setError('Please enter a tracking number!');
            return;
        }
        setLoading(true);
        try {
            const res = await api.get(`/track/${trackingNumber.trim()}`);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to track shipment');
        } finally {
            setLoading(false);
        }
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
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition duration-150 shadow-sm"
                    >
                        Logout
                    </button>
                </div>

                {/* Track a Shipment Search Box */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Track a Shipment</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Enter your tracking number below to view live routing status and history.
                        </p>
                    </div>

                    <form onSubmit={handleTrack} className="mt-6 flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Enter tracking number e.g. SHP-XXXXX-XXXX"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            className="flex-1 min-w-0 block w-full px-4 py-3 rounded-xl border border-slate-200 text-sm placeholder-slate-400 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition duration-150"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center py-3 px-6 border border-transparent rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 shadow-sm disabled:opacity-70"
                        >
                            {loading ? 'Tracking...' : 'Track'}
                        </button>
                    </form>
                    {error && (
                        <p className="text-sm font-medium text-red-600 mt-3 flex items-center gap-1.5">
                            {error}
                        </p>
                    )}
                </div>

                {/* Tracking Results Panel */}
                {result && (
                    <div className="space-y-6 progress-fade-in">

                        {/* Meta Info Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                                <div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tracking Number</span>
                                    <h4 className="text-xl font-bold text-slate-900 mt-0.5">{result.shipment.trackingNumber}</h4>
                                </div>
                                <span
                                    style={{
                                        backgroundColor: STATUS_COLORS[result.shipment.currentStatus] + '15',
                                        color: STATUS_COLORS[result.shipment.currentStatus],
                                    }}
                                    className="self-start sm:self-center px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase"
                                >
                                    {STATUS_LABELS[result.shipment.currentStatus]}
                                </span>
                            </div>

                            {/* Shipment Details Grid */}
                            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
                                {[
                                    { label: 'From', val: result.shipment.sourceCity },
                                    { label: 'To', val: result.shipment.destinationCity },
                                    { label: 'Receiver', val: result.shipment.receiverName },
                                    { label: 'Estimated Delivery', val: new Date(result.shipment.estimatedDelivery).toDateString() },
                                    { label: 'Parcel Type', val: result.shipment.parcelType, capitalize: true },
                                    { label: 'Weight', val: `${result.shipment.parcelWeight} kg` },
                                ].map((item, i) => (
                                    <div key={i}>
                                        <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{item.label}</span>
                                        <p className={`text-sm font-medium text-slate-800 mt-1 ${item.capitalize ? 'capitalize' : ''}`}>
                                            {item.val}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Timeline History Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Shipment Timeline</h3>

                            {result.history.length === 0 ? (
                                <p className="text-sm text-slate-400 font-medium py-2">No history available yet</p>
                            ) : (
                                <div className="flex flex-col">
                                    {result.history.map((entry, index) => (
                                        <div key={entry._id} className="flex gap-4 group">

                                            {/* Pure CSS Vertical Indicator */}
                                            <div className="flex flex-col items-center w-4 flex-shrink-0">
                                                <div
                                                    style={{ backgroundColor: STATUS_COLORS[entry.status] || '#cbd5e1' }}
                                                    className="w-3 h-3 rounded-full mt-1.5 ring-4 ring-white z-10 flex-shrink-0"
                                                />
                                                {index < result.history.length - 1 && (
                                                    <div className="w-0.5 flex-1 bg-slate-100 group-hover:bg-slate-200 transition-colors duration-150 min-h-[48px]" />
                                                )}
                                            </div>

                                            {/* Entry Content Area */}
                                            <div className="pb-6 flex-1">
                                                <span className="text-sm font-bold text-slate-900 block capitalize">
                                                    {STATUS_LABELS[entry.status]}
                                                </span>
                                                {entry.location && (
                                                    <span className="text-xs font-semibold text-slate-400 tracking-wide inline-flex items-center gap-1 mt-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                                        Location: {entry.location}
                                                    </span>
                                                )}
                                                {entry.note && (
                                                    <p className="text-sm text-slate-500 mt-1.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 italic">
                                                        {entry.note}
                                                    </p>
                                                )}
                                                <span className="text-[11px] font-medium text-slate-400 block mt-2">
                                                    {new Date(entry.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}