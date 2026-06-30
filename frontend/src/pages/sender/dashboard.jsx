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
        <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                    <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        </span>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
                            Welcome back, {user?.name || 'User'}
                        </h2>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition duration-150 shadow-sm"
                    >
                        Logout
                    </button>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Manage your Shipments</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            {/* replace below line */}
                            Dispatched goods routing pipelines. Choose an operations workspace below.
                        </p>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/sender/create-shipment')}
                            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Create New Shipment
                        </button>

                        <button
                            onClick={() => navigate('/sender/my-shipments')}
                            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/10 transition duration-150 shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            My Shipments
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}