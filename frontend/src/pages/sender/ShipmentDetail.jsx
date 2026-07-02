import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../api/axios';

const STATUS_COLORS = {
  pending: '#f59e0b',
  picked_up: '#3b82f6',
  in_transit: '#8b5cf6',
  out_for_delivery: '#06b6d4',
  delivered: '#10b981',
  cancelled: '#ef4444',
};

export default function ShipmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShipmentDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/shipments/${id}`);
        // Adjust res.data based on your API response wrapper shape
        setShipment(res.data.shipment || res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch shipment details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchShipmentDetails();
  }, [id]);

  // 2. LOADING STATE: Prevents reading properties of null while waiting on the network
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-sm font-semibold text-slate-500 flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading manifest details...
        </div>
      </div>
    );
  }

  // 3. ERROR STATE: Elegant fallback if the ID is wrong or server drops out
  if (error || !shipment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center space-y-4">
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg font-medium">
            {error || 'Shipment record not found.'}
          </div>
          <button
            onClick={() => navigate('/sender/my-shipments')}
            className="w-full py-2 px-4 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition duration-150 shadow-sm"
          >
            Return to Shipments List
          </button>
        </div>
      </div>
    );
  }

  // 4. MAIN DATA SHEET VIEW (Only executes when shipment safely exists)
  const currentStatus = shipment.currentStatus || 'pending';
  const statusColor = STATUS_COLORS[currentStatus] || '#6b7280';

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Navigation & Header */}
        <div className="flex flex-col space-y-4 border-b border-slate-200 pb-5">
          <div>
            <button
              onClick={() => navigate('/sender/my-shipments')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to My Shipments
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Shipment Manifest</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Tracking Token: <span className="font-mono font-bold text-slate-700 select-all">{shipment.trackingNumber}</span>
              </p>
            </div>

            <div>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-block"
                style={{
                  backgroundColor: `${statusColor}15`,
                  color: statusColor
                }}
              >
                {currentStatus.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Main Data Sheet Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">

          {/* 1. Fulfillment Tracking Status */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 rounded-t-2xl">
            <div className="md:col-span-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Logistics Windows</h3>
            </div>
            <div className="md:col-span-2 space-y-1">
              <p className="text-sm text-slate-500">Estimated Delivery Arrival:</p>
              <p className="text-base font-semibold text-slate-900">
                {shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toDateString() : 'TBD'}
              </p>
            </div>
          </div>

          {/* 2. Routing Information */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Route & Transit</h3>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                  <div className="w-0.5 h-10 bg-slate-200 my-1" />
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-slate-800">{shipment.sourceCity}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{shipment.pickupAddress}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{shipment.destinationCity}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{shipment.deliveryAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Receiver Information */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Receiver Allocation</h3>
            </div>
            <div className="md:col-span-2 text-sm space-y-1">
              <p className="font-semibold text-slate-900 text-base">{shipment.receiverName}</p>
              <p className="text-slate-600 font-medium">{shipment.receiverPhone}</p>
              {shipment.receiverEmail && (
                <p className="text-slate-400 text-xs font-normal pt-0.5">{shipment.receiverEmail}</p>
              )}
            </div>
          </div>

          {/* 4. Parcel Specifications */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Freight Particulars</h3>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Classification</p>
                <p className="font-semibold text-slate-800 capitalize mt-0.5">{shipment.parcelType}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Mass Metric</p>
                <p className="font-semibold text-slate-800 mt-0.5">{shipment.parcelWeight} kg</p>
              </div>
            </div>
          </div>

          {/* 5. Decommission Log (Cancellation Banner) */}
          {currentStatus === 'cancelled' && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-red-50/50 rounded-b-2xl border-t border-red-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-700">Decommission Log</h3>
              </div>
              <div className="md:col-span-2 text-sm text-red-900 space-y-1">
                <p className="font-medium"><span className="text-red-500 font-normal">Reason:</span> {shipment.cancelReason || 'Not specified'}</p>
                <p className="text-xs text-red-600 font-normal">
                  Timestamped: {shipment.cancelledAt ? new Date(shipment.cancelledAt).toDateString() : 'N/A'}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}