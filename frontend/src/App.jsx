import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Root application component with routing and context providers.
 */
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1A1D27',
                color: '#F1F5F9',
                border: '1px solid #2D3148',
                borderRadius: '12px',
                fontSize: '14px',
                fontFamily: 'Inter, system-ui, sans-serif',
                padding: '12px 16px',
                maxWidth: '380px',
              },
              success: {
                iconTheme: { primary: '#10B981', secondary: '#1A1D27' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: '#1A1D27' },
              },
            }}
          />

          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
            </Route>

            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
