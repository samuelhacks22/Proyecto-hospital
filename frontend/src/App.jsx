import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import BookAppointment from './pages/BookAppointment';
import Appointments from './pages/Appointments';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ClinicDashboard from './pages/ClinicDashboard';




const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user || !allowedRoles.includes(user.rol)) return <Navigate to="/dashboard" replace />;
  return children;
};


function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Patient Only */}
        <Route path="book-appointment" element={
          <RoleRoute allowedRoles={['PACIENTE']}>
            <BookAppointment />
          </RoleRoute>
        } />

        {/* Shared (Patient/Doctor) */}
        <Route path="appointments" element={<Appointments />} />

        {/* Admin Only */}
        <Route path="admin" element={
          <RoleRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </RoleRoute>
        } />

        {/* Clinic Only */}
        <Route path="clinic" element={
          <RoleRoute allowedRoles={['CLINICA']}>
            <ClinicDashboard />
          </RoleRoute>
        } />

        <Route path="profile" element={<Profile />} />


      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes >
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
