import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NeumorphicButton } from './NeumorphicButton';
import { LogOut, User, LogIn } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-cafe-bg text-deep-green font-sans p-4 md:p-8 flex flex-col transition-colors duration-500">
      <header className="max-w-7xl mx-auto w-full mb-12 flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0 border-b border-deep-green/10 pb-8">
        <Link to="/" className="cursor-pointer group text-center lg:text-left">
          <h1 className="text-5xl font-black text-deep-green tracking-tighter group-hover:text-forest-green transition-colors leading-none font-lora">ARLA</h1>
          <p className="text-[10px] uppercase tracking-[0.5em] text-forest-green font-black mt-2">CAFÉ Y JUEGOS DE MESA</p>
        </Link>
        
        <nav className="flex flex-wrap justify-center items-center gap-2">
          <Link to="/">
            <NeumorphicButton 
              variant={isActive('/') ? 'pressed' : 'flat'}
              className={`text-[9px] font-black uppercase tracking-widest px-5 h-10 ${isActive('/') ? 'text-forest-green' : 'text-deep-green/60'}`}
            >
              Inicio
            </NeumorphicButton>
          </Link>

          <Link to="/ludoteca">
            <NeumorphicButton 
              variant={isActive('/ludoteca') ? 'pressed' : 'flat'}
              className={`text-[9px] font-black uppercase tracking-widest px-5 h-10 ${isActive('/ludoteca') ? 'text-forest-green' : 'text-deep-green/60'}`}
            >
              Juegos
            </NeumorphicButton>
          </Link>

          <Link to="/menu">
            <NeumorphicButton 
              variant={isActive('/menu') ? 'pressed' : 'flat'}
              className={`text-[9px] font-black uppercase tracking-widest px-5 h-10 ${isActive('/menu') ? 'text-forest-green' : 'text-deep-green/60'}`}
            >
              Menú
            </NeumorphicButton>
          </Link>
          
          {user ? (
            <>
              <Link to="/reserva">
                <NeumorphicButton 
                  variant={isActive('/reserva') ? 'pressed' : 'flat'}
                  className={`text-[9px] font-black uppercase tracking-widest px-5 h-10 ${isActive('/reserva') ? 'text-forest-green' : 'text-deep-green/60'}`}
                >
                  Reserva
                </NeumorphicButton>
              </Link>

              <Link to="/perfil">
                <NeumorphicButton 
                  variant={isActive('/perfil') ? 'pressed' : 'flat'}
                  className={`text-[9px] font-black uppercase tracking-widest px-5 h-10 ${isActive('/perfil') ? 'text-forest-green' : 'text-deep-green/60'}`}
                >
                  <User size={14} className="mr-2" /> Cuenta
                </NeumorphicButton>
              </Link>

              {user && (user.role === 'ADMIN' || user.role === 'SUPERADMIN' || String(user.role).toUpperCase() === 'ADMIN' || String(user.role).toUpperCase() === 'SUPERADMIN') && (
                <div className="flex gap-1 p-1 rounded-full bg-deep-green/5 shadow-neu-pressed">
                   <Link to="/admin">
                    <NeumorphicButton 
                      variant={isActive('/admin') ? 'pressed' : 'flat'}
                      className={`text-[9px] font-black uppercase tracking-widest px-5 h-8 border-none ${isActive('/admin') ? 'text-deep-green' : 'text-deep-green/40'}`}
                    >
                      Admin
                    </NeumorphicButton>
                  </Link>
                  <Link to="/admin/reservas">
                    <NeumorphicButton 
                      variant={isActive('/admin/reservas') ? 'pressed' : 'flat'}
                      className={`text-[9px] font-black uppercase tracking-widest px-5 h-8 border-none ${isActive('/admin/reservas') ? 'text-deep-green' : 'text-deep-green/40'}`}
                    >
                      Reservas
                    </NeumorphicButton>
                  </Link>
                </div>
              )}
              
              <NeumorphicButton 
                variant="flat" 
                onClick={handleLogout}
                className="text-[9px] font-black uppercase tracking-widest px-5 h-10 text-terracotta flex items-center gap-2"
              >
                <LogOut size={14} /> Salir
              </NeumorphicButton>
            </>
          ) : (
            <>
              <Link to="/login">
                <NeumorphicButton 
                  variant={isActive('/login') ? 'pressed' : 'flat'}
                  className={`text-[9px] font-black uppercase tracking-widest px-5 h-10 flex items-center gap-2 ${isActive('/login') ? 'text-forest-green' : 'text-deep-green/60'}`}
                >
                  <LogIn size={14} /> Ingresar
                </NeumorphicButton>
              </Link>
            </>
          )}
        </nav>
      </header>
      
      <main className="max-w-7xl mx-auto w-full flex-1">
        {children}
      </main>
      
      <footer className="mt-20 py-12 text-center text-forest-green/40 text-[10px] uppercase tracking-[0.4em] font-bold">
        <div className="w-16 h-1 bg-forest-green/10 mx-auto mb-6 rounded-full"></div>
        ARLA Café Ludoteca • {new Date().getFullYear()} • Premium Neumorphic Design
      </footer>
    </div>
  );
};
