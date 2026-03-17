import React, { useState } from 'react';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { useAuth } from '../context/AuthContext';

export const RegisterView: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { register } = useAuth();
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
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        lastName: formData.lastName,
        phone: formData.phone,
        birthday: formData.birthday
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    }
  };

  const inputStyles = "w-full px-4 py-3 rounded-cafe bg-cafe-bg shadow-neu-pressed border-none focus:ring-2 focus:ring-forest-green/30 outline-none text-deep-green transition-all duration-300";

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <NeumorphicCard className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-deep-green tracking-tight">Crea tu Cuenta</h2>
          <p className="text-forest-green font-medium mt-2">Únete a la comunidad de ARLA</p>
        </div>

        {error && (
          <div className="bg-terracotta/10 text-terracotta p-4 rounded-cafe mb-6 text-center font-bold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Nombres</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputStyles}
                placeholder="Ej. Juan"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Apellidos</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={inputStyles}
                placeholder="Ej. Pérez"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Email</label>
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
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Celular</label>
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
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Cumpleaños (DD/MM)</label>
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
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Contraseña</label>
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
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Confirmar</label>
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
          
          <NeumorphicButton type="submit" className="w-full py-4 text-lg mt-4 bg-forest-green text-cafe-surface">
            Registrarme
          </NeumorphicButton>
        </form>
      </NeumorphicCard>
    </div>
  );
};
