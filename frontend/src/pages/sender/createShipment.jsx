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
      <div>
        <h2>Shipment Created Successfully</h2>
        <p>Your tracking number is:</p>
        <h3 style={{ letterSpacing: '2px', margin: '12px 0' }}>
          {success.trackingNumber}
        </h3>
        <p>Save this number to track your shipment.</p>
        <p>
          Estimated Delivery:{' '}
          {new Date(success.estimatedDelivery).toDateString()}
        </p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/sender/my-shipments')}>
            View My Shipments
          </button>
          <button onClick={() => {
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
          }}>
            Create Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>Create New Shipment</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>

        <h3>Receiver Information</h3>
        <div>
          <label>Receiver Name</label>
          <input
            name="receiverName"
            value={form.receiverName}
            placeholder="Full name"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Receiver Phone</label>
          <input
            name="receiverPhone"
            value={form.receiverPhone}
            placeholder="Phone number"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Receiver Email (optional)</label>
          <input
            name="receiverEmail"
            type="email"
            value={form.receiverEmail}
            placeholder="Email address"
            onChange={handleChange}
          />
        </div>

        <h3>Address Details</h3>
        <div>
          <label>Pickup Address</label>
          <input
            name="pickupAddress"
            value={form.pickupAddress}
            placeholder="Full pickup address"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Delivery Address</label>
          <input
            name="deliveryAddress"
            value={form.deliveryAddress}
            placeholder="Full delivery address"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Source City</label>
          <input
            name="sourceCity"
            value={form.sourceCity}
            placeholder="City of origin"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Destination City</label>
          <input
            name="destinationCity"
            value={form.destinationCity}
            placeholder="City of destination"
            onChange={handleChange}
            required
          />
        </div>

        <h3>Parcel Information</h3>
        <div>
          <label>Parcel Weight (kg)</label>
          <input
            name="parcelWeight"
            type="number"
            step="0.1"
            min="0.1"
            value={form.parcelWeight}
            placeholder="Weight in kg"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Parcel Type</label>
          <select name="parcelType" value={form.parcelType} onChange={handleChange}>
            {PARCEL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Shipment'}
          </button>
          <button type="button" onClick={() => navigate('/sender/dashboard')}>
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}