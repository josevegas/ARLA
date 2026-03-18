import React, { useState, useEffect } from 'react';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';

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

export const GameCatalogView: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filter, setFilter] = useState('Todos');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const resp = await fetch('http://localhost:3000/api/admin/games');
        const data = await resp.json();
        setGames(data);
      } catch (err) {
        console.error('Error fetching games:', err);
      }
    };
    fetchGames();
  }, []);

  const categories = ['Todos', ...new Set(games.map(g => g.category).filter(Boolean) as string[])];

  const filteredGames = filter === 'Todos' 
    ? games 
    : games.filter(g => g.category === filter);

  const getDifficultyLabel = (diff: string | null) => {
    switch (diff) {
      case 'EASY': return 'Fácil';
      case 'MEDIUM': return 'Media';
      case 'HARD': return 'Difícil';
      default: return 'N/A';
    }
  };

  const getDifficultyColor = (diff: string | null) => {
    switch (diff) {
      case 'EASY': return 'text-green-700 bg-green-100/50';
      case 'MEDIUM': return 'text-yellow-700 bg-yellow-100/50';
      case 'HARD': return 'text-red-700 bg-red-100/50';
      default: return 'text-gray-700 bg-gray-100/50';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h1 className="text-6xl font-black text-deep-green tracking-tighter leading-none mb-2 font-lora">Ludoteca</h1>
          <p className="text-forest-green font-bold uppercase tracking-[0.3em] text-[10px] ml-1">Catálogo de Aventuras</p>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto">
          {categories.map(cat => (
            <NeumorphicButton 
              key={cat}
              variant={filter === cat ? 'pressed' : 'flat'}
              onClick={() => setFilter(cat)}
              className={`text-[10px] font-black uppercase tracking-widest py-3 px-8 whitespace-nowrap transition-colors ${filter === cat ? 'text-forest-green' : 'text-deep-green/50'}`}
            >
              {cat}
            </NeumorphicButton>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {filteredGames.map(game => (
          <NeumorphicCard key={game.id} className="group hover:-translate-y-2 transition-all duration-500 border border-white/10 overflow-hidden">
            <div className="h-56 bg-cafe-bg rounded-cafe flex items-center justify-center text-8xl shadow-neu-pressed mb-8 group-hover:scale-[1.03] transition-transform duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
              {game.imageUrl ? (
                <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover" />
              ) : (
                "🎲"
              )}
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-forest-green bg-forest-green/10 px-3 py-1 rounded-full uppercase tracking-widest">
                {game.category}
              </span>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${getDifficultyColor(game.difficulty)}`}>
                {getDifficultyLabel(game.difficulty)}
              </span>
            </div>
            
            <h3 className="text-3xl font-black text-deep-green mb-4 leading-tight font-lora">{game.name}</h3>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-widest text-deep-green/30">Jugadores</span>
                <span className="font-bold text-deep-green">{game.minPlayers}-{game.maxPlayers}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] uppercase font-black tracking-widest text-deep-green/30">Duración</span>
                <span className="font-bold text-deep-green">{game.duration} min</span>
              </div>
            </div>
            
            <NeumorphicButton className="w-full py-4 text-sm font-black uppercase tracking-widest bg-forest-green text-cafe-surface border-none shadow-neu-flat">
              Reservar Mesa & Juego
            </NeumorphicButton>
          </NeumorphicCard>
        ))}
        {filteredGames.length === 0 && (
          <div className="col-span-full text-center py-20">
            <p className="text-xl font-black text-forest-green/40 italic">No se han encontrado juegos en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
};
