import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';
import logoArla from '../image/logo_arla.jpg';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      if (err.message.includes('not verified')) {
        setError('Tu cuenta no está verificada.');
        return;
      }
      setError(err.message || 'Credenciales inválidas');
    }
  };

  const inputStyles = "w-full px-4 py-3 rounded-cafe bg-cafe-bg shadow-neu-pressed border-none focus:ring-2 focus:ring-forest-green/30 outline-none text-deep-green transition-all duration-300";

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <NeumorphicCard className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-6 shadow-neu-pressed p-1 bg-cafe-bg">
            <img src={logoArla} alt="ARLA Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <h2 className="text-4xl font-black text-deep-green tracking-tight italic font-lora">Bienvenido</h2>
          <p className="text-forest-green font-medium mt-2">CAFÉ Y JUEGOS DE MESA</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Tu Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputStyles}
              placeholder="admin@arla.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputStyles}
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && (
            <div className="bg-terracotta/10 text-terracotta p-4 rounded-cafe text-center font-bold text-sm">
              {error}
            </div>
          )}
          
          <NeumorphicButton type="submit" className="w-full py-4 text-xl mt-4 bg-forest-green text-cafe-surface">
            Ingresar
          </NeumorphicButton>
        </form>

        <div className="mt-8 pt-8 border-t border-deep-green/5 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-deep-green/50 mb-4">¿No tienes cuenta?</p>
          <NeumorphicButton 
            onClick={() => navigate('/register')}
            variant="flat"
            className="w-full py-4 text-forest-green font-bold"
          >
            Registrarse ahora
          </NeumorphicButton>
        </div>
      </NeumorphicCard>
    </div>
  );
};
