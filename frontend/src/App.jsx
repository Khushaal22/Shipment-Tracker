import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import Home from './pages/Home';
import TrackPage from './pages/TrackPage';
import SenderDashboard from './pages/sender/dashboard';
import CreateShipment from './pages/sender/createShipment';
import MyShipments from './pages/sender/MyShipments';
import ShipmentDetail from './pages/sender/ShipmentDetail';
import TrackerDashboard from './pages/tracker/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/track/:trackingNumber" element={<TrackPage />} />

          {/* Protected home */}
          <Route path="/home" element={
            <PrivateRoute><Home /></PrivateRoute>
          } />

          {/* Sender routes */}
          <Route path="/sender/dashboard" element={
            <PrivateRoute><SenderDashboard /></PrivateRoute>
          } />
          <Route path="/sender/create-shipment" element={
            <PrivateRoute><CreateShipment /></PrivateRoute>
          } />
          <Route path="/sender/my-shipments" element={
            <PrivateRoute><MyShipments /></PrivateRoute>
          } />
          <Route path="/sender/shipment/:id" element={
            <PrivateRoute><ShipmentDetail /></PrivateRoute>
          } />

          {/* Tracker routes */}
          <Route path="/tracker/dashboard" element={
            <PrivateRoute><TrackerDashboard /></PrivateRoute>
          } />

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}