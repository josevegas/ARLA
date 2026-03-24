import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NeumorphicButton } from './NeumorphicButton';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: any) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-cafe-bg text-deep-green font-sans p-4 md:p-8 transition-colors duration-500">
      <header className="max-w-7xl mx-auto mb-12 flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0 border-b border-deep-green/10 pb-8">
        <div className="cursor-pointer group text-center lg:text-left" onClick={() => onViewChange('home')}>
          <h1 className="text-5xl font-black text-deep-green tracking-tighter group-hover:text-forest-green transition-colors leading-none font-lora">ARLA</h1>
          <p className="text-[10px] uppercase tracking-[0.5em] text-forest-green font-black mt-2">CAFÉ Y JUEGOS DE MESA</p>
        </div>
        
        <nav className="flex flex-wrap justify-center items-center gap-4">
          <NeumorphicButton 
            variant={activeView === 'home' ? 'pressed' : 'flat'}
            onClick={() => onViewChange('home')}
            className={`text-xs font-bold uppercase tracking-widest ${activeView === 'home' ? 'text-forest-green' : 'text-deep-green/70'}`}
          >
            Inicio
          </NeumorphicButton>

          <NeumorphicButton 
            variant={activeView === 'catalog' ? 'pressed' : 'flat'}
            onClick={() => onViewChange('catalog')}
            className={`text-xs font-bold uppercase tracking-widest ${activeView === 'catalog' ? 'text-forest-green' : 'text-deep-green/70'}`}
          >
            Juegos
          </NeumorphicButton>

          <NeumorphicButton 
            variant={activeView === 'menu' ? 'pressed' : 'flat'}
            onClick={() => onViewChange('menu')}
            className={`text-xs font-bold uppercase tracking-widest ${activeView === 'menu' ? 'text-forest-green' : 'text-deep-green/70'}`}
          >
            Menú
          </NeumorphicButton>
          
          {user ? (
            <>
              <NeumorphicButton 
                variant={activeView === 'profile' ? 'pressed' : 'flat'}
                onClick={() => onViewChange('profile')}
                className={`text-xs font-bold uppercase tracking-widest ${activeView === 'profile' ? 'text-forest-green' : 'text-deep-green/70'}`}
              >
                Perfil
              </NeumorphicButton>

              {(user.role === 'ADMIN' || user.role === 'SUPERADMIN') && (
                <NeumorphicButton 
                  variant={activeView === 'admin' ? 'pressed' : 'flat'}
                  onClick={() => onViewChange('admin')}
                  className={`text-xs font-bold uppercase tracking-widest ${activeView === 'admin' ? 'text-deep-green' : 'text-deep-green/70'}`}
                >
                  Admin
                </NeumorphicButton>
              )}
              
              <NeumorphicButton 
                variant="flat" 
                onClick={logout}
                className="text-xs font-bold uppercase tracking-widest text-terracotta"
              >
                Salir
              </NeumorphicButton>
            </>
          ) : (
            <>
              <NeumorphicButton 
                variant={activeView === 'login' ? 'pressed' : 'flat'}
                onClick={() => onViewChange('login')}
                className={`text-xs font-bold uppercase tracking-widest ${activeView === 'login' ? 'text-forest-green' : 'text-deep-green/70'}`}
              >
                Ingresar
              </NeumorphicButton>
            </>
          )}
        </nav>
      </header>
      
      <main className="max-w-7xl mx-auto pb-20">
        {children}
      </main>
      
      <footer className="mt-auto py-12 text-center text-forest-green/40 text-[10px] uppercase tracking-[0.4em] font-bold">
        <div className="w-16 h-1 bg-forest-green/10 mx-auto mb-6 rounded-full"></div>
        ARLA Café Ludoteca • Diseño Neumórfico Premium
      </footer>
    </div>
  );
};
