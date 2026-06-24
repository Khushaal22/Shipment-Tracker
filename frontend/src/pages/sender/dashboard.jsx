import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SenderDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Welcome, {user?.name}</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <button onClick={() => navigate('/sender/create-shipment')}>
                    + Create New Shipment
                </button>
                <button onClick={() => navigate('/sender/my-shipments')}>
                    My Shipments
                </button>
            </div>
        </div>
    );
}