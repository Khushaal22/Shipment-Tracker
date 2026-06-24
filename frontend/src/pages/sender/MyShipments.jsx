import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api/axios';

const STATUS_COLORS = {
  Pending: '#f59e0b',
  picked_up: '#3b82f6',
  In_Transit: '#8b5cf6',
  Out_For_Delivery: '#06b6d4',
  Delivered: '#10b981',
  Cancelled: '#ef4444',
};

export default function MyShipments() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  const fetchShipments = async () => {
    try {
      const res = await api.get('/shipments/my');
      setShipments(res.data.shipments);
    } catch (err) {
      setError('Failed to load shipmetns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleCancel = async (id) => {
    const confirmed = window.confirm('Are you sure you wwant to cancel this shipment?');
    if (!confirmed) return;
    try {
      setCancellingId(id);
      await api.patch(`/shipments/${id}/cancel`, {
        cancelReason: 'Cancelled by sender',
      });
      await fetchShipments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel shipment');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <p>Loading shipments...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Shipments</h2>
        <button onClick={() => navigate('/sender/create-shipment')}>
          + New Shipment
        </button>
      </div>

      {shipments.length === 0 ? (
        <p style={{ marginTop: '20px' }}>
          No shipments yet.{' '}
          <span
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => navigate('/sender/create-shipment')}
          >
            Create your first one.
          </span>
        </p>
      ) : (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {shipments.map((s) => (
            <div
              key={s._id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{s.trackingNumber}</strong>
                <span
                  style={{
                    color: STATUS_COLORS[s.currentStatus] || '#6b7280',
                    fontWeight: 500,
                    textTransform: 'capitalize',
                  }}
                >
                  {s.currentStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <p style={{ margin: '6px 0', color: '#6b7280', fontSize: '14px' }}>
                To: {s.receiverName} — {s.sourceCity} → {s.destinationCity}
              </p>
              <p style={{ fontSize: '13px', color: '#9ca3af' }}>
                Created: {new Date(s.createdAt).toDateString()}
              </p>
              <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                <button onClick={() => navigate(`/sender/shipment/${s._id}`)}>
                  View Details
                </button>
                {s.currentStatus === 'Pending' && (
                  <button
                    onClick={() => handleCancel(s._id)}
                    disabled={cancellingId === s._id}
                    style={{ color: 'red' }}
                  >
                    {cancellingId === s._id ? 'Cancelling...' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}