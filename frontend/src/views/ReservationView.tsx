import React, { useState, useEffect } from 'react';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { useAuth } from '../context/AuthContext';

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

interface Game {
  id: string;
  name: string;
}

export const ReservationView: React.FC = () => {
  const { user, token } = useAuth();
  const [activeReservation, setActiveReservation] = useState<ActiveReservation | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Flow states
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0); // 0: Dashboard/Home, 1: Step 1, 2: Step 2, 3: Success
  
  // Step 1 states
  const [shareTable, setShareTable] = useState(false);
  const [peopleCount, setPeopleCount] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('18:00');

  // Step 2 states
  const [availableTables, setAvailableTables] = useState<AvailableTable[]>([]);
  const [selectedTableId, setSelectedTableId] = useState('');
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [availableGames, setAvailableGames] = useState<Game[]>([]);
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>([]);
  const [gameSearch, setGameSearch] = useState('');
  const [errorDesc, setErrorDesc] = useState('');

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

  const fetchGames = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/admin/games');
      const data = await res.json();
      setAvailableGames(data);
    } catch (err) {
      console.error('Error fetching games:', err);
    }
  };

  useEffect(() => {
    fetchActiveReservation();
    fetchGames();
  }, [user, token]);

  const handleStartNew = () => {
    if (activeReservation) {
      if (!window.confirm('Ya tienes una reserva activa. ¿Deseas hacer una reserva adicional?')) {
        return;
      }
    }
    setStep(1);
    setErrorDesc('');
  };

  const handleFindTables = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDesc('');
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
        setErrorDesc('Lo sentimos, no hay mesas disponibles para esa configuración.');
      } else {
        setAvailableTables(data);
        setPlayerNames(new Array(Number(peopleCount)).fill(''));
        setStep(2);
      }
    } catch (err) {
       setErrorDesc('Error al buscar mesas.');
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
        gameIds: selectedGameIds
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

  const filteredGames = availableGames.filter(g => 
    g.name.toLowerCase().includes(gameSearch.toLowerCase())
  );

  if (loading) return <div className="text-center py-20 animate-pulse text-forest-green">Cargando...</div>;

  if (step === 3) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <NeumorphicCard className="p-12">
          <div className="w-20 h-20 bg-forest-green text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-neu-flat">✓</div>
          <h2 className="text-4xl font-black text-deep-green mb-4 font-lora">¡Reserva Exitosa!</h2>
          <p className="text-forest-green mb-10">Tu mesa ha sido asegurada. ¡Nos vemos pronto en ARLA!</p>
          <NeumorphicButton onClick={() => setStep(0)} variant="flat" className="px-10 py-4">Volver al Inicio</NeumorphicButton>
        </NeumorphicCard>
      </div>
    );
  }

  // DASHBOARD VIEW
  if (step === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 p-4">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-deep-green tracking-tighter mb-4 font-lora">Bienvenido, {user?.name}</h1>
          <p className="text-forest-green font-black uppercase tracking-[0.4em] text-xs">Tu Espacio en ARLA Café Ludoteca</p>
        </div>

        {activeReservation ? (
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-deep-green pl-4">Tu Reserva Activa</h2>
            <NeumorphicCard className="p-8 border-l-8 border-terracotta">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-green/40 mb-2">Mesa Reservada</p>
                  <h3 className="text-3xl font-black text-deep-green font-lora">{activeReservation.table.description}</h3>
                  <div className="flex gap-4 mt-6">
                    <div className="bg-cafe-bg p-4 rounded-cafe shadow-neu-pressed flex-1 text-center">
                      <p className="text-[10px] font-bold text-forest-green uppercase mb-1">Fecha</p>
                      <p className="font-black text-deep-green">{new Date(activeReservation.date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-cafe-bg p-4 rounded-cafe shadow-neu-pressed flex-1 text-center">
                      <p className="text-[10px] font-bold text-forest-green uppercase mb-1">Hora</p>
                      <p className="font-black text-deep-green">{activeReservation.time}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black uppercase text-deep-green/40 mb-3">Jugadores Registrados ({activeReservation.playerNames.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {activeReservation.playerNames.map((name, i) => (
                        <span key={i} className="px-3 py-1 bg-white/50 rounded-full text-xs font-bold text-deep-green shadow-sm border border-white/20">
                          👤 {name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-deep-green/40 mb-3">Juegos Seleccionados</p>
                    {activeReservation.games.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {activeReservation.games.map(g => (
                          <span key={g.id} className="px-3 py-1 bg-terracotta/10 text-terracotta rounded-full text-xs font-bold border border-terracotta/20">
                            🎲 {g.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm italic text-deep-green/30">Ningún juego seleccionado aún.</p>
                    )}
                  </div>
                </div>
              </div>
            </NeumorphicCard>
            <div className="text-center pt-8">
              <NeumorphicButton onClick={handleStartNew} variant="flat" className="px-10 opacity-70 hover:opacity-100">Registrar Otra Reserva</NeumorphicButton>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 px-4">
             <NeumorphicCard className="p-12 max-w-2xl mx-auto space-y-8">
                <div className="text-5xl">♟️</div>
                <h2 className="text-3xl font-black text-deep-green font-lora">¡Aún no tienes reservas!</h2>
                <p className="text-forest-green">El café te espera, la ludoteca está lista. Asegura tu lugar ahora mismo.</p>
                <NeumorphicButton onClick={handleStartNew} variant="pressed" className="px-12 py-5 font-black uppercase tracking-widest text-sm bg-forest-green text-white">
                  Iniciar Nueva Reserva
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
      <div className="max-w-2xl mx-auto py-12 px-4 shadow-neu-pressed rounded-[3rem] bg-cafe-bg/30">
        <h2 className="text-4xl font-black text-deep-green text-center mb-10 font-lora">Etapa 1: Personaliza tu Experiencia</h2>
        <form onSubmit={handleFindTables} className="space-y-8 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/50 ml-4">Tipo de Mesa</label>
                <div className="flex gap-2 p-2 rounded-cafe bg-cafe-bg shadow-neu-pressed">
                  <button type="button" onClick={() => setShareTable(true)} className={`flex-1 py-3 rounded-cafe text-xs font-black transition-all ${shareTable ? 'bg-forest-green text-white shadow-neu-flat scale-[1.02]' : 'text-deep-green/50 hover:text-deep-green'}`}>COMPARTIR</button>
                  <button type="button" onClick={() => setShareTable(false)} className={`flex-1 py-3 rounded-cafe text-xs font-black transition-all ${!shareTable ? 'bg-terracotta text-white shadow-neu-flat scale-[1.02]' : 'text-deep-green/50 hover:text-deep-green'}`}>EXCLUSIVA</button>
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/50 ml-4">Lugares a Reservar</label>
                <input type="number" min="1" max="12" value={peopleCount} onChange={e => setPeopleCount(Number(e.target.value))} className="w-full px-6 py-4 rounded-cafe bg-cafe-bg shadow-neu-pressed border-none outline-none font-black text-deep-green" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/50 ml-4">Fecha de Reserva</label>
                <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full px-6 py-4 rounded-cafe bg-cafe-bg shadow-neu-pressed border-none outline-none font-black text-deep-green uppercase text-xs" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/50 ml-4">Hora de llegada (Opcional)</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full px-6 py-4 rounded-cafe bg-cafe-bg shadow-neu-pressed border-none outline-none font-black text-deep-green" />
             </div>
          </div>
          {errorDesc && <p className="text-center text-terracotta font-black uppercase text-[10px] animate-pulse">{errorDesc}</p>}
          <div className="flex gap-4 pt-6">
            <NeumorphicButton type="button" onClick={() => setStep(0)} variant="flat" className="flex-1 py-4 text-deep-green/50">Regresar</NeumorphicButton>
            <NeumorphicButton type="submit" variant="pressed" className="flex-1 py-4 bg-deep-green text-white shadow-neu-flat">Buscar Mesas</NeumorphicButton>
          </div>
        </form>
      </div>
    );
  }

  // STEP 2: TABLE SELECTION & DETAILS
  if (step === 2) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 space-y-12">
        <h2 className="text-4xl font-black text-deep-green text-center font-lora">Etapa 2: Elige tu lugar</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Tables List */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-deep-green/40 pl-4 mb-4">Mesas que cumplen tus requisitos</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
              {availableTables.map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setSelectedTableId(t.id)}
                  className={`w-full text-left p-6 rounded-[2rem] transition-all duration-300 border-2 ${selectedTableId === t.id ? 'border-forest-green bg-white shadow-neu-flat scale-[1.02]' : 'border-transparent bg-cafe-bg shadow-neu-pressed opacity-70 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-[1.01]'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-black text-deep-green">{t.name}</h4>
                    <span className="px-3 py-1 bg-deep-green text-white text-[9px] font-black rounded-full shadow-sm">{t.availableSpots} Lugares Libres</span>
                  </div>
                  <div className="space-y-3">
                    {t.currentPlayers.length > 0 && (
                      <div className="text-[10px] text-forest-green/60 font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                        👥 Jugando ahora: {t.currentPlayers.join(', ')}
                      </div>
                    )}
                    {t.currentGames.length > 0 && (
                      <div className="text-[10px] text-terracotta/60 font-black italic">
                        🎲 En juego: {t.currentGames.join(', ')}
                      </div>
                    )}
                    {t.isFullyEmpty && (
                      <div className="text-[10px] text-green-500 font-black uppercase tracking-widest">✨ Mesa disponible y vacía</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div className="space-y-10">
            {/* Player Names Input */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-deep-green/40 pl-4">¿Quiénes vienen? ({peopleCount} nombres)</h3>
              <div className="space-y-3">
                {playerNames.map((name, i) => (
                  <input
                    key={i}
                    placeholder={`Nombre del Jugador ${i + 1}`}
                    value={name}
                    onChange={e => {
                      const newN = [...playerNames];
                      newN[i] = e.target.value;
                      setPlayerNames(newN);
                    }}
                    className="w-full px-6 py-3 rounded-full bg-cafe-bg shadow-neu-pressed border-none outline-none font-bold text-sm text-deep-green"
                  />
                ))}
              </div>
            </div>

            {/* Game Selection */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-deep-green/40 pl-4">¿Algún juego en mente? (Máx 2)</h3>
              <NeumorphicCard className="p-6 space-y-4">
                <input 
                  type="text" 
                  placeholder="Buscar juegos..." 
                  value={gameSearch}
                  onChange={e => setGameSearch(e.target.value)}
                  className="w-full px-4 py-2 rounded-full bg-cafe-bg shadow-neu-pressed border-none outline-none text-sm"
                />
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2">
                  {filteredGames.map(g => {
                    const isSelected = selectedGameIds.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) setSelectedGameIds(prev => prev.filter(id => id !== g.id));
                          else if (selectedGameIds.length < 2) setSelectedGameIds(prev => [...prev, g.id]);
                        }}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isSelected ? 'bg-terracotta text-white shadow-neu-flat' : 'bg-cafe-bg shadow-neu-pressed text-deep-green/40 hover:text-deep-green'}`}
                      >
                        {g.name}
                      </button>
                    )
                  })}
                </div>
              </NeumorphicCard>
            </div>

            {errorDesc && <p className="text-center text-terracotta font-black uppercase text-[10px] animate-pulse">{errorDesc}</p>}

            <div className="flex gap-4">
              <NeumorphicButton type="button" onClick={() => setStep(1)} variant="flat" className="flex-1 py-5 text-deep-green/50 font-black">EDITAR REQUISITOS</NeumorphicButton>
              <NeumorphicButton type="button" onClick={handleConfirmReservation} variant="pressed" className="flex-1 py-5 bg-forest-green text-white font-black uppercase tracking-[0.2em] shadow-neu-flat">CONFIRMAR RESERVA</NeumorphicButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
