import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { useAuth } from '../context/AuthContext';
import { Plus, X, Gamepad2, Users, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';

interface ActiveReservation {
  id: string;
  date: string;
  time: string;
  peopleCount: number;
  playerNames: string[];
  table: { description: string };
  games: { id: string; name: string }[];
}

interface AvailableTable {
  id: string;
  name: string;
  capacity: number;
  availableSpots: number;
  currentPlayers: string[];
  currentGames: string[];
  isFullyEmpty: boolean;
}

interface GameSelection {
  id: string;
  name: string;
}

export const ReservationView: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [activeReservation, setActiveReservation] = useState<ActiveReservation | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Flow states
  const [step, setStep] = useState<0 | 1 | 2 | 3>(() => {
     const saved = localStorage.getItem('reservation_step');
     return saved ? Number(saved) as any : 0;
  });
  
  // Persistence for steps
  const [shareTable, setShareTable] = useState(() => localStorage.getItem('res_shareTable') === 'true');
  const [peopleCount, setPeopleCount] = useState(() => Number(localStorage.getItem('res_peopleCount')) || 1);
  const [date, setDate] = useState(() => localStorage.getItem('res_date') || '');
  const [time, setTime] = useState(() => localStorage.getItem('res_time') || '18:00');

  // Step 2 states
  const [availableTables, setAvailableTables] = useState<AvailableTable[]>([]);
  const [selectedTableId, setSelectedTableId] = useState(() => localStorage.getItem('res_selectedTableId') || '');
  const [playerNames, setPlayerNames] = useState<string[]>(() => {
    const saved = localStorage.getItem('res_playerNames');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedGames, setSelectedGames] = useState<GameSelection[]>(() => {
    const saved = localStorage.getItem('temp_selected_games');
    return saved ? JSON.parse(saved) : [];
  });
  const [errorDesc, setErrorDesc] = useState('');

  useEffect(() => {
    localStorage.setItem('reservation_step', step.toString());
    localStorage.setItem('res_shareTable', shareTable.toString());
    localStorage.setItem('res_peopleCount', peopleCount.toString());
    localStorage.setItem('res_date', date);
    localStorage.setItem('res_time', time);
    localStorage.setItem('res_selectedTableId', selectedTableId);
    localStorage.setItem('res_playerNames', JSON.stringify(playerNames));
  }, [step, shareTable, peopleCount, date, time, selectedTableId, playerNames]);

  const fetchActiveReservation = async () => {
    if (!user || !token) return;
    try {
      const res = await fetch(`http://localhost:3000/api/reservations/active/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const active = Array.isArray(data) ? data[0] : data;
        setActiveReservation(active);
      }
    } catch (err) {
      console.error('Error fetching active reservation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveReservation();
    if (step === 2) {
       handleFindTables(null as any, true);
    }
  }, [user, token]);

  const handleStartNew = () => {
    localStorage.removeItem('res_selectedTableId');
    localStorage.removeItem('res_playerNames');
    localStorage.removeItem('temp_selected_games');
    setSelectedGames([]);
    setStep(1);
    setErrorDesc('');
  };

  const handleFindTables = async (e?: React.FormEvent, silent = false) => {
    if (e) e.preventDefault();
    if (!silent) setErrorDesc('');
    try {
      const res = await fetch('http://localhost:3000/api/reservations/find-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          time,
          peopleCount: Number(peopleCount),
          shareTable
        })
      });
      const data = await res.json();
      if (data.length === 0) {
        if (!silent) setErrorDesc('Lo sentimos, no hay mesas disponibles para esa configuración.');
      } else {
        setAvailableTables(data);
        if (playerNames.length !== Number(peopleCount)) {
            setPlayerNames(new Array(Number(peopleCount)).fill(''));
        }
        setStep(2);
      }
    } catch (err) {
        if (!silent) setErrorDesc('Error al buscar mesas.');
    }
  };

  const handleConfirmReservation = async () => {
    if (!selectedTableId) {
      setErrorDesc('Por favor selecciona una mesa.');
      return;
    }
    if (playerNames.some(n => !n.trim())) {
      setErrorDesc('Por favor ingresa los nombres de todos los jugadores.');
      return;
    }

    try {
      const payload = {
        userId: user?.id,
        tableId: selectedTableId,
        date,
        time,
        peopleCount: Number(peopleCount),
        playerNames,
        shareTable,
        gameIds: selectedGames.map(g => g.id)
      };

      const res = await fetch('http://localhost:3000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        localStorage.removeItem('reservation_step');
        localStorage.removeItem('temp_selected_games');
        setStep(3);
        fetchActiveReservation();
      } else {
        const err = await res.json();
        setErrorDesc(err.message || 'Error al guardar la reserva.');
      }
    } catch (err) {
      setErrorDesc('Error de conexión.');
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-forest-green">Cargando...</div>;

  if (step === 3) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center px-4">
        <NeumorphicCard className="p-12 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-forest-green text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-10 shadow-neu-flat">
             <CheckCircle2 size={48} />
          </div>
          <h2 className="text-4xl font-black text-deep-green mb-4 font-lora">¡Reserva Exitosa!</h2>
          <p className="text-forest-green mb-10 font-medium italic opacity-70">Tu lugar está listo. Los dados están esperando.</p>
          <NeumorphicButton onClick={() => setStep(0)} variant="pressed" className="px-12 py-5 bg-forest-green text-white font-black uppercase tracking-widest text-[10px]">Ir a mi Perfil</NeumorphicButton>
        </NeumorphicCard>
      </div>
    );
  }

  // DASHBOARD VIEW
  if (step === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-deep-green tracking-tighter mb-4 font-lora">Bienvenido, {user?.name}</h1>
          <p className="text-forest-green font-black uppercase tracking-[0.4em] text-xs">Tu Espacio en ARLA Café Ludoteca</p>
        </div>

        {activeReservation ? (
          <div className="space-y-12">
            <h2 className="text-3xl font-black text-deep-green text-center">Tu Reserva Actual</h2>
            <NeumorphicCard className="p-10 border-t-8 border-terracotta relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta/5 rounded-bl-full -mr-10 -mt-10"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-green/30 mb-2">Ubicación</p>
                    <h3 className="text-4xl font-black text-deep-green font-lora flex items-center gap-3">
                       <MapPin className="text-terracotta" size={32} /> {activeReservation.table.description}
                    </h3>
                  </div>
                  <div className="flex gap-6">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase text-deep-green/30">Día</p>
                       <p className="font-black text-xl text-deep-green flex items-center gap-2"><Calendar size={18}/> {new Date(activeReservation.date).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase text-deep-green/30">Hora</p>
                       <p className="font-black text-xl text-deep-green flex items-center gap-2"><Clock size={18}/> {activeReservation.time}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-black uppercase text-deep-green/30 mb-4 flex items-center gap-2"><Users size={12}/> Equipo ({activeReservation.playerNames.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {activeReservation.playerNames.map((name, i) => (
                        <span key={i} className="px-5 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-deep-green shadow-sm border border-white/40">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-deep-green/30 mb-4 flex items-center gap-2"><Gamepad2 size={12}/> Juegos</p>
                    {activeReservation.games.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {activeReservation.games.map(g => (
                          <span key={g.id} className="px-5 py-2 bg-terracotta text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                            {g.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs italic text-deep-green/40">Sin juegos exclusivos. ¡Elige uno en recepción!</p>
                    )}
                  </div>
                </div>
              </div>
            </NeumorphicCard>
            <div className="text-center pt-4">
              <NeumorphicButton onClick={handleStartNew} variant="flat" className="px-12 py-5 font-black uppercase tracking-widest text-[10px] text-forest-green hover:bg-forest-green/5">Registrar Otra Reserva</NeumorphicButton>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 px-4">
             <NeumorphicCard className="p-16 max-w-2xl mx-auto space-y-10 group cursor-pointer hover:scale-[1.01] transition-transform duration-500">
                <div className="text-[80px] filter grayscale group-hover:grayscale-0 transition-all">🎲</div>
                <div>
                    <h2 className="text-4xl font-black text-deep-green font-lora mb-4">Abre el tablero</h2>
                    <p className="text-forest-green font-medium max-w-sm mx-auto opacity-70">Selecciona tu mesa, invita a tus amigos y elige tus juegos favoritos para la velada perfecta.</p>
                </div>
                <NeumorphicButton onClick={handleStartNew} variant="pressed" className="px-16 py-6 font-black uppercase tracking-[0.2em] text-[11px] bg-forest-green text-white shadow-neu-flat border-none group-hover:scale-105 transition-transform">
                  Comienza tu Historia
                </NeumorphicButton>
             </NeumorphicCard>
          </div>
        )}
      </div>
    );
  }

  // STEP 1: CONFIGURATION
  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-in slide-in-from-right-12 duration-500">
        <NeumorphicCard className="p-12 space-y-12">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-black text-deep-green font-lora">Etapa 1: Planifica</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-forest-green">Define tu espacio y tiempo</p>
            </div>

            <form onSubmit={(e) => handleFindTables(e)} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/40 ml-4">Preferencia de Mesa</label>
                    <div className="flex gap-2 p-2 rounded-cafe bg-cafe-bg shadow-neu-pressed">
                      <button type="button" onClick={() => setShareTable(true)} className={`flex-1 py-4 rounded-cafe text-[10px] font-black tracking-widest transition-all ${shareTable ? 'bg-forest-green text-white shadow-md' : 'text-deep-green/40'}`}>COMPARTIR</button>
                      <button type="button" onClick={() => setShareTable(false)} className={`flex-1 py-4 rounded-cafe text-[10px] font-black tracking-widest transition-all ${!shareTable ? 'bg-terracotta text-white shadow-md' : 'text-deep-green/40'}`}>EXCLUSIVA</button>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/40 ml-4">Lugares (Jugadores)</label>
                    <input type="number" min="1" max="12" value={peopleCount} onChange={e => setPeopleCount(Number(e.target.value))} className="w-full px-6 py-4 rounded-cafe bg-cafe-bg shadow-neu-pressed border-none outline-none font-black text-deep-green" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/40 ml-4">Fecha</label>
                    <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full px-6 py-4 rounded-cafe bg-cafe-bg shadow-neu-pressed border-none outline-none font-black text-deep-green uppercase text-[11px]" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/40 ml-4">Hora</label>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full px-6 py-4 rounded-cafe bg-cafe-bg shadow-neu-pressed border-none outline-none font-black text-deep-green" />
                 </div>
              </div>
              
              {errorDesc && <p className="text-center text-terracotta font-black uppercase text-[10px] animate-pulse">{errorDesc}</p>}
              
              <div className="flex gap-4 pt-4">
                <NeumorphicButton type="button" onClick={() => setStep(0)} variant="flat" className="flex-1 py-5 text-[10px] font-black uppercase text-deep-green/40 tracking-widest">Regresar</NeumorphicButton>
                <NeumorphicButton type="submit" className="flex-1 py-5 bg-deep-green text-white font-black uppercase tracking-widest text-[10px] shadow-neu-flat border-none">Explorar Mesas</NeumorphicButton>
              </div>
            </form>
        </NeumorphicCard>
      </div>
    );
  }

  // STEP 2: TABLE SELECTION & GAMES
  if (step === 2) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 space-y-16 animate-in slide-in-from-right-12 duration-500">
        <div className="text-center">
            <h2 className="text-5xl font-black text-deep-green font-lora tracking-tighter">Etapa 2: Selecciona y Juega</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-forest-green mt-2">Detalles finales de tu reserva</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Tables List */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-deep-green/40 pl-4">Mesas Disponibles</h3>
            <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4 scrollbar-hide py-2">
              {availableTables.map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setSelectedTableId(t.id)}
                  className={`w-full text-left p-8 rounded-[2.5rem] transition-all duration-500 border-2 relative overflow-hidden group ${selectedTableId === t.id ? 'border-forest-green bg-white shadow-neu-flat translate-x-2' : 'border-transparent bg-cafe-bg shadow-neu-pressed opacity-70 grayscale hover:grayscale-0 hover:opacity-100'}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                        <h4 className="text-2xl font-black text-deep-green font-lora">{t.name}</h4>
                        <p className="text-[9px] font-black uppercase text-forest-green/50 mt-1">Capacidad: {t.capacity} personas</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${t.availableSpots <= 2 ? 'bg-terracotta text-white' : 'bg-forest-green text-white'}`}>
                        {t.availableSpots} Libres
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {t.currentPlayers.length > 0 && (
                      <div className="flex flex-col gap-1">
                        <p className="text-[8px] font-black uppercase text-deep-green/30 tracking-widest">En mesa:</p>
                        <div className="flex flex-wrap gap-1">
                           {t.currentPlayers.map((p, i) => <span key={i} className="text-[9px] font-bold text-deep-green/60 bg-white/50 px-2 py-0.5 rounded shadow-sm border border-white/40">{p}</span>)}
                        </div>
                      </div>
                    )}
                    {t.currentGames.length > 0 && (
                      <div className="flex flex-col gap-1">
                        <p className="text-[8px] font-black uppercase text-terracotta/40 tracking-widest">Juegos en mesa (compartidos):</p>
                        <p className="text-[10px] font-black text-terracotta/70">{t.currentGames.join(' • ')}</p>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-12">
            <NeumorphicCard className="p-12 space-y-12">
                {/* Players */}
                <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-deep-green/40 pl-2">Integrantes del Equipo ({peopleCount})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {playerNames.map((name, i) => (
                        <div key={i} className="relative">
                            <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-deep-green/20" size={18} />
                            <input
                                placeholder={`Nombre ${i + 1}`}
                                value={name}
                                onChange={e => {
                                    const newN = [...playerNames];
                                    newN[i] = e.target.value;
                                    setPlayerNames(newN);
                                }}
                                className="w-full px-14 py-4 rounded-full bg-cafe-bg shadow-neu-pressed border-none outline-none font-black text-deep-green placeholder:text-deep-green/20"
                            />
                        </div>
                        ))}
                    </div>
                </div>

                {/* Game Selection Flow */}
                <div className="space-y-6 pt-6 border-t border-deep-green/5">
                    <div className="flex justify-between items-center px-1">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-deep-green/40">Tu Selección de Juegos (Máx 2)</h3>
                       {selectedGames.length < 2 && (
                          <NeumorphicButton 
                            onClick={() => navigate('/ludoteca?mode=select')}
                            variant="flat"
                            className="text-forest-green font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-forest-green/5 py-3 px-6"
                          >
                             <Plus size={14} /> Seleccionar Juegos
                          </NeumorphicButton>
                       )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[80px]">
                        {selectedGames.map(g => (
                          <div key={g.id} className="bg-cafe-bg rounded-[2rem] p-6 shadow-neu-pressed flex items-center justify-between border border-white/20 animate-in zoom-in-95 duration-300">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-terracotta text-white flex items-center justify-center shadow-lg">
                                   <Gamepad2 size={20} />
                                </div>
                                <span className="font-black text-deep-green text-xs uppercase tracking-tight">{g.name}</span>
                             </div>
                             <X 
                                className="text-terracotta cursor-pointer hover:scale-110 transition-transform" 
                                size={18} 
                                onClick={() => {
                                    const newList = selectedGames.filter(sg => sg.id !== g.id);
                                    setSelectedGames(newList);
                                    localStorage.setItem('temp_selected_games', JSON.stringify(newList));
                                }} 
                             />
                          </div>
                        ))}
                        {selectedGames.length === 0 && (
                           <div className="md:col-span-2 flex flex-col items-center justify-center p-8 border-2 border-dashed border-deep-green/10 rounded-[2.5rem] bg-black/5 opacity-40">
                              <p className="text-[10px] font-black uppercase tracking-widest">No hay juegos seleccionados</p>
                              <p className="text-[9px] font-medium mt-1">Navega en la ludoteca para elegir tus favoritos</p>
                           </div>
                        )}
                    </div>
                </div>

                {errorDesc && <p className="text-center text-terracotta font-black uppercase text-[10px] animate-pulse">{errorDesc}</p>}

                <div className="flex gap-6 pt-8">
                    <NeumorphicButton type="button" onClick={() => setStep(1)} variant="flat" className="flex-1 py-5 text-[10px] font-black uppercase text-deep-green/40 tracking-widest">Atrás</NeumorphicButton>
                    <NeumorphicButton 
                        type="button" 
                        onClick={handleConfirmReservation} 
                        className="flex-2 py-6 bg-forest-green text-white font-black uppercase tracking-[0.3em] text-[11px] shadow-neu-flat border-none"
                    >
                        Finalizar Reserva
                    </NeumorphicButton>
                </div>
            </NeumorphicCard>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
