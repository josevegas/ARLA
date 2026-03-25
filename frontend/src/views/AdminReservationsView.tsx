import React, { useState, useEffect } from 'react';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock, XCircle, Calendar as CalendarIcon, Users, Filter, Hash } from 'lucide-react';

interface TableWithReservations {
  id: string;
  description: string;
  capacity: number;
  reservations: Reservation[];
}

interface Reservation {
  id: string;
  date: string;
  time: string;
  peopleCount: number;
  playerNames: string[];
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  shareTable: boolean;
  games: { name: string }[];
  user?: { name: string; email: string };
  tableId: string;
}

export const AdminReservationsView: React.FC = () => {
  const { token } = useAuth();
  const [data, setData] = useState<TableWithReservations[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED'>('ALL');
  const [tableFilter, setTableFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/admin/reservations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [token]);

  const handleUpdateStatus = async (resId: string, status: string) => {
     try {
        const res = await fetch(`http://localhost:3000/api/admin/reservations/${resId}/status`, {
           method: 'POST',
           headers: { 
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${token}` 
           },
           body: JSON.stringify({ status })
        });
        if (res.ok) fetchReservations();
     } catch (err) {
        console.error(err);
     }
  };

  const filteredTables = data.filter(t => tableFilter === 'ALL' || t.id === tableFilter);

  if (loading) return <div className="text-center py-20 text-forest-green animate-pulse">Cargando gestión de reservas...</div>;

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center">
        <h2 className="text-4xl font-black text-deep-green font-lora">Control de Reservas y Aforo</h2>
        <p className="text-forest-green uppercase tracking-widest text-[10px] font-black mt-2">Visión Unificada por Mesa y Fecha</p>
      </div>

      {/* Filters Panel */}
      <section className="max-w-6xl mx-auto px-4">
        <NeumorphicCard className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-deep-green/40 ml-2">
                <CalendarIcon size={12}/> Fecha de Consulta
              </label>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)} 
                className="w-full bg-cafe-bg shadow-neu-pressed p-3 rounded-cafe border-none outline-none font-black text-deep-green uppercase text-xs"
              />
           </div>

           <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-deep-green/40 ml-2">
                <Hash size={12}/> Filtrar por Mesa
              </label>
              <select 
                value={tableFilter} 
                onChange={e => setTableFilter(e.target.value)}
                className="w-full bg-cafe-bg shadow-neu-pressed p-3 rounded-cafe border-none outline-none font-black text-deep-green uppercase text-xs appearance-none"
              >
                <option value="ALL">Todas las Mesas</option>
                {data.map(t => <option key={t.id} value={t.id}>{t.description}</option>)}
              </select>
           </div>

           <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-deep-green/40 ml-2">
                <Filter size={12}/> Estado de Reserva
              </label>
              <div className="flex gap-2 p-1 bg-cafe-bg shadow-neu-pressed rounded-full">
                 {['ALL', 'PENDING', 'CONFIRMED'].map(s => (
                   <button 
                    key={s} 
                    onClick={() => setStatusFilter(s as any)}
                    className={`flex-1 py-2 rounded-full text-[9px] font-black uppercase transition-all ${statusFilter === s ? 'bg-forest-green text-white shadow-md' : 'text-deep-green/40 hover:text-deep-green'}`}
                   >
                     {s === 'ALL' ? 'Todas' : s === 'PENDING' ? 'Pendientes' : 'Confirmadas'}
                   </button>
                 ))}
              </div>
           </div>
        </NeumorphicCard>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 space-y-16">
        {filteredTables.map(table => {
          const reservationsForDate = table.reservations.filter(r => 
            new Date(r.date).toISOString().split('T')[0] === selectedDate && 
            (statusFilter === 'ALL' || r.status === statusFilter) &&
            r.status !== 'CANCELLED'
          );

          if (reservationsForDate.length === 0 && tableFilter !== 'ALL') {
             return <div key={table.id} className="text-center py-10 opacity-30 italic">No hay reservas para esta mesa en la fecha seleccionada</div>;
          }
          if (reservationsForDate.length === 0 && tableFilter === 'ALL') return null;

          const totalOccupied = reservationsForDate.reduce((acc, r) => acc + r.peopleCount, 0);
          
          // Unified players with reservation context
          const playerButtons = reservationsForDate.flatMap(res => 
            res.playerNames.map(name => ({
              name,
              resId: res.id,
              status: res.status,
              time: res.time
            }))
          );

          const allGames = Array.from(new Set(reservationsForDate.flatMap(r => r.games.map(g => g.name))));
          const freeSpots = table.capacity - totalOccupied;

          return (
            <div key={table.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <NeumorphicCard className="p-8 border-t-8 border-forest-green">
                <div className="flex flex-col lg:flex-row gap-12">
                   {/* Table Info & Capacity */}
                   <div className="lg:w-1/4 space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="w-16 h-16 rounded-cafe bg-white shadow-neu-flat flex flex-col items-center justify-center border border-white/40 flex-shrink-0">
                            <span className="text-2xl font-black text-deep-green">{table.capacity}</span>
                            <span className="text-[7px] font-black uppercase opacity-30">asientos</span>
                         </div>
                         <div>
                            <h3 className="text-2xl font-black text-deep-green font-lora">{table.description}</h3>
                            <div className="flex flex-col gap-1 mt-1">
                               <span className="text-[10px] font-black text-forest-green uppercase flex items-center gap-1">
                                  <Users size={12}/> {totalOccupied} Ocupados
                               </span>
                               <span className={`${freeSpots <= 0 ? 'text-terracotta' : 'text-green-600'} text-[10px] font-black uppercase`}>
                                  {freeSpots} Lugares Libres
                               </span>
                            </div>
                         </div>
                      </div>

                      <div className="pt-6 border-t border-deep-green/5">
                         <p className="text-[9px] font-black uppercase text-deep-green/30 mb-3 tracking-widest">Juegos en Mesa</p>
                         <div className="flex flex-wrap gap-2">
                            {allGames.length > 0 ? allGames.map((game, idx) => (
                               <span key={idx} className="px-3 py-1 bg-terracotta/5 border border-terracotta/10 text-terracotta rounded-full text-[9px] font-black uppercase tracking-tighter">
                                  {game}
                               </span>
                            )) : (
                               <span className="text-[10px] italic text-deep-green/20">Sin juegos seleccionados</span>
                            )}
                         </div>
                      </div>
                   </div>

                   {/* Players Confirmation List */}
                   <div className="flex-1 space-y-4">
                      <p className="text-[9px] font-black uppercase text-deep-green/30 mb-4 tracking-widest flex justify-between items-center">
                         <span>Control de Asistencia (Jugadores en Fecha)</span>
                         <span className="bg-white/50 px-2 py-0.5 rounded-full shadow-sm">{playerButtons.length} Jugadores</span>
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                         {playerButtons.map((p, idx) => (
                            <button
                              key={idx}
                              onClick={() => p.status === 'PENDING' && handleUpdateStatus(p.resId, 'CONFIRMED')}
                              className={`group relative p-4 rounded-cafe transition-all duration-300 flex flex-col items-start gap-2 text-left border-2 ${
                                p.status === 'CONFIRMED' 
                                ? 'bg-green-50/50 border-green-500 shadow-neu-flat' 
                                : 'bg-cafe-bg border-transparent shadow-neu-flat hover:border-forest-green/30 active:shadow-neu-pressed'
                              }`}
                            >
                               <div className="flex justify-between items-center w-full">
                                  <span className="text-[8px] font-black text-deep-green/40 uppercase">{p.time}</span>
                                  {p.status === 'CONFIRMED' && <CheckCircle size={10} className="text-green-600" />}
                               </div>
                               <span className={`text-xs font-black uppercase tracking-tighter ${p.status === 'CONFIRMED' ? 'text-green-700' : 'text-deep-green'}`}>
                                  {p.name}
                               </span>
                               {p.status === 'PENDING' && (
                                  <span className="text-[7px] font-bold text-forest-green opacity-0 group-hover:opacity-100 transition-opacity">Confirmar</span>
                                )}
                            </button>
                         ))}
                      </div>

                      {playerButtons.length === 0 && (
                         <div className="py-12 text-center bg-white/30 rounded-cafe border border-dashed border-deep-green/10">
                            <p className="text-[10px] font-black uppercase text-deep-green/20">No hay jugadores registrados aún</p>
                         </div>
                      )}
                   </div>
                </div>
              </NeumorphicCard>
            </div>
          );
        })}

        {filteredTables.every(t => t.reservations.filter(r => new Date(r.date).toISOString().split('T')[0] === selectedDate).length === 0) && (
           <NeumorphicCard className="p-20 text-center bg-cafe-bg shadow-neu-pressed opacity-40">
              <CalendarIcon size={48} className="mx-auto mb-6 text-deep-green/20" />
              <p className="text-sm font-black uppercase tracking-widest text-deep-green/40">No hay actividad registrada para esta fecha</p>
           </NeumorphicCard>
        )}
      </section>
    </div>
  );
};
