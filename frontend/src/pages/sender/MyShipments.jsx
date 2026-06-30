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
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              My Shipments
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Track and manage your orders in real time!!
            </p>
          </div>

          <button
            onClick={() => navigate('/sender/create-shipment')}
            className="inline-flex items-center gap-1.5 py-2 px-3.5 border border-transparent rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Shipment
          </button>
        </div>

        {shipments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-900 font-medium text-base">No shipments registered yet</p>
              <p className="text-sm text-slate-500 mt-1">
                Get started by logging your first consignment payload into our manifest.
              </p>
            </div>
            <button
              onClick={() => navigate('/sender/create-shipment')}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition duration-150 inline-flex items-center gap-1"
            >
              Create your first one &rarr;
            </button>
          </div>
        ) : (
          /* ACTIVE SHIPMENTS GRID/LIST */
          <div className="space-y-3">
            {shipments.map((s) => (
              <div
                key={s._id}
                className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-sm hover:border-slate-300/90 transition duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left Column: Shipment Specifics */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-slate-800 tracking-wide select-all">
                      {s.trackingNumber}
                    </span>

                    {/* Modern pill badge system */}
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-block"
                      style={{
                        backgroundColor: `${STATUS_COLORS[s.currentStatus] || '#6b7280'}15`,
                        color: STATUS_COLORS[s.currentStatus] || '#6b7280'
                      }}
                    >
                      {s.currentStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600">
                    To: <span className="font-medium text-slate-800">{s.receiverName}</span>
                    <span className="mx-2 text-slate-300">|</span>
                    <span className="font-medium text-slate-700">{s.sourceCity}</span>
                    <span className="text-slate-400 font-light px-1">&rarr;</span>
                    <span className="font-medium text-slate-700">{s.destinationCity}</span>
                  </p>

                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    Logged: {new Date(s.createdAt).toDateString()}
                  </div>
                </div>

                {/* Right Column: Interaction Controls */}
                <div className="flex items-center gap-2 sm:self-center border-t border-slate-50 pt-3 sm:pt-0 sm:border-0">
                  <button
                    onClick={() => navigate(`/sender/shipment/${s._id}`)}
                    className="flex-1 sm:flex-none px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition duration-150 shadow-sm"
                  >
                    View Details
                  </button>

                  {s.currentStatus === 'Pending' && (
                    <button
                      type="button"
                      onClick={() => handleCancel(s._id)}
                      disabled={cancellingId === s._id}
                      className="flex-1 sm:flex-none px-3 py-2 border border-transparent rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
                    >
                      {cancellingId === s._id ? (
                        <span className="flex items-center justify-center gap-1">
                          <svg className="animate-spin h-3.5 w-3.5 text-red-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          ...
                        </span>
                      ) : 'Cancel'}
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}