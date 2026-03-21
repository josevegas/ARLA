import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';

interface Category {
  id: string;
  name: string;
}

interface DifficultyLevel {
  id: string;
  name: string;
}

interface Game {
  id: string;
  name: string;
  description: string | null;
  categories: Category[];
  imageUrl: string | null;
  minPlayers: number | null;
  maxPlayers: number | null;
  difficulty: DifficultyLevel | null;
  duration: number | null;
  stock: number;
}

export const GameCatalogView: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<{value: string, label: string}[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<{value: string, label: string} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const categoryOptions = Array.from(new Set(games.flatMap(g => g.categories.map(c => c.name)).filter(Boolean))).sort().map(c => ({ value: c as string, label: c as string }));
  const difficultyOptions = Array.from(new Set(games.map(g => g.difficulty?.name).filter(Boolean))).sort().map(d => ({ value: d as string, label: d as string }));

  let filteredGames = games;
  
  if (searchTerm.trim() !== '') {
    const lowerSearch = searchTerm.toLowerCase();
    filteredGames = filteredGames.filter(g => 
      g.name.toLowerCase().includes(lowerSearch) || 
      (g.description && g.description.toLowerCase().includes(lowerSearch))
    );
  }

  if (selectedCategories.length > 0) {
    const catValues = selectedCategories.map(c => c.value);
    // AND condition: game must have all selected categories
    filteredGames = filteredGames.filter(g => 
      catValues.every(catFilter => g.categories.some(c => c.name === catFilter))
    );
  }

  if (selectedDifficulty) {
    filteredGames = filteredGames.filter(g => g.difficulty && g.difficulty.name === selectedDifficulty.value);
  }

  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGames = filteredGames.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, selectedDifficulty]);

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: '#EDF1F4',
      borderRadius: '9999px',
      border: 'none',
      boxShadow: state.isFocused ? 'inset 4px 4px 8px rgba(163, 177, 198, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.6)' : 'inset 2px 2px 5px rgba(163, 177, 198, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.8)',
      padding: '4px 8px',
      minHeight: '48px',
      cursor: 'pointer'
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: '16px',
      boxShadow: '4px 4px 12px rgba(163, 177, 198, 0.4), -4px -4px 12px rgba(255, 255, 255, 0.6)',
      backgroundColor: '#EDF1F4',
      zIndex: 50,
      border: 'none',
      padding: '8px'
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? 'rgba(74, 93, 35, 0.1)' : 'transparent',
      color: state.isFocused ? '#4A5D23' : '#2C3531',
      cursor: 'pointer',
      fontWeight: 'bold',
      borderRadius: '8px',
      margin: '2px 0',
      padding: '10px 16px',
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: 'transparent',
      boxShadow: '2px 2px 5px rgba(163, 177, 198, 0.3), -2px -2px 5px rgba(255, 255, 255, 0.5)',
      border: '1px solid rgba(74, 93, 35, 0.2)',
      borderRadius: '9999px',
      padding: '0 2px'
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: '#4A5D23',
      fontWeight: '900',
      fontSize: '11px',
      textTransform: 'uppercase'
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: '#4A5D23',
      ':hover': {
        color: '#CB6843',
        backgroundColor: 'transparent'
      }
    }),
    placeholder: (base: any) => ({
      ...base,
      color: 'rgba(44, 53, 49, 0.4)',
      fontWeight: 'bold'
    }),
    input: (base: any) => ({
      ...base,
      color: '#2C3531',
      fontWeight: '600'
    })
  };

  const GameItemCard = ({ game }: { game: Game }) => {
    const [isFlipped, setIsFlipped] = useState(false);
  
    return (
      <div 
        className="group w-full cursor-pointer h-full min-h-[480px]"
        style={{ perspective: 1200 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
          
          {/* Front */}
          <NeumorphicCard className="absolute inset-0 [backface-visibility:hidden] flex flex-col bg-cafe-surface p-6 border border-white/10 hover:-translate-y-2 transition-transform duration-500">
            <div className="h-56 bg-cafe-bg rounded-cafe flex items-center justify-center text-8xl shadow-neu-pressed mb-8 relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
              {game.imageUrl ? (
                <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover" />
              ) : (
                "🎲"
              )}
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <div className="flex flex-wrap gap-1">
                  {game.categories.map(cat => (
                    <span key={cat.id} className="text-[9px] font-black text-forest-green bg-forest-green/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                      {cat.name}
                    </span>
                  ))}
                </div>
                {game.difficulty && (
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest text-coffee-bean bg-coffee-bean/5`}>
                    {game.difficulty.name}
                  </span>
                )}
              </div>
              
              <h3 className="text-3xl font-black text-deep-green mb-4 leading-tight font-lora">{game.name}</h3>
              
              <div className="mt-auto flex justify-center pb-2">
                 <span className="text-[10px] uppercase font-black tracking-widest text-deep-green/30 animate-pulse">Click para ver más</span>
              </div>
            </div>
          </NeumorphicCard>
  
          {/* Back */}
          <NeumorphicCard className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col bg-cafe-surface p-8 border border-white/10 overflow-hidden text-center z-10">
              <h3 className="text-2xl font-black text-deep-green mb-4 leading-tight font-lora line-clamp-2">{game.name}</h3>
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden shadow-neu-pressed mb-4 flex-shrink-0 bg-cafe-bg flex items-center justify-center text-5xl">
                {game.imageUrl ? (
                  <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover" />
                ) : (
                  "🎲"
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto mb-4 pr-2">
                <p className="text-sm font-medium text-deep-green/70 italic text-justify">
                  {game.description || "Sin descripción disponible."}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-deep-green/10">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black tracking-widest text-deep-green/40">Jugadores</span>
                  <span className="font-bold text-deep-green">{game.minPlayers}-{game.maxPlayers}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black tracking-widest text-deep-green/40">Duración</span>
                  <span className="font-bold text-deep-green">{game.duration} min</span>
                </div>
              </div>
  
              <NeumorphicButton 
                className="w-full py-4 text-xs font-black uppercase tracking-widest bg-forest-green text-white border-none shadow-neu-flat hover:scale-105 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Reservar
              </NeumorphicButton>
          </NeumorphicCard>
  
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col mb-16 gap-8">
        <div>
          <h1 className="text-6xl font-black text-deep-green tracking-tighter leading-none mb-2 font-lora">Ludoteca</h1>
          <p className="text-forest-green font-bold uppercase tracking-[0.3em] text-[10px] ml-1">Catálogo de Aventuras</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-cafe-surface p-6 rounded-3xl shadow-neu-flat">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-deep-green/60 mb-2 pl-4">Buscar</label>
            <input
              type="text"
              placeholder="Ej. Catan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-cafe-bg text-deep-green px-6 py-3 rounded-full shadow-neu-pressed focus:outline-none focus:ring-2 focus:ring-forest-green/20 placeholder-deep-green/30 font-medium border-none h-[48px]"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-deep-green/60 mb-2 pl-4">Categorías</label>
            <Select
              isMulti
              options={categoryOptions}
              value={selectedCategories}
              onChange={setSelectedCategories as any}
              placeholder="Categorías... (Todas)"
              styles={selectStyles}
              noOptionsMessage={() => "No hay más categorías"}
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-deep-green/60 mb-2 pl-4">Dificultad</label>
            <Select
              options={difficultyOptions}
              value={selectedDifficulty}
              onChange={setSelectedDifficulty as any}
              placeholder="Dificultad..."
              isClearable
              styles={selectStyles}
              noOptionsMessage={() => "No hay más dificultades"}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {paginatedGames.map(game => (
          <GameItemCard key={game.id} game={game} />
        ))}
        {paginatedGames.length === 0 && (
          <div className="col-span-full text-center py-20">
            <p className="text-xl font-black text-forest-green/40 italic">No se han encontrado juegos.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-16 gap-4">
          <NeumorphicButton
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            &lt; Anterior
          </NeumorphicButton>
          <span className="text-deep-green font-bold mx-4">
            Página {currentPage} de {totalPages}
          </span>
          <NeumorphicButton
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Siguiente &gt;
          </NeumorphicButton>
        </div>
      )}
    </div>
  );
};
