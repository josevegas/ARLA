import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { NeumorphicCard } from './components/NeumorphicCard';
import { NeumorphicButton } from './components/NeumorphicButton';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginView } from './views/LoginView';
import { UserHistoryView } from './views/UserHistoryView';
import { AdminManagementView } from './views/AdminManagementView';
import { RegisterView } from './views/RegisterView';
import { ProfileView } from './views/ProfileView';
import { GameCatalogView } from './views/GameCatalogView';
import { MenuView } from './views/MenuView';

type ViewType = 'dashboard' | 'history' | 'admin' | 'login' | 'register' | 'profile' | 'catalog' | 'menu';

const Dashboard: React.FC<{ onViewChange: (view: ViewType) => void }> = ({ onViewChange }) => {
  return (
    <div className="space-y-24">
      <section className="text-center py-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-forest-green/5 rounded-full blur-3xl -z-10"></div>
        <h2 className="text-8xl font-black text-deep-green mb-8 tracking-tighter leading-none font-lora">ARLA</h2>
        <p className="text-2xl text-forest-green max-w-2xl mx-auto font-medium leading-relaxed italic">
          "Donde la estrategia se encuentra con el aroma del mejor café."
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {[
          { icon: '🎲', title: 'Ludoteca', bTitle: 'Explorar Juegos', view: 'catalog' },
          { icon: '☕', title: 'Menú', bTitle: 'Ver Carta', view: 'menu' },
          { icon: '📅', title: 'Reservas', bTitle: 'Mesa & Juego', view: 'dashboard' },
          { icon: '🏆', title: 'Comunidad', bTitle: 'Tu Perfil', view: 'profile' },
        ].map((item, idx) => (
          <NeumorphicCard key={idx} className="flex flex-col items-center text-center p-10 group transition-all duration-500 hover:scale-105">
            <div className="text-5xl mb-8 shadow-neu-pressed w-24 h-24 rounded-cafe flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 bg-cafe-bg">
              {item.icon}
            </div>
            <h3 className="text-2xl font-black text-deep-green mb-8 whitespace-nowrap">{item.title}</h3>
            <NeumorphicButton 
              variant="flat" 
              className="text-[10px] uppercase font-black tracking-widest w-full py-4 border border-deep-green/5"
              onClick={() => onViewChange(item.view as ViewType)}
            >
              {item.bTitle}
            </NeumorphicButton>
          </NeumorphicCard>
        ))}
      </div>

      <section className="relative overflow-hidden rounded-cafe p-16 shadow-neu-pressed border border-white/20 bg-cafe-surface/10">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-terracotta/5 rounded-full blur-3xl"></div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl font-black text-deep-green mb-4 leading-tight">¿Listo para jugar?</h2>
            <p className="text-forest-green text-xl font-medium max-w-xl">
              Regístrate ahora y obtén <span className="text-terracotta font-black">500 puntos</span> de bienvenida para tus primeras partidas.
            </p>
          </div>
          <NeumorphicButton 
            className="bg-terracotta text-cafe-surface px-16 py-6 text-xl font-black uppercase tracking-widest shadow-neu-flat border-none transition-all hover:scale-105 active:scale-95"
            onClick={() => onViewChange('register')}
          >
            ¡Únete a la Mesa!
          </NeumorphicButton>
        </div>
      </section>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      {activeView === 'dashboard' && <Dashboard onViewChange={setActiveView} />}
      {activeView === 'login' && <LoginView onSuccess={() => setActiveView('profile')} />}
      {activeView === 'register' && <RegisterView onSuccess={() => setActiveView('profile')} />}
      {activeView === 'profile' && (user ? <ProfileView /> : <LoginView onSuccess={() => setActiveView('profile')} />)}
      {activeView === 'catalog' && <GameCatalogView />}
      {activeView === 'menu' && <MenuView />}
      {activeView === 'history' && (user ? <UserHistoryView /> : <LoginView onSuccess={() => setActiveView('dashboard')} />)}
      {activeView === 'admin' && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN' ? <AdminManagementView /> : <Dashboard onViewChange={setActiveView} />)}
    </Layout>
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