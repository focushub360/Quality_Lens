import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import theme from './styles/theme';
import AuthProvider from './contexts/AuthContext';
import { ThemeSettingsProvider } from './contexts/ThemeContext';
import { TaskProvider } from './contexts/TaskContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Logout from './components/auth/Logout';
import LoginPage from './pages/auth/LoginPage';
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import DealerDashboard from './pages/dealer-admin/Dashboard';
import UserManagement from './pages/super-admin/UserManagement';
import DealerManagement from './pages/super-admin/DealerManagement';
import NewAnalysis from './pages/dealer-admin/NewAnalysis';
import BulkUpload from './pages/dealer-admin/BulkUpload';
import Results from './pages/dealer-admin/Results';
import DealerUsers from './pages/dealer-admin/Users';
import AccountProfile from './pages/dealer-admin/AccountProfile';
import ChangePassword from './pages/dealer-admin/ChangePassword';
import SupportPage from './pages/SupportPage';
import ThemeSettings from './pages/config/ThemeSettings';

export default function App() {
  return (
    <AuthProvider>
      <ThemeSettingsProvider>
        <CssBaseline />
        <TaskProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<Logout />} />

            {/* Shared Configuration Routes (all authenticated roles) */}
            <Route element={<ProtectedRoute roles={["super_admin", "dealer_admin", "dealer_user", "branch_admin"]} />}>
              <Route path="/config" element={<Navigate to="/config/theme" replace />} />
              <Route path="/config/theme" element={<Layout><ThemeSettings /></Layout>} />
            </Route>

            <Route element={<ProtectedRoute roles={["super_admin"]} />}>
              <Route path="/super-admin/dashboard" element={<Layout><SuperAdminDashboard /></Layout>} />
              <Route path="/super-admin/users" element={<Layout><UserManagement /></Layout>} />
              <Route path="/super-admin/dealers" element={<Layout><DealerManagement /></Layout>} />
            </Route>

            <Route element={<ProtectedRoute roles={["dealer_admin", "dealer_user", "branch_admin"]} />}>
              <Route path="/dealer/dashboard" element={<Layout><DealerDashboard /></Layout>} />
              <Route path="/dealer/new" element={<Layout><NewAnalysis /></Layout>} />
              <Route path="/dealer/bulk" element={<Layout><BulkUpload /></Layout>} />
              <Route path="/dealer/results" element={<Layout><Results /></Layout>} />
              <Route path="/dealer/users" element={<Layout><DealerUsers /></Layout>} />
              <Route path="/support" element={<Layout><SupportPage /></Layout>} />
            </Route>

            <Route element={<ProtectedRoute roles={["super_admin", "dealer_admin", "dealer_user", "branch_admin"]} />}>
              <Route path="/account/profile" element={<Layout><AccountProfile /></Layout>} />
              <Route path="/account/password" element={<Layout><ChangePassword /></Layout>} />
            </Route>



            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </TaskProvider>
      </ThemeSettingsProvider>
    </AuthProvider>
  );
}


