import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { User, Trophy, Calendar, MapPin, Mail, Phone, Cake } from 'lucide-react';

interface Visit {
  id: string;
  date: string;
}

interface ProfileData {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  birthday?: string;
  points: number;
  visitHistory: Visit[];
}

export const ProfileView: React.FC = () => {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) return <div className="text-center py-20 animate-pulse text-forest-green">Cargando perfil...</div>;
  if (!profile) return <div className="text-center py-20 text-terracotta font-black">Error al cargar perfil.</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
         <div className="w-48 h-48 rounded-[3rem] bg-cafe-bg shadow-neu-pressed flex items-center justify-center border-4 border-white/20 relative group">
            <User size={80} className="text-deep-green/20 group-hover:text-forest-green transition-colors" />
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-forest-green text-white rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-cafe-bg">
               <span className="text-xs font-black">NIVEL</span>
               <span className="text-xl font-black">1</span>
            </div>
         </div>
         
         <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-5xl font-black text-deep-green font-lora">{profile.name} {profile.lastName}</h1>
              <p className="text-forest-green font-black uppercase tracking-[0.4em] text-[10px] mt-1 italic">Coleccionista de Aventuras</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="flex items-center gap-3 text-deep-green/60">
                  <Mail size={16} /> <span className="text-sm font-medium">{profile.email}</span>
               </div>
               {profile.phone && (
                 <div className="flex items-center gap-3 text-deep-green/60">
                    <Phone size={16} /> <span className="text-sm font-medium">{profile.phone}</span>
                 </div>
               )}
               {profile.birthday && (
                 <div className="flex items-center gap-3 text-deep-green/60">
                    <Cake size={16} /> <span className="text-sm font-medium">Cumpleaños: {profile.birthday}</span>
                 </div>
               )}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <NeumorphicCard className="col-span-1 p-8 bg-forest-green text-white border-none flex flex-col items-center justify-center space-y-4 shadow-2xl">
            <Trophy size={48} strokeWidth={2.5} />
            <div className="text-center">
               <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Puntos Acumulados</span>
               <h4 className="text-5xl font-black font-lora mt-2">{profile.points}</h4>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-tighter text-white/40">Suma 10 puntos por cada reserva</p>
         </NeumorphicCard>

         <NeumorphicCard className="col-span-1 md:col-span-2 p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-deep-green/40 flex items-center gap-2">
               <Calendar size={14} /> Historial de Visitas (Últimas 10)
            </h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
               {profile.visitHistory.length > 0 ? profile.visitHistory.map(visit => (
                 <div key={visit.id} className="flex justify-between items-center bg-cafe-bg shadow-neu-pressed px-6 py-4 rounded-full border border-white/20 group hover:scale-[1.02] transition-transform">
                    <div className="flex items-center gap-4">
                       <MapPin size={14} className="text-terracotta" />
                       <span className="text-sm font-black text-deep-green">Visita en ARLA</span>
                    </div>
                    <span className="text-[10px] font-black text-forest-green uppercase bg-white px-3 py-1 rounded-full shadow-sm">
                       {new Date(visit.date).toLocaleDateString()}
                    </span>
                 </div>
               )) : (
                 <div className="text-center py-10 opacity-20">
                    <p className="text-xs font-black uppercase">Aún no tienes visitas registradas</p>
                 </div>
               )}
            </div>
         </NeumorphicCard>
      </div>

      <div className="flex justify-center pt-8">
         <NeumorphicButton onClick={logout} variant="pressed" className="px-12 py-5 bg-terracotta text-white font-black uppercase tracking-widest text-sm shadow-neu-flat border-none hover:scale-105 transition-transform">
            Cerrar Sesión Segura
         </NeumorphicButton>
      </div>
    </div>
  );
};
