import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api/axios';

const PARCEL_TYPES = ['documents', 'electronics', 'clothing', 'fragile', 'other'];

export default function CreateShipment() {
  const [form, setForm] = useState({
    receiverName: '',
    receiverPhone: '',
    receiverEmail: '',
    pickupAddress: '',
    deliveryAddress: '',
    sourceCity: '',
    destinationCity: '',
    parcelWeight: '',
    parcelType: 'documents'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/shipments', {
        ...form,
        parcelWeight: parseFloat(form.parcelWeight),
      });
      setSuccess(res.data.shipment);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-50 text-green-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Shipment Created</h2>
            <p className="mt-1.5 text-sm text-slate-500">Your order has been logged into the routing network.</p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 my-4">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Tracking Number
            </span>
            <h3 className="text-xl font-mono font-bold tracking-widest text-slate-800 select-all">
              {success.trackingNumber}
            </h3>
          </div>

          <div className="text-sm text-slate-600 space-y-1">
            <p>Save this number to monitor your assets.</p>
            <p className="font-medium text-slate-900">
              Estimated Delivery: {new Date(success.estimatedDelivery).toDateString()}
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/sender/my-shipments')}
              className="flex-1 justify-center py-2.5 px-4 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition duration-150 shadow-sm"
            >
              View Shipments
            </button>
            <button
              onClick={() => {
                setForm({
                  receiverName: '',
                  receiverPhone: '',
                  receiverEmail: '',
                  pickupAddress: '',
                  deliveryAddress: '',
                  sourceCity: '',
                  destinationCity: '',
                  parcelWeight: '',
                  parcelType: 'documents'
                });
                setSuccess(null);
              }}
              className="flex-1 justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition duration-150 shadow-sm"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/xl" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Create New Shipment
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Fill out the details to create a hassle free shipment!!
          </p>
        </div>
        {error && (
          <div className="p-3.5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg text-center font-medium animate-pulse">
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              Receiver Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Receiver Name</label>
                <input
                  name="receiverName"
                  value={form.receiverName}
                  placeholder="Full name"
                  onChange={handleChange}
                  required
                  className="block w-full px-3.5 py-2 text-slate-900 placeholder-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition duration-150 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Receiver Phone</label>
                <input
                  name="receiverPhone"
                  value={form.receiverPhone}
                  placeholder="Phone number"
                  onChange={handleChange}
                  required
                  className="block w-full px-3.5 py-2 text-slate-900 placeholder-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition duration-150 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Receiver Email <span className="text-slate-400 font-normal">(optional)</span></label>
              <input
                name="receiverEmail"
                type="email"
                value={form.receiverEmail}
                placeholder="name@domain.com"
                onChange={handleChange}
                className="block w-full px-3.5 py-2 text-slate-900 placeholder-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition duration-150 text-sm"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              Address / Routing
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Pickup Address</label>
                <input
                  name="pickupAddress"
                  value={form.pickupAddress}
                  placeholder="Street address, building..."
                  onChange={handleChange}
                  required
                  className="block w-full px-3.5 py-2 text-slate-900 placeholder-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition duration-150 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Delivery Address</label>
                <input
                  name="deliveryAddress"
                  value={form.deliveryAddress}
                  placeholder="Apartment, unit, suite..."
                  onChange={handleChange}
                  required
                  className="block w-full px-3.5 py-2 text-slate-900 placeholder-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition duration-150 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Source City</label>
                <input
                  name="sourceCity"
                  value={form.sourceCity}
                  placeholder="Origin city"
                  onChange={handleChange}
                  required
                  className="block w-full px-3.5 py-2 text-slate-900 placeholder-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition duration-150 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Destination City</label>
                <input
                  name="destinationCity"
                  value={form.destinationCity}
                  placeholder="Target city"
                  onChange={handleChange}
                  required
                  className="block w-full px-3.5 py-2 text-slate-900 placeholder-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition duration-150 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              Parcel Specifics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Parcel Weight (kg)</label>
                <input
                  name="parcelWeight"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={form.parcelWeight}
                  placeholder="0.0"
                  onChange={handleChange}
                  required
                  className="block w-full px-3.5 py-2 text-slate-900 placeholder-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition duration-150 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Parcel Type</label>
                <div className="relative">
                  <select
                    name="parcelType"
                    value={form.parcelType}
                    onChange={handleChange}
                    className="block w-full px-3.5 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition duration-150 text-sm appearance-none cursor-pointer"
                  >
                    {PARCEL_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/sender/dashboard')}
              className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition duration-150 shadow-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex justify-center py-2.5 px-5 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 shadow-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : 'Create Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}