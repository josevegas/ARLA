import React, { useState, useEffect } from 'react';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { useAuth } from '../context/AuthContext';

interface Game {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  imageUrl: string | null;
  minPlayers: number | null;
  maxPlayers: number | null;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | null;
  duration: number | null;
  stock: number;
}

export const GameManagement: React.FC = () => {
  const { token } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeGame, setActiveGame] = useState<Partial<Game>>({
    name: '',
    description: '',
    category: '',
    imageUrl: '',
    minPlayers: 1,
    maxPlayers: 4,
    difficulty: 'MEDIUM',
    duration: 30,
    stock: 1
  });

  const fetchGames = async () => {
    try {
      const resp = await fetch('http://localhost:3000/api/admin/games');
      const data = await resp.json();
      setGames(data);
    } catch (err) {
      console.error('Error fetching games:', err);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const [status, setStatus] = useState<'idle' | 'creating' | 'updating' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(isEditing ? 'updating' : 'creating');
    
    // Clean data to avoid NaN or empty strings in optional fields
    const dataToSave: any = {
      name: activeGame.name,
      description: activeGame.description || null,
      category: activeGame.category || null,
      imageUrl: activeGame.imageUrl || null,
      difficulty: activeGame.difficulty || 'MEDIUM',
      stock: Number(activeGame.stock) || 0,
    };

    // Use Number() to convert strictly and check for NaN
    if (activeGame.minPlayers) dataToSave.minPlayers = Number(activeGame.minPlayers) || null;
    if (activeGame.maxPlayers) dataToSave.maxPlayers = Number(activeGame.maxPlayers) || null;
    if (activeGame.duration) dataToSave.duration = Number(activeGame.duration) || null;

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing 
      ? `http://localhost:3000/api/admin/games/${activeGame.id}`
      : 'http://localhost:3000/api/admin/games';

    try {
      const resp = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSave)
      });

      if (resp.ok) {
        await fetchGames();
        setIsEditing(false);
        setActiveGame({ name: '', description: '', category: '', imageUrl: '', minPlayers: 1, maxPlayers: 4, difficulty: 'MEDIUM', duration: 30, stock: 1 });
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        const errorData = await resp.json().catch(() => ({}));
        console.error('API Error:', errorData);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (err) {
      console.error('Network Error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleEdit = (game: Game) => {
    setActiveGame({
      ...game,
      description: game.description || '',
      category: game.category || '',
      imageUrl: game.imageUrl || '',
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este juego?')) return;
    try {
      await fetch(`http://localhost:3000/api/admin/games/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchGames();
    } catch (err) {
      console.error('Error deleting game:', err);
    }
  };

  const inputStyles = "w-full px-4 py-3 rounded-cafe bg-cafe-bg shadow-neu-pressed border-none focus:ring-2 focus:ring-forest-green/30 outline-none text-deep-green text-sm transition-all";

  return (
    <div className="space-y-12">
      <NeumorphicCard className="p-8">
        <h3 className="text-2xl font-black text-deep-green mb-8 font-lora">
          {isEditing ? 'Editar Juego' : 'Registrar Nuevo Juego'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Nombre del Juego</label>
            <input 
              className={inputStyles}
              value={activeGame.name}
              onChange={e => setActiveGame({...activeGame, name: e.target.value})}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">URL de la Imagen</label>
            <input 
              className={inputStyles}
              placeholder="https://ejemplo.com/imagen.jpg"
              value={activeGame.imageUrl || ''}
              onChange={e => setActiveGame({...activeGame, imageUrl: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Descripción</label>
            <textarea 
              className={`${inputStyles} h-24 pt-4`}
              value={activeGame.description || ''}
              onChange={e => setActiveGame({...activeGame, description: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Categoría</label>
            <input 
              className={inputStyles}
              value={activeGame.category || ''}
              onChange={e => setActiveGame({...activeGame, category: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Dificultad</label>
            <select 
              className={inputStyles}
              value={activeGame.difficulty || 'MEDIUM'}
              onChange={e => setActiveGame({...activeGame, difficulty: e.target.value as any})}
            >
              <option value="EASY">Fácil</option>
              <option value="MEDIUM">Medio</option>
              <option value="HARD">Difícil</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Min. Jugadores</label>
              <input 
                type="number"
                className={inputStyles}
                value={activeGame.minPlayers || ''}
                onChange={e => setActiveGame({...activeGame, minPlayers: e.target.value ? parseInt(e.target.value) : null})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Max. Jugadores</label>
              <input 
                type="number"
                className={inputStyles}
                value={activeGame.maxPlayers || ''}
                onChange={e => setActiveGame({...activeGame, maxPlayers: e.target.value ? parseInt(e.target.value) : null})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Duración (min)</label>
              <input 
                type="number"
                className={inputStyles}
                value={activeGame.duration || ''}
                onChange={e => setActiveGame({...activeGame, duration: e.target.value ? parseInt(e.target.value) : null})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Stock</label>
              <input 
                type="number"
                className={inputStyles}
                value={activeGame.stock || 0}
                onChange={e => setActiveGame({...activeGame, stock: e.target.value ? parseInt(e.target.value) : 0})}
              />
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col gap-4 mt-4">
            <div className="flex gap-4">
              <NeumorphicButton 
                type="submit" 
                className={`flex-1 py-4 font-black uppercase tracking-widest ${status === 'creating' || status === 'updating' ? 'opacity-50 cursor-not-allowed' : 'bg-forest-green text-white shadow-neu-flat'}`}
                disabled={status === 'creating' || status === 'updating'}
              >
                {status === 'creating' ? 'Guardando...' : status === 'updating' ? 'Actualizando...' : isEditing ? 'Actualizar Juego' : 'Guardar Juego'}
              </NeumorphicButton>
              {isEditing && (
                <NeumorphicButton 
                  type="button" 
                  variant="flat"
                  onClick={() => {
                    setIsEditing(false);
                    setActiveGame({ name: '', description: '', category: '', imageUrl: '', minPlayers: 1, maxPlayers: 4, difficulty: 'MEDIUM', duration: 30, stock: 1 });
                  }}
                  className="px-8 text-terracotta font-black uppercase tracking-widest"
                >
                  Cancelar
                </NeumorphicButton>
              )}
            </div>
            {status === 'success' && <p className="text-center text-forest-green font-black uppercase tracking-widest text-[10px] animate-pulse">¡Operación completada con éxito! ✨</p>}
            {status === 'error' && <p className="text-center text-terracotta font-black uppercase tracking-widest text-[10px]">Error al procesar la solicitud. Verifica los datos. ❌</p>}
          </div>
        </form>
      </NeumorphicCard>

      <div className="space-y-6">
        <h3 className="text-3xl font-black text-deep-green font-lora pl-4">Inventario de Juegos</h3>
        <div className="grid grid-cols-1 gap-6">
          {games.map(game => (
            <NeumorphicCard key={game.id} className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="w-16 h-16 rounded-cafe bg-cafe-bg shadow-neu-pressed flex items-center justify-center text-2xl overflow-hidden flex-shrink-0">
                {game.imageUrl ? (
                  <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover" />
                ) : '🎲'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-xl font-black text-deep-green font-lora">{game.name}</h4>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-forest-green/10 text-forest-green">
                    {game.category}
                  </span>
                </div>
                <p className="text-sm text-deep-green/60 italic line-clamp-1">{game.description}</p>
                <div className="flex gap-4 mt-3">
                  <span className="text-[10px] font-bold text-deep-green/40 uppercase tracking-widest">
                    👥 {game.minPlayers}-{game.maxPlayers} players
                  </span>
                  <span className="text-[10px] font-bold text-deep-green/40 uppercase tracking-widest">
                    ⏱️ {game.duration} min
                  </span>
                  <span className="text-[10px] font-bold text-deep-green/40 uppercase tracking-widest">
                    📦 Stock: {game.stock}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <NeumorphicButton onClick={() => handleEdit(game)} className="px-6 py-2 text-xs font-black uppercase tracking-widest text-forest-green hover:text-deep-green">
                  Editar
                </NeumorphicButton>
                <NeumorphicButton onClick={() => handleDelete(game.id)} className="px-6 py-2 text-xs font-black uppercase tracking-widest text-terracotta">
                  Borrar
                </NeumorphicButton>
              </div>
            </NeumorphicCard>
          ))}
          {games.length === 0 && (
            <p className="text-center py-10 text-forest-green/40 font-bold italic">No hay juegos registrados aún.</p>
          )}
        </div>
      </div>
    </div>
  );
};
