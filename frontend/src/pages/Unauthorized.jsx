import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleRedirects = {
    sender: '/sender/dashboard',
    tracker: '/tracker/dashboard',
    admin: '/admin/dashboard',
};

export default function Unauthorized() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div>
            <h2>403 — Access Denied</h2>
            <p>You don't have permission to view this page.</p>
            <button onClick={() => navigate(roleRedirects[user?.role] || '/login')}>
                Go to my dashboard
            </button>
        </div>
    );
    
} 