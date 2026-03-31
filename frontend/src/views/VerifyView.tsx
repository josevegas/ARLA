import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';

export const VerifyView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setToken } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const email = location.state?.email || '';

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:3000/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      // Auto login
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      setSuccess('¡Cuenta verificada! Redirigiendo...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:3000/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess('Se ha enviado un nuevo código a tu correo.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4 animate-in fade-in duration-700">
      <NeumorphicCard className="w-full max-w-md p-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-deep-green font-lora">Verifica tu Cuenta</h2>
          <p className="text-forest-green font-medium mt-2">Hemos enviado un código a su correo: <b>{email}</b></p>
        </div>

        <form onSubmit={handleVerify} className="space-y-8">
          <input 
            type="text" 
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={e => setCode(e.target.value)}
            className="w-full text-5xl font-black text-center tracking-[0.5em] py-6 rounded-cafe bg-cafe-bg shadow-neu-pressed border-none outline-none text-deep-green placeholder:text-deep-green/10"
          />

          {error && <p className="text-center text-terracotta font-bold text-sm animate-pulse">{error}</p>}
          {success && <p className="text-center text-forest-green font-bold text-sm italic">{success}</p>}

          <div className="space-y-4">
            <NeumorphicButton type="submit" className="w-full py-4 bg-forest-green text-white font-black uppercase tracking-widest text-xs">
              Confirmar Código
            </NeumorphicButton>
            <NeumorphicButton 
              type="button" 
              variant="flat" 
              onClick={handleResend}
              className="w-full py-4 text-deep-green/50 font-black uppercase tracking-widest text-[10px]"
            >
              Reenviar código
            </NeumorphicButton>
          </div>
        </form>

        <p className="mt-8 text-center text-[10px] text-forest-green/40 font-bold uppercase tracking-widest cursor-pointer hover:underline" onClick={() => navigate('/login')}>
          ¿Ya verificaste? Ingresa aquí
        </p>
      </NeumorphicCard>
    </div>
  );
};
