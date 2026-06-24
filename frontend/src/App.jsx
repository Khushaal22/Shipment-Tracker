import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RoleRoute from './components/RoleRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import SenderDashboard from './pages/sender/dashboard';
import CreateShipment from './pages/sender/createShipment';
import MyShipments from './pages/sender/MyShipments';
import ShipmentDetail from './pages/sender/ShipmentDetail';


// Placeholder dashboards — filled out in later phases
function TrackerDashboard() {
  return <h2>Tracker Dashboard — Phase 3 builds this</h2>;
}
function AdminDashboard() {
  return <h2>Admin Dashboard — Phase 5 builds this</h2>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Sender only */}
          <Route
            path="/sender/dashboard"
            element={
              <RoleRoute allowedRoles={['sender']}>
                <SenderDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/sender/create-shipment"
            element={
              <RoleRoute allowedRoles={['sender']}>
                <CreateShipment />
              </RoleRoute>
            } />
          <Route
            path="/sender/my-shipments"
            element={
              <RoleRoute allowedRoles={['sender']}>
                <MyShipments />
              </RoleRoute>
            } />
          <Route
            path="/sender/shipment/:id"
            element={
              <RoleRoute allowedRoles={['sender']}>
                <ShipmentDetail /></RoleRoute>
            } />

          {/* Tracker only */}
          <Route
            path="/tracker/dashboard"
            element={
              <RoleRoute allowedRoles={['tracker']}>
                <TrackerDashboard />
              </RoleRoute>
            }
          />

          {/* Admin only */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />

          {/* Default */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}