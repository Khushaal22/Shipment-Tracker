import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
                            Welcome back, {user?.name || 'User'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Select an action below to manage or monitor your shipments.
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition duration-150 shadow-sm"
                    >
                        Logout
                    </button>
                </div>

                {/* Main Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Create Shipment Card */}
                    <div
                        onClick={() => navigate('/sender/dashboard')}
                        className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all duration-150 cursor-pointer"
                    >
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.75}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Create Shipment
                            </h3>
                            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                Book a new dispatch, enter package details, and generate tracking information.
                            </p>
                        </div>

                        <div className="mt-8">
                            <button className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 shadow-sm">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2.5}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4.5v15m7.5-7.5h-15"
                                    />
                                </svg>
                                Create Shipment
                            </button>
                        </div>
                    </div>

                    {/* Track Shipment Card - Updated to match Create Shipment primary style */}
                    <div
                        onClick={() => navigate('/tracker/dashboard')}
                        className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all duration-150 cursor-pointer"
                    >
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.75}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.243c0-.57-.42-1.057-.988-1.116a48.424 48.424 0 00-3.762 0c-.568.059-.988.546-.988 1.116v.243M12 7.5h2.25"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Track Shipment
                            </h3>
                            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                Enter a tracking ID to check live delivery statuses and transit updates.
                            </p>
                        </div>

                        <div className="mt-8">
                            <button className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 shadow-sm">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2.5}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                    />
                                </svg>
                                Track Shipment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}