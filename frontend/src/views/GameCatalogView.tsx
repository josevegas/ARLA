import React, { useState } from 'react';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';

interface Game {
  id: number;
  title: string;
  category: string;
  players: string;
  duration: string;
  difficulty: 'Fácil' | 'Media' | 'Difícil';
  image: string;
  color: string;
}

const GAMES: Game[] = [
  { id: 1, title: 'Catan', category: 'Estrategia', players: '3-4', duration: '60-90 min', difficulty: 'Media', image: '🏠', color: 'bg-orange-50' },
  { id: 2, title: 'Dixit', category: 'Creatividad', players: '3-6', duration: '30 min', difficulty: 'Fácil', image: '🎨', color: 'bg-purple-50' },
  { id: 3, title: 'Ticket to Ride', category: 'Familiar', players: '2-5', duration: '45 min', difficulty: 'Fácil', image: '🚂', color: 'bg-blue-50' },
  { id: 4, title: '7 Wonders', category: 'Cartas', players: '2-7', duration: '30 min', difficulty: 'Media', image: '🏛️', color: 'bg-yellow-50' },
  { id: 5, title: 'Pandemic', category: 'Cooperativo', players: '2-4', duration: '45 min', difficulty: 'Media', image: '🧪', color: 'bg-green-50' },
  { id: 6, title: 'Exploding Kittens', category: 'Party', players: '2-5', duration: '15 min', difficulty: 'Fácil', image: '🐱', color: 'bg-red-50' },
];

export const GameCatalogView: React.FC = () => {
  const [filter, setFilter] = useState('Todos');
  const categories = ['Todos', 'Estrategia', 'Cooperativo', 'Party', 'Familiar'];

  const filteredGames = filter === 'Todos' ? GAMES : GAMES.filter(g => g.category === filter);

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
            <div className={`h-56 ${game.color} rounded-cafe flex items-center justify-center text-8xl shadow-neu-pressed mb-8 group-hover:scale-[1.03] transition-transform duration-500 relative`}>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {game.image}
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-forest-green bg-forest-green/10 px-3 py-1 rounded-full uppercase tracking-widest">
                {game.category}
              </span>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                game.difficulty === 'Fácil' ? 'text-green-700 bg-green-100/50' : 
                game.difficulty === 'Media' ? 'text-yellow-700 bg-yellow-100/50' : 'text-red-700 bg-red-100/50'
              }`}>
                {game.difficulty}
              </span>
            </div>
            
            <h3 className="text-3xl font-black text-deep-green mb-4 leading-tight font-lora">{game.title}</h3>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-widest text-deep-green/30">Jugadores</span>
                <span className="font-bold text-deep-green">{game.players}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] uppercase font-black tracking-widest text-deep-green/30">Duración</span>
                <span className="font-bold text-deep-green">{game.duration}</span>
              </div>
            </div>
            
            <NeumorphicButton className="w-full py-4 text-sm font-black uppercase tracking-widest bg-forest-green text-cafe-surface border-none shadow-neu-flat">
              Reservar Mesa & Juego
            </NeumorphicButton>
          </NeumorphicCard>
        ))}
      </div>
    </div>
  );
};
