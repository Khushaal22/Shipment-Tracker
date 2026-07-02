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
        <div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Welcome, {user?.name}</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div style={{ marginTop: '24px' }}>
                <h3>Track a Shipment</h3>
                <form onSubmit={handleTrack} style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <input
                        type="text"
                        placeholder="Enter tracking number e.g. SHP-XXXXX-XXXX"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        style={{ flex: 1, padding: '8px 12px', fontSize: '14px' }}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Tracking...' : 'Track'}
                    </button>
                </form>
                {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
            </div>
            {result && (
                <div style={{ marginTop: '28px' }}>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '13px', color: '#9ca3af' }}>Tracking Number</p>
                                <strong style={{ fontSize: '16px' }}>{result.shipment.trackingNumber}</strong>
                            </div>
                            <span
                                style={{
                                    background: STATUS_COLORS[result.shipment.currentStatus] + '22',
                                    color: STATUS_COLORS[result.shipment.currentStatus],
                                    padding: '4px 14px',
                                    borderRadius: '20px',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                }}
                            >
                                {STATUS_LABELS[result.shipment.currentStatus]}
                            </span>
                        </div>

                        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <p style={{ fontSize: '12px', color: '#9ca3af' }}>From</p>
                                <p style={{ fontWeight: 500 }}>{result.shipment.sourceCity}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: '#9ca3af' }}>To</p>
                                <p style={{ fontWeight: 500 }}>{result.shipment.destinationCity}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: '#9ca3af' }}>Receiver</p>
                                <p style={{ fontWeight: 500 }}>{result.shipment.receiverName}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: '#9ca3af' }}>Estimated Delivery</p>
                                <p style={{ fontWeight: 500 }}>
                                    {new Date(result.shipment.estimatedDelivery).toDateString()}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: '#9ca3af' }}>Parcel Type</p>
                                <p style={{ fontWeight: 500, textTransform: 'capitalize' }}>
                                    {result.shipment.parcelType}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: '#9ca3af' }}>Weight</p>
                                <p style={{ fontWeight: 500 }}>{result.shipment.parcelWeight} kg</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '24px' }}>
                        <h3 style={{ marginBottom: '16px' }}>Shipment Timeline</h3>
                        {result.history.length === 0 ? (
                            <p style={{ color: '#9ca3af' }}>No history available yet</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                {result.history.map((entry, index) => (
                                    <div key={entry._id} style={{ display: 'flex', gap: '16px' }}>
                                        {/* Timeline line and dot */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <div
                                                style={{
                                                    width: '14px',
                                                    height: '14px',
                                                    borderRadius: '50%',
                                                    background: STATUS_COLORS[entry.status] || '#6b7280',
                                                    flexShrink: 0,
                                                    marginTop: '4px',
                                                }}
                                            />
                                            {index < result.history.length - 1 && (
                                                <div style={{ width: '2px', flex: 1, background: '#e5e7eb', minHeight: '32px' }} />
                                            )}
                                        </div>
                                        {/* Entry content */}
                                        <div style={{ paddingBottom: '20px' }}>
                                            <p style={{ fontWeight: 600, textTransform: 'capitalize', margin: 0 }}>
                                                {STATUS_LABELS[entry.status]}
                                            </p>
                                            {entry.location && (
                                                <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0' }}>
                                                    📍 {entry.location}
                                                </p>
                                            )}
                                            {entry.note && (
                                                <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0' }}>
                                                    {entry.note}
                                                </p>
                                            )}
                                            <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0' }}>
                                                {new Date(entry.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}