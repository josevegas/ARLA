import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';

interface LoginViewProps {
  onSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas');
    }
  };

  const inputStyles = "w-full px-4 py-3 rounded-cafe bg-cafe-bg shadow-neu-pressed border-none focus:ring-2 focus:ring-forest-green/30 outline-none text-deep-green transition-all duration-300";

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <NeumorphicCard className="w-full max-w-md">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-deep-green tracking-tight italic">Bienvenido</h2>
          <p className="text-forest-green font-medium mt-2">Accede a tu cuenta de ARLA</p>
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
        
        <p className="mt-10 text-center text-sm text-forest-green font-medium">
          ¿Problemas para acceder? <br/>
          <span className="text-terracotta cursor-pointer hover:underline">Contacta a soporte</span>
        </p>
      </NeumorphicCard>
    </div>
  );
};
