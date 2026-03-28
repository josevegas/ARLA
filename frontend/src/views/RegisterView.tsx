import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';

export const RegisterView: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    birthday: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          lastName: formData.lastName,
          phone: formData.phone,
          birthday: formData.birthday
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      navigate('/verify', { state: { email: formData.email } });
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    }
  };

  const inputStyles = "w-full px-4 py-3 rounded-cafe bg-cafe-bg shadow-neu-pressed border-none focus:ring-2 focus:ring-forest-green/30 outline-none text-deep-green transition-all duration-300 font-medium placeholder:text-deep-green/30";

  return (
    <div className="flex items-center justify-center py-12 px-4 min-h-[80vh]">
      <NeumorphicCard className="w-full max-w-2xl px-6 md:px-12 py-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-deep-green tracking-tight font-lora">Crea tu Cuenta</h2>
          <p className="text-forest-green font-medium mt-2">Únete a la comunidad de ARLA</p>
        </div>

        {error && (
          <div className="bg-terracotta/10 text-terracotta p-4 rounded-cafe mb-8 text-center font-bold text-sm shadow-sm animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-deep-green/40 ml-4">Nombres</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputStyles}
                placeholder="Juan"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-deep-green/40 ml-4">Apellidos</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={inputStyles}
                placeholder="Pérez"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-deep-green/40 ml-4">Email Corporativo / Personal</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputStyles}
                placeholder="juan@ejemplo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-deep-green/40 ml-4">Celular</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputStyles}
                placeholder="987 654 321"
                required
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-deep-green/40 ml-4">Cumpleaños (Día / Mes)</label>
              <input 
                type="text" 
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className={inputStyles}
                placeholder="Ej. 15/08"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-deep-green/40 ml-4">Contraseña Segura</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={inputStyles}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-deep-green/40 ml-4">Confirmar Contraseña</label>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputStyles}
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <div className="pt-6">
            <NeumorphicButton type="submit" className="w-full py-5 text-lg bg-forest-green text-cafe-surface font-black uppercase tracking-widest shadow-neu-flat border-none transition-transform active:scale-95">
              Finalizar Registro
            </NeumorphicButton>
          </div>

          <p className="text-center text-[10px] text-forest-green/40 font-bold uppercase tracking-widest cursor-pointer hover:text-forest-green transition-colors" onClick={() => navigate('/login')}>
            Ya tengo una cuenta • Iniciar Sesión
          </p>
        </form>
      </NeumorphicCard>
    </div>
  );
};
