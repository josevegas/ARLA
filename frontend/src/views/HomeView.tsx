import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, Gamepad2, Utensils, Calendar, User, ArrowRight } from 'lucide-react';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  imageUrl?: string;
}

interface ActiveReservation {
  id: string;
  date: string;
  time: string;
  playerNames: string[];
  table: { description: string };
  games: { id: string; name: string }[];
  aggregatedData: {
    allPlayerNames: string[];
    allGames: string[];
  };
}

export const HomeView: React.FC = () => {
  const { user, token } = useAuth();
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [currentPromoIdx, setCurrentPromoIdx] = useState(0);
  const [activeReservations, setActiveReservations] = useState<ActiveReservation[]>([]);

  useEffect(() => {
    // Public promotions
    fetch('http://localhost:3000/api/promociones')
      .then(res => res.json())
      .then(data => setPromos(data.filter((p: any) => p.active)))
      .catch(console.error);

    if (user && token) {
      // User active reservations (we can reuse the endpoint but maybe we want multiple?)
      // Current getActiveReservation returns findFirst. 
      // Requirement says "mostrar las reservas activas" (plural).
      // I'll assume for now we list the primary one or I should update the endpoint to return plural.
      // Let's stick with the one we have or I'll update the backend to return plural if I can.
      // Actually, my backend getActiveReservation returns findFirst. I'll update it to findMany.
      fetch(`http://localhost:3000/api/reservations/active/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        console.log('[HomeView] Active reservations data:', data);
        if (data) {
          const resArray = Array.isArray(data) ? data : (data.id ? [data] : []);
          setActiveReservations(resArray);
        }
      })
      .catch(err => {
        console.error('[HomeView] Fetch reservations error:', err);
      });
    }
  }, [user, token]);

  // Auto-carousel
  useEffect(() => {
    if (promos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentPromoIdx(p => (p + 1) % promos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promos]);

  return (
    <div className="space-y-16 pb-20">
      {/* Header / Hero */}
      <section className="text-center py-10 relative">
        <h1 className="text-7xl font-black text-deep-green tracking-tighter font-lora mb-4">ARLA</h1>
        <p className="text-forest-green uppercase tracking-[0.4em] text-xs font-black">Café Ludoteca & Comunidad</p>
      </section>

      {/* Promotions Carousel */}
      {promos.length > 0 && (
        <section className="max-w-5xl mx-auto px-4">
          <NeumorphicCard className="relative overflow-hidden group min-h-[300px] flex items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-cafe-surface to-transparent z-10"></div>
            
            {promos.map((promo, idx) => (
              <div key={promo.id} className={`absolute inset-0 transition-opacity duration-1000 flex items-center p-8 md:p-16 ${idx === currentPromoIdx ? 'opacity-100 z-20' : 'opacity-0 z-0'}`}>
                <div className="max-w-md space-y-4">
                  <span className="bg-terracotta text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Promoción Activa</span>
                  <h2 className="text-4xl font-black text-deep-green font-lora">{promo.title}</h2>
                  <p className="text-forest-green font-medium">{promo.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-black text-terracotta">{promo.discount}% OFF</span>
                    <Link to="/menu">
                       <NeumorphicButton variant="flat" className="text-[10px] font-black uppercase tracking-widest px-6 py-3">Ver Menú</NeumorphicButton>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Controls */}
            {promos.length > 1 && (
              <>
                <button 
                  onClick={() => setCurrentPromoIdx(p => (p - 1 + promos.length) % promos.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors shadow-sm"
                >
                  <ChevronLeft className="text-deep-green" />
                </button>
                <button 
                  onClick={() => setCurrentPromoIdx(p => (p + 1) % promos.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors shadow-sm"
                >
                  <ChevronRight className="text-deep-green" />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                  {promos.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentPromoIdx ? 'w-8 bg-terracotta' : 'bg-deep-green/20'}`}></div>
                  ))}
                </div>
              </>
            )}
          </NeumorphicCard>
        </section>
      )}

      {/* Main Options Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-4 text-center">
        {[
          { to: '/ludoteca', icon: <Gamepad2 />, label: 'Ludoteca' },
          { to: '/menu', icon: <Utensils />, label: 'Menú' },
          { to: '/reserva', icon: <Calendar />, label: 'Reserva' },
          { to: '/perfil', icon: <User />, label: 'Perfil' },
        ].map(item => (
          <Link key={item.to} to={item.to} className="group">
            <NeumorphicCard className="p-8 group-hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 rounded-cafe bg-cafe-bg shadow-neu-pressed flex items-center justify-center mx-auto mb-4 text-forest-green group-hover:text-terracotta transition-colors">
                {item.icon}
              </div>
              <p className="font-black text-deep-green text-sm uppercase tracking-widest">{item.label}</p>
            </NeumorphicCard>
          </Link>
        ))}
      </section>

      {/* Active Reservations Section */}
      {user && (
        <section className="max-w-4xl mx-auto px-4 space-y-8">
           <div className="flex items-center justify-between pl-4">
              <h3 className="text-2xl font-black text-deep-green font-lora">Tus Reservas Activas</h3>
              {!activeReservations.length && <span className="text-[10px] font-black uppercase tracking-widest text-deep-green/30">Sin reservas próximas</span>}
           </div>

           {activeReservations.length > 0 ? (
             <div className="grid gap-6">
                {activeReservations.map(res => (
                  <NeumorphicCard key={res.id} className="p-8 border-l-8 border-forest-green flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-deep-green/40 mb-1">Mesa Reservada</p>
                      <h4 className="text-2xl font-black text-deep-green">{res.table.description}</h4>
                      <p className="text-sm font-bold text-forest-green mt-2">📅 {new Date(res.date).toLocaleDateString()} — {res.time}</p>
                    </div>

                    <div className="flex-1 space-y-4">
                       <div>
                          <p className="text-[10px] font-black uppercase text-deep-green/30 mb-2">Comunidad en tu Mesa (Todos los Jugadores)</p>
                          <div className="flex flex-wrap gap-2">
                             {res.aggregatedData.allPlayerNames.map((n, i) => (
                               <span key={i} className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border ${res.playerNames.includes(n) ? 'bg-forest-green/10 text-forest-green border-forest-green/20' : 'bg-white/50 border-white/20 opacity-60'}`}>
                                  👤 {n}
                               </span>
                             ))}
                          </div>
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-deep-green/30 mb-2">Juegos en la Mesa</p>
                          <div className="flex flex-wrap gap-2">
                             {res.aggregatedData.allGames.length > 0 ? res.aggregatedData.allGames.map(g => (
                               <span key={g} className="px-3 py-1 bg-terracotta/5 text-terracotta rounded-full text-[10px] font-black border border-terracotta/10">🎲 {g}</span>
                             )) : <span className="text-[10px] italic text-deep-green/20">Sin juegos seleccionados</span>}
                          </div>
                       </div>
                    </div>

                    <Link to="/reserva">
                      <NeumorphicButton variant="flat" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-6 py-4">
                        Gestionar <ArrowRight size={14} />
                      </NeumorphicButton>
                    </Link>
                  </NeumorphicCard>
                ))}
             </div>
           ) : (
             <NeumorphicCard className="p-12 text-center bg-cafe-bg shadow-neu-pressed">
                <p className="text-forest-green font-black uppercase tracking-widest text-xs mb-8">No tienes reservas planeadas</p>
                <Link to="/reserva">
                  <NeumorphicButton variant="pressed" className="px-12 py-4 bg-forest-green text-white font-black uppercase tracking-widest text-xs">Reservar Mesa</NeumorphicButton>
                </Link>
             </NeumorphicCard>
           )}
        </section>
      )}
    </div>
  );
};
