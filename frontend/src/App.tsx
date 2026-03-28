import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginView } from './views/LoginView';
import { UserHistoryView } from './views/UserHistoryView';
import { AdminManagementView } from './views/AdminManagementView';
import { RegisterView } from './views/RegisterView';
import { ProfileView } from './views/ProfileView';
import { GameCatalogView } from './views/GameCatalogView';
import { MenuView } from './views/MenuView';
import { ReservationView } from './views/ReservationView';
import { HomeView } from './views/HomeView';
import { AdminReservationsView } from './views/AdminReservationsView';
import { VerifyView } from './views/VerifyView';

const ProtectedRoute: React.FC<{ children: React.ReactNode, roles?: string[] }> = ({ children, roles }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/verify" element={<VerifyView />} />
          <Route path="/ludoteca" element={<GameCatalogView />} />
          <Route path="/menu" element={<MenuView />} />
          <Route path="/reserva" element={<ReservationView />} />
          
          {/* Protected Routes */}
          <Route path="/perfil" element={
            <ProtectedRoute>
              <ProfileView />
            </ProtectedRoute>
          } />
          <Route path="/historial" element={
            <ProtectedRoute>
              <UserHistoryView />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN', 'SUPERADMIN']}>
              <AdminManagementView />
            </ProtectedRoute>
          } />
          <Route path="/admin/reservas" element={
            <ProtectedRoute roles={['ADMIN', 'SUPERADMIN']}>
              <AdminReservationsView />
            </ProtectedRoute>
          } />

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;