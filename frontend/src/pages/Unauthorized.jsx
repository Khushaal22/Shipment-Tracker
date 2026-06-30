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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">

                {/* Minimalist Forbidden Shield Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 text-amber-600 mb-2 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                    </svg>
                </div>

                {/* Error Context */}
                <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-md">
                        Error Code 403
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-4">
                        Access Denied
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
                        Your current account profile does not possess the credentials required to clear authorization for this endpoint.
                    </p>
                </div>

                {/* Primary Routing CTA */}
                <div className="pt-2">
                    <button
                        onClick={() => navigate(roleRedirects[user?.role] || '/login')}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 shadow-sm"
                    >
                        Go to my dashboard
                    </button>
                </div>

            </div>
        </div>
    );

} 