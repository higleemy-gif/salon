import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NewBillPage from './pages/NewBillPage';
import BillsPage from './pages/BillsPage';
import CustomersPage from './pages/CustomersPage';
import ServicesPage from './pages/ServicesPage';
import SettingsPage from './pages/SettingsPage';
import WhatsAppPage from './pages/WhatsAppPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          {/* basename = Vite base ("/admin/"), so routes below are relative to /admin */}
          <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="dashboard" element={<Navigate to="/" replace />} />
                  <Route path="bill" element={<NewBillPage />} />
                  <Route path="bills" element={<BillsPage />} />
                  <Route path="customers" element={<CustomersPage />} />
                  <Route path="services" element={<ServicesPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="whatsapp" element={<WhatsAppPage />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
