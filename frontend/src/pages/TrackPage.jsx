import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

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

export default function TrackPage() {
    const { trackingNumber } = useParams();
    const navigate = useNavigate();
    const [input, setInput] = useState(trackingNumber || '');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (trackingNumber) {
            fetchTracking(trackingNumber);
        }
    }, [trackingNumber]);

    const fetchTracking = async (number) => {
        setError('');
        setResult(null);
        setLoading(true);
        try {
            const res = await api.get(`/track/${number.trim()}`);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to track shipment');
        } finally {
            setLoading(false);
        }
    };

    const handleTrack = (e) => {
        e.preventDefault();
        if (!input.trim()) {
            setError('Please enter a tracking number');
            return;
        }
        navigate(`/track/${input.trim()}`);
    };

    return (
        <div style={{ maxWidth: '640px', margin: '40px auto', padding: '0 16px' }}>
            <h2>Track Your Shipment</h2>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                Enter your tracking number to see the current status and timeline.
            </p>

            <form onSubmit={handleTrack} style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="e.g. SHP-XXXXX-XXXX"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', fontSize: '14px' }}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Tracking...' : 'Track'}
                </button>
            </form>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

            {result && (
                <div style={{ marginTop: '28px' }}>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '13px', color: '#9ca3af' }}>Tracking Number</p>
                                <strong>{result.shipment.trackingNumber}</strong>
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
                        </div>
                    </div>
                    <div style={{ marginTop: '24px' }}>
                        <h3 style={{ marginBottom: '16px' }}>Shipment Timeline</h3>
                        {result.history.length === 0 ? (
                            <p style={{ color: '#9ca3af' }}>No history available yet</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {result.history.map((entry, index) => (
                                    <div key={entry._id} style={{ display: 'flex', gap: '16px' }}>
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
                                        <div style={{ paddingBottom: '20px' }}>
                                            <p style={{ fontWeight: 600, margin: 0 }}>
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