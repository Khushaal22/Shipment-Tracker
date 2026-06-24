import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../api/axios';

export default function ShipmentDetail() {
    const { id } = useParams();
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShipment = async () => {
            try {
                const res = await api.get(`/shipments/${id}`);
                setShipment(res.data.shipment);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load shipment');
            } finally {
                setLoading(false);
            }
        };
        fetchShipment();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!shipment) return null;

    return (
        <div>
            <button onClick={() => navigate('/sender/my-shipments')}>← Back</button>
            <h2 style={{ margin: '16px 0 4px' }}>Shipment Details</h2>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                Tracking Number: <strong>{shipment.trackingNumber}</strong>
            </p>

            <section>
                <h3>Status</h3>
                <p style={{ textTransform: 'capitalize' }}>
                    {shipment.currentStatus.replace(/_/g, ' ')}
                </p>
                <p>
                    Estimated Delivery:{' '}
                    {new Date(shipment.estimatedDelivery).toDateString()}
                </p>
            </section>

            <section style={{ marginTop: '16px' }}>
                <h3>Receiver</h3>
                <p>{shipment.receiverName}</p>
                <p>{shipment.receiverPhone}</p>
                {shipment.receiverEmail && <p>{shipment.receiverEmail}</p>}
            </section>

            <section style={{ marginTop: '16px' }}>
                <h3>Route</h3>
                <p>From: {shipment.sourceCity} — {shipment.pickupAddress}</p>
                <p>To: {shipment.destinationCity} — {shipment.deliveryAddress}</p>
            </section>

            <section style={{ marginTop: '16px' }}>
                <h3>Parcel</h3>
                <p>Type: {shipment.parcelType}</p>
                <p>Weight: {shipment.parcelWeight} kg</p>
            </section>

            {shipment.currentStatus === 'Cancelled' && (
                <section style={{ marginTop: '16px', color: 'red' }}>
                    <h3>Cancellation</h3>
                    <p>Reason: {shipment.cancelReason}</p>
                    <p>
                        Cancelled at: {new Date(shipment.cancelledAt).toDateString()}
                    </p>
                </section>
            )}
        </div>
    );
}
