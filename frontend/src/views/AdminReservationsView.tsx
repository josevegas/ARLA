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
          const allPlayers = Array.from(new Set(reservationsForDate.flatMap(r => r.playerNames)));
          const allGames = Array.from(new Set(reservationsForDate.flatMap(r => r.games.map(g => g.name))));

          return (
            <div key={table.id} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-cafe bg-white shadow-neu-flat flex flex-col items-center justify-center border border-white/40">
                       <span className="text-2xl font-black text-deep-green">{table.capacity}</span>
                       <span className="text-[8px] font-black uppercase opacity-30">asientos</span>
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-deep-green font-lora">{table.description}</h3>
                       <div className="flex gap-4 mt-2">
                          <span className="text-[10px] font-black text-forest-green uppercase flex items-center gap-1"><Users size={12}/> {totalOccupied} ocupados</span>
                          <span className={`${table.capacity - totalOccupied <= 0 ? 'text-terracotta' : 'text-green-600'} text-[10px] font-black uppercase`}>
                             {table.capacity - totalOccupied} lugares libres
                          </span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-cafe-surface/30 p-4 rounded-cafe border border-white/20 shadow-neu-pressed flex-1 md:max-w-md">
                    <div className="space-y-3">
                       <div>
                          <p className="text-[9px] font-black uppercase text-deep-green/30 mb-1">Unificado Jugadores ({allPlayers.length})</p>
                          <p className="text-[10px] font-bold text-deep-green leading-relaxed">{allPlayers.join(', ') || 'Nadie registrado'}</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black uppercase text-deep-green/30 mb-1">Unificado Juegos</p>
                          <p className="text-[10px] font-black text-terracotta uppercase">{allGames.join(' • ') || 'Sin juegos'}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Reservation Cards for this table */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reservationsForDate.map(res => (
                    <NeumorphicCard key={res.id} className={`p-6 border-t-8 transition-all relative group ${res.status === 'CONFIRMED' ? 'border-green-500 bg-green-50/10' : 'border-terracotta'}`}>
                       <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-white shadow-neu-pressed flex items-center justify-center text-forest-green">
                               <Clock size={14} />
                             </div>
                             <span className="font-black text-deep-green">{res.time}</span>
                          </div>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${res.status === 'CONFIRMED' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-terracotta/5 text-terracotta border-terracotta/10'}`}>
                             {res.status}
                          </span>
                       </div>

                       <div className="space-y-4 mb-8">
                          <div>
                             <p className="text-[9px] font-black uppercase text-deep-green/30 mb-1">Grupo ({res.peopleCount} pers.)</p>
                             <div className="text-[10px] font-bold text-deep-green flex flex-wrap gap-1">
                                {res.playerNames.map((n, i) => <span key={i} className="after:content-[','] last:after:content-['']">{n}</span>)}
                             </div>
                             {res.user && <p className="text-[8px] text-forest-green/60 mt-2 font-medium">Por: {res.user.name} ({res.user.email})</p>}
                          </div>
                       </div>

                       <div className="flex gap-2">
                          {res.status === 'PENDING' ? (
                            <>
                              <NeumorphicButton 
                                onClick={() => handleUpdateStatus(res.id, 'CONFIRMED')}
                                className="flex-1 py-3 bg-forest-green text-white text-[9px] font-black uppercase tracking-widest shadow-neu-flat border-none"
                              >
                                Confirmar
                              </NeumorphicButton>
                              <NeumorphicButton 
                                onClick={() => handleUpdateStatus(res.id, 'CANCELLED')}
                                variant="pressed" 
                                className="px-4 text-red-500 shadow-neu-pressed"
                              >
                                <XCircle size={16} />
                              </NeumorphicButton>
                            </>
                          ) : (
                            <div className="w-full py-2 text-center text-green-600 font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 bg-green-50 rounded-full border border-green-100">
                               <CheckCircle size={12} /> Cliente en Mesa
                            </div>
                          )}
                       </div>
                    </NeumorphicCard>
                  ))}
              </div>
              <div className="border-b border-deep-green/5 pt-8"></div>
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
