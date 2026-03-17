import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';

export const ProfileView: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Perfil Header */}
        <div className="lg:col-span-1 space-y-8">
          <NeumorphicCard className="flex flex-col items-center">
            <div className="w-40 h-40 rounded-full bg-cafe-bg shadow-neu-pressed flex items-center justify-center mb-6 border-8 border-cafe-surface">
              <span className="text-6xl font-black text-forest-green">{user.name?.charAt(0) || 'U'}</span>
            </div>
            <h2 className="text-3xl font-black text-deep-green text-center leading-tight font-lora">
              {user.name} <br/> {user.lastName}
            </h2>
            <p className="text-forest-green font-bold uppercase tracking-widest text-xs mt-4 py-1 px-4 bg-forest-green/10 rounded-full">
              {user.role}
            </p>
            
            <div className="w-full h-px bg-deep-green/5 my-8"></div>
            
            <div className="w-full space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-deep-green/40 ml-2">Email</p>
                <div className="bg-cafe-bg shadow-neu-pressed rounded-xl px-4 py-2 text-deep-green font-semibold">
                  {user.email}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-deep-green/40 ml-2">Celular</p>
                <div className="bg-cafe-bg shadow-neu-pressed rounded-xl px-4 py-2 text-deep-green font-semibold">
                  {user.phone || 'No registrado'}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-deep-green/40 ml-2">Cumpleaños</p>
                <div className="bg-cafe-bg shadow-neu-pressed rounded-xl px-4 py-2 text-deep-green font-semibold">
                  {user.birthday || 'No registrado'}
                </div>
              </div>
            </div>

            <NeumorphicButton className="w-full mt-10 text-sm font-bold uppercase tracking-widest py-4 border border-deep-green/5">
              Editar Perfil
            </NeumorphicButton>
          </NeumorphicCard>
        </div>

        {/* Stats and Activity */}
        <div className="lg:col-span-2 space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <NeumorphicCard className="text-center bg-forest-green text-cafe-surface shadow-neu-flat border-none">
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Nivel</p>
              <p className="text-5xl font-black italic">14</p>
            </NeumorphicCard>
            <NeumorphicCard className="text-center border border-forest-green/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-forest-green mb-2">Partidas</p>
              <p className="text-5xl font-black text-deep-green">42</p>
            </NeumorphicCard>
            <NeumorphicCard className="text-center border border-forest-green/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-forest-green mb-2">Puntos</p>
              <p className="text-5xl font-black text-deep-green">1.2k</p>
            </NeumorphicCard>
          </div>

          <NeumorphicCard className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-forest-green/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h3 className="text-2xl font-black text-deep-green mb-8 flex items-center font-lora">
              <span className="w-2 h-8 bg-forest-green rounded-full mr-4 inline-block"></span>
              Historial de Partidas
            </h3>
            
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center p-6 bg-cafe-bg/40 rounded-cafe shadow-neu-pressed border border-white/10 group hover:bg-cafe-bg/60 transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-cafe-surface shadow-neu-flat flex items-center justify-center text-3xl mb-4 sm:mb-0 sm:mr-6">
                    🎲
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-deep-green text-lg">Catan: Edición Especial</h4>
                    <p className="text-xs text-forest-green font-bold uppercase tracking-widest mt-1">Estrategia • 90 min</p>
                  </div>
                  <div className="text-left sm:text-right mt-4 sm:mt-0">
                    <p className="text-xs font-black text-deep-green/40 mb-1">Última vez played</p>
                    <p className="text-sm font-bold text-deep-green">Hace {i * 2} días</p>
                  </div>
                </div>
              ))}
            </div>
            
            <NeumorphicButton variant="pressed" className="w-full mt-10 text-xs font-black uppercase tracking-widest text-forest-green py-3 border border-forest-green/20">
              Ver Catálogo Completo
            </NeumorphicButton>
          </NeumorphicCard>
        </div>
      </div>
    </div>
  );
};
