import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Select from 'react-select';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { Check, Gamepad2, ShoppingCart, Plus, Minus, Info } from 'lucide-react';

interface Category { id: string; name: string; }
interface DifficultyLevel { id: string; name: string; }

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
  stock: number; // Stock para reserva en mesa
  stockVenta: number; // Stock físico para venta
  price: number | null; // Precio de venta
}

export const GameCatalogView: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<{value: string, label: string}[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<{value: string, label: string} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, items: cartItems } = useCart();
  
  // Modes
  const queryMode = searchParams.get('mode');
  const [viewMode, setViewMode] = useState<'BUY' | 'RESERVE'>(() => (queryMode === 'select' || queryMode === 'reserva') ? 'RESERVE' : 'BUY');
  const isSelectMode = queryMode === 'select';

  const [selectedGames, setSelectedGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem('temp_selected_games');
    return saved ? JSON.parse(saved) : [];
  });

  const [showModal, setShowModal] = useState<{show: boolean, type: 'CONFIRM_RESERVE' | 'ADD_TO_CART', game: Game | null}>({show: false, type: 'CONFIRM_RESERVE', game: null});
  const [quantity, setQuantity] = useState(1);

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

  useEffect(() => {
    localStorage.setItem('temp_selected_games', JSON.stringify(selectedGames));
  }, [selectedGames]);

  const handleSelectGame = (game: Game) => {
    if (selectedGames.length >= 2) return alert('Máximo 2 juegos');
    if (selectedGames.some(g => g.id === game.id)) return alert('Ya seleccionado');
    const newList = [...selectedGames, game];
    setSelectedGames(newList);
    setShowModal({ show: true, type: 'CONFIRM_RESERVE', game });
  };

  const handleAddToCart = (game: Game) => {
    if (!user) return navigate('/login');
    setShowModal({ show: true, type: 'ADD_TO_CART', game });
    setQuantity(1);
  };

  const confirmAddToCart = () => {
    if (showModal.game) {
      addToCart({
        id: showModal.game.id,
        name: showModal.game.name,
        price: showModal.game.price || 0,
        quantity: quantity,
        imageUrl: showModal.game.imageUrl || undefined
      });
      setShowModal({ show: false, type: 'ADD_TO_CART', game: null });
    }
  };

  const categoryOptions = Array.from(new Set(games.flatMap(g => g.categories.map(c => c.name)).filter(Boolean))).sort().map(c => ({ value: c as string, label: c as string }));
  const difficultyOptions = Array.from(new Set(games.map(g => g.difficulty?.name).filter(Boolean))).sort().map(d => ({ value: d as string, label: d as string }));

  let filteredGames = games.filter(g => {
    if (viewMode === 'BUY') return g.stockVenta > 0 && g.price && g.price > 0;
    return g.stock > 0;
  });
  
  if (searchTerm.trim() !== '') {
    const lowerSearch = searchTerm.toLowerCase();
    filteredGames = filteredGames.filter(g => 
      g.name.toLowerCase().includes(lowerSearch) || 
      (g.description && g.description.toLowerCase().includes(lowerSearch))
    );
  }

  if (selectedCategories.length > 0) {
    const catValues = selectedCategories.map(c => c.value);
    filteredGames = filteredGames.filter(g => catValues.every(catFilter => g.categories.some(c => c.name === catFilter)));
  }

  if (selectedDifficulty) {
    filteredGames = filteredGames.filter(g => g.difficulty && g.difficulty.name === selectedDifficulty.value);
  }

  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGames = filteredGames.slice(startIndex, startIndex + itemsPerPage);

  const selectStyles: any = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: '#EDF1F4',
      borderRadius: '9999px',
      border: 'none',
      boxShadow: state.isFocused ? 'inset 4px 4px 8px rgba(163, 177, 198, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.6)' : 'inset 2px 2px 5px rgba(163, 177, 198, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.8)',
      padding: '4px 8px',
      minHeight: '48px',
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
    })
  };

  return (
    <div className="container mx-auto px-4 py-12 pb-32">
      {/* Selection Banner */}
      {isSelectMode && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
           <NeumorphicCard className="p-6 bg-deep-green text-white border-none flex items-center justify-between gap-8 shadow-2xl">
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Gamepad2 />
                 </div>
                 <div>
                    <h4 className="text-xl font-black uppercase tracking-tighter">Selección Actual</h4>
                    <p className="text-[10px] font-black uppercase text-white/50">{selectedGames.length} / 2 juegos</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <NeumorphicButton variant="flat" className="bg-white text-deep-green px-8 py-3 font-black uppercase text-[10px]" onClick={() => navigate('/reserva')}>Confirmar</NeumorphicButton>
              </div>
           </NeumorphicCard>
        </div>
      )}

      {/* Cart Button */}
      {viewMode === 'BUY' && cartItems.length > 0 && (
         <div className="fixed top-24 right-8 z-50">
            <Link to="/carrito">
               <NeumorphicButton className="p-5 flex items-center gap-4 bg-terracotta text-white border-none shadow-xl">
                  <div className="relative">
                     <ShoppingCart size={24} />
                     <span className="absolute -top-3 -right-3 w-6 h-6 bg-white text-terracotta rounded-full flex items-center justify-center text-[10px] font-black">{cartItems.length}</span>
                  </div>
                  <span className="font-black uppercase text-[10px] tracking-widest hidden md:block">Ver Carrito</span>
               </NeumorphicButton>
            </Link>
         </div>
      )}

      <div className="flex flex-col mb-16 gap-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-7xl font-black text-deep-green tracking-tighter leading-none mb-2 font-lora">Ludoteca</h1>
            <p className="text-forest-green font-bold uppercase tracking-[0.4em] text-[10px] ml-1">Catálogo de Aventuras</p>
          </div>
          
          <div className="flex gap-2 p-2 bg-cafe-bg shadow-neu-pressed rounded-full w-full md:w-auto">
             <button onClick={() => setViewMode('BUY')} className={`flex-1 md:w-40 py-4 rounded-full text-[10px] font-black tracking-widest transition-all ${viewMode === 'BUY' ? 'bg-forest-green text-white shadow-md' : 'text-deep-green/40'}`}>MODO COMPRA</button>
             <button onClick={() => setViewMode('RESERVE')} className={`flex-1 md:w-40 py-4 rounded-full text-[10px] font-black tracking-widest transition-all ${viewMode === 'RESERVE' ? 'bg-terracotta text-white shadow-md' : 'text-deep-green/40'}`}>MODO RESERVA</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-cafe-surface p-8 rounded-[2.5rem] shadow-neu-flat border border-white/20">
           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/30 ml-4">Nombre</label>
              <input type="text" placeholder="Ej. Catan..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-cafe-bg text-deep-green px-6 py-4 rounded-full shadow-neu-pressed border-none outline-none font-bold" />
           </div>
           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/30 ml-4">Categorías</label>
              <Select isMulti options={categoryOptions} value={selectedCategories} onChange={setSelectedCategories as any} styles={selectStyles} placeholder="Todas..." />
           </div>
           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/30 ml-4">Dificultad</label>
              <Select options={difficultyOptions} value={selectedDifficulty} onChange={setSelectedDifficulty as any} styles={selectStyles} placeholder="Cualquiera..." isClearable />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {paginatedGames.map(game => {
          const [flipped, setFlipped] = useState(false);
          const isSelected = selectedGames.some(sg => sg.id === game.id);
          return (
            <div key={game.id} className="h-[520px] relative transition-all" style={{ perspective: 1000 }} onClick={() => setFlipped(!flipped)}>
               <div className={`relative w-full h-full text-center transition-all duration-700 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
                  {/* Front */}
                  <NeumorphicCard className={`absolute inset-0 [backface-visibility:hidden] p-8 flex flex-col justify-between ${isSelected ? 'ring-2 ring-terracotta border-terracotta' : 'border-white/10'}`}>
                     <div className="h-60 bg-cafe-bg rounded-cafe shadow-neu-pressed flex items-center justify-center relative overflow-hidden flex-shrink-0">
                        {game.imageUrl ? <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover" /> : <Gamepad2 size={60} className="opacity-10" />}
                        {viewMode === 'BUY' && (
                           <div className="absolute top-4 right-4 bg-terracotta text-white px-4 py-2 rounded-full font-black text-sm shadow-xl">${game.price}</div>
                        )}
                        {isSelected && (
                           <div className="absolute inset-0 bg-terracotta/20 backdrop-blur-[2px] flex items-center justify-center"><Check size={60} className="text-white" /></div>
                        )}
                     </div>
                     <div className="flex-1 flex flex-col justify-center py-6">
                        <h3 className="text-3xl font-black text-deep-green font-lora leading-tight">{game.name}</h3>
                        <div className="flex flex-wrap justify-center gap-1 mt-3">
                           {game.categories.map(c => <span key={c.id} className="text-[8px] font-black px-2 py-0.5 bg-forest-green/10 text-forest-green uppercase rounded-full">{c.name}</span>)}
                        </div>
                     </div>
                     <div className="flex items-center justify-center gap-2 opacity-30 text-[10px] font-black uppercase tracking-widest"><Info size={12}/> Ver detalles</div>
                  </NeumorphicCard>

                  {/* Back */}
                  <NeumorphicCard className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] p-10 flex flex-col justify-between">
                     <div className="space-y-4">
                        <h4 className="text-xl font-black text-deep-green">{game.name}</h4>
                        <p className="text-xs text-deep-green/60 leading-relaxed max-h-40 overflow-y-auto pr-2">{game.description || 'Sin descripción disponible.'}</p>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 py-6 border-y border-deep-green/5">
                        <div>
                           <p className="text-[8px] font-black text-deep-green/30 uppercase">Uso</p>
                           <p className="text-xs font-bold">{game.stock} Dispo. Reserva</p>
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-deep-green/30 uppercase">Venta</p>
                           <p className="text-xs font-bold">{game.stockVenta} En Stock</p>
                        </div>
                     </div>

                     <div className="pt-6">
                        {viewMode === 'BUY' ? (
                          <NeumorphicButton 
                            className="w-full bg-forest-green text-white py-4 font-black uppercase text-[10px] tracking-widest shadow-neu-flat border-none"
                            onClick={(e) => { e.stopPropagation(); handleAddToCart(game); }}
                          >
                             Agregar al carrito
                          </NeumorphicButton>
                        ) : (
                          <NeumorphicButton 
                             className={`w-full py-4 font-black uppercase text-[10px] tracking-widest border-none ${isSelected ? 'bg-terracotta text-white' : 'bg-forest-green text-white shadow-neu-flat'}`}
                             onClick={(e) => {
                                e.stopPropagation();
                                if (isSelected) setSelectedGames(prev => prev.filter(sg => sg.id !== game.id));
                                else handleSelectGame(game);
                             }}
                          >
                             {isSelected ? 'Quitar de lista' : 'Seleccionar p/ reserva'}
                          </NeumorphicButton>
                        )}
                     </div>
                  </NeumorphicCard>
               </div>
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-16 gap-6">
          <NeumorphicButton onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={currentPage === 1 ? 'opacity-30' : ''}>&larr;</NeumorphicButton>
          <span className="text-[10px] font-black text-deep-green/40 uppercase tracking-widest">Pág {currentPage} / {totalPages}</span>
          <NeumorphicButton onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={currentPage === totalPages ? 'opacity-30' : ''}>&rarr;</NeumorphicButton>
        </div>
      )}

      {/* MODALS */}
      {showModal.show && showModal.game && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
           {showModal.type === 'CONFIRM_RESERVE' ? (
              <NeumorphicCard className="w-full max-w-sm p-12 text-center space-y-8 animate-in zoom-in duration-300">
                 <div className="w-20 h-20 bg-forest-green/10 rounded-full flex items-center justify-center mx-auto text-forest-green"><Check size={40} /></div>
                 <div>
                    <h3 className="text-2xl font-black text-deep-green font-lora">Juego Seleccionado</h3>
                    <p className="text-xs text-forest-green font-bold opacity-70 italic mt-2">"{showModal.game.name}" para tu mesa</p>
                 </div>
                 <div className="space-y-4">
                    {selectedGames.length < 2 && (
                       <NeumorphicButton variant="flat" className="w-full py-4 text-[10px] font-black uppercase text-forest-green" onClick={() => setShowModal({show: false, type: 'CONFIRM_RESERVE', game: null})}>Elegir otro (Máx 2)</NeumorphicButton>
                    )}
                    <NeumorphicButton className="w-full bg-forest-green text-white py-4 font-black uppercase text-[10px] shadow-neu-flat border-none" onClick={() => navigate('/reserva')}>Continuar Reserva</NeumorphicButton>
                 </div>
              </NeumorphicCard>
           ) : (
              <NeumorphicCard className="w-full max-w-md p-12 text-center space-y-8 animate-in slide-in-from-bottom-8 duration-300">
                 <div className="space-y-2">
                    <h3 className="text-3xl font-black text-deep-green font-lora">¿Cuántos para llevar?</h3>
                    <p className="text-sm font-bold text-deep-green/40 uppercase tracking-widest">Stock Disponible: {showModal.game.stockVenta}</p>
                 </div>
                 
                 <div className="flex items-center justify-center gap-8 py-8">
                    <NeumorphicButton disabled={quantity <= 1} onClick={() => setQuantity(q => q - 1)} className="w-16 h-16 rounded-full flex items-center justify-center text-deep-green"><Minus/></NeumorphicButton>
                    <span className="text-6xl font-black text-deep-green font-lora">{quantity}</span>
                    <NeumorphicButton disabled={quantity >= showModal.game.stockVenta} onClick={() => setQuantity(q => q + 1)} className="w-16 h-16 rounded-full flex items-center justify-center text-deep-green"><Plus/></NeumorphicButton>
                 </div>

                 <div className="space-y-4">
                    <NeumorphicButton className="w-full bg-terracotta text-white py-5 font-black uppercase tracking-[0.2em] text-[11px] shadow-neu-flat border-none" onClick={confirmAddToCart}>Sumar al Carrito</NeumorphicButton>
                    <NeumorphicButton variant="flat" className="w-full py-4 text-[10px] font-black uppercase text-deep-green/40" onClick={() => setShowModal({show: false, type: 'ADD_TO_CART', game: null})}>Cancelar</NeumorphicButton>
                 </div>
              </NeumorphicCard>
           )}
        </div>
      )}
    </div>
  );
};
