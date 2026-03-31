import React, { useState, useEffect } from 'react';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { useAuth } from '../context/AuthContext';
import { Search, ChevronLeft, ChevronRight, Edit3, Trash2, Package, Tag } from 'lucide-react';

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
  difficultyId: string | null;
  duration: number | null;
  stock: number;
  stockVenta: number;
  price: number | null;
}

export const GameManagement: React.FC = () => {
  const { token } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [difficulties, setDifficulties] = useState<DifficultyLevel[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  
  const [activeGame, setActiveGame] = useState<Partial<Game>>({
    name: '', description: '', imageUrl: '', minPlayers: 1, maxPlayers: 4, 
    difficultyId: '', duration: 30, stock: 1, stockVenta: 0, price: 0
  });

  const fetchGames = async () => {
    try {
      const resp = await fetch('http://localhost:3000/api/admin/games');
      const data = await resp.json();
      setGames(data);
    } catch (err) { console.error(err); }
  };

  const fetchMetadata = async () => {
    try {
      const [catResp, diffResp] = await Promise.all([
        fetch('http://localhost:3000/api/admin/game-categories'),
        fetch('http://localhost:3000/api/admin/game-difficulties')
      ]);
      setCategories(await catResp.json());
      setDifficulties(await diffResp.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchGames(); fetchMetadata(); }, []);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    const dataToSave = {
      ...activeGame,
      categoryIds: selectedCategoryIds,
      stock: Number(activeGame.stock),
      stockVenta: Number(activeGame.stockVenta),
      price: Number(activeGame.price),
      minPlayers: Number(activeGame.minPlayers),
      maxPlayers: Number(activeGame.maxPlayers),
      duration: Number(activeGame.duration)
    };

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing 
      ? `http://localhost:3000/api/admin/games/${activeGame.id}`
      : 'http://localhost:3000/api/admin/games';

    try {
      const resp = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(dataToSave)
      });

      if (resp.ok) {
        await fetchGames();
        setIsEditing(false);
        resetForm();
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else { setStatus('error'); }
    } catch (err) { setStatus('error'); }
  };

  const resetForm = () => {
    setActiveGame({ name: '', description: '', imageUrl: '', minPlayers: 1, maxPlayers: 4, difficultyId: difficulties[0]?.id || '', duration: 30, stock: 1, stockVenta: 0, price: 0 });
    setSelectedCategoryIds([]);
    setIsEditing(false);
  };

  const handleEdit = (game: Game) => {
    setActiveGame({ ...game, description: game.description || '', imageUrl: game.imageUrl || '', difficultyId: game.difficultyId || '' });
    setSelectedCategoryIds(game.categories?.map(c => c.id) || []);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este juego?')) return;
    try {
      await fetch(`http://localhost:3000/api/admin/games/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchGames();
    } catch (err) { console.error(err); }
  };

  const filteredGames = games.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE) || 1;
  const paginatedGames = filteredGames.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const inputClass = "w-full px-5 py-4 rounded-3xl bg-cafe-bg shadow-neu-pressed border-none outline-none text-deep-green font-bold text-sm focus:ring-2 focus:ring-forest-green/20 transition-all";

  return (
    <div className="space-y-16 py-8">
      <NeumorphicCard className="p-10 border-t-8 border-forest-green relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-forest-green/5 rounded-bl-[5rem] -z-10" />
        <h3 className="text-4xl font-black text-deep-green mb-10 font-lora flex items-center gap-4">
           {isEditing ? <Edit3 /> : <Plus />} {isEditing ? 'Perfeccionar Juego' : 'Nuevo Integrante de Ludoteca'}
        </h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/30 ml-4">Nombre Comercial</label>
            <input className={inputClass} value={activeGame.name} onChange={e => setActiveGame({...activeGame, name: e.target.value})} required />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/30 ml-4">Dificultad</label>
            <select className={inputClass} value={activeGame.difficultyId || ''} onChange={e => setActiveGame({...activeGame, difficultyId: e.target.value})} required>
              <option value="" disabled>Elegir nivel</option>
              {difficulties.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div className="md:col-span-3 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/30 ml-4">Enlace de Imagen</label>
            <input className={inputClass} placeholder="https://..." value={activeGame.imageUrl || ''} onChange={e => setActiveGame({...activeGame, imageUrl: e.target.value})} />
          </div>

          <div className="md:col-span-3 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/30 ml-4">Categorías (Múltiple)</label>
            <div className="flex flex-wrap gap-2 p-5 rounded-3xl bg-cafe-bg shadow-neu-pressed">
               {categories.map(cat => (
                 <button
                   key={cat.id} type="button"
                   onClick={() => setSelectedCategoryIds(prev => prev.includes(cat.id) ? prev.filter(id => id !== cat.id) : [...prev, cat.id])}
                   className={`px-4 py-2 rounded-full text-[9px] font-black uppercase transition-all ${selectedCategoryIds.includes(cat.id) ? 'bg-forest-green text-white shadow-neu-flat' : 'text-deep-green/40 hover:text-deep-green'}`}
                 >
                   {cat.name}
                 </button>
               ))}
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/30 ml-4">Breve Reseña</label>
            <textarea className={`${inputClass} h-32 pt-5 resize-none`} value={activeGame.description || ''} onChange={e => setActiveGame({...activeGame, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/30 ml-4">Min Jugadores</label>
                <input type="number" className={inputClass} value={activeGame.minPlayers || ''} onChange={e => setActiveGame({...activeGame, minPlayers: e.target.value ? parseInt(e.target.value) : null})} />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/30 ml-4">Max Jugadores</label>
                <input type="number" className={inputClass} value={activeGame.maxPlayers || ''} onChange={e => setActiveGame({...activeGame, maxPlayers: e.target.value ? parseInt(e.target.value) : null})} />
             </div>
          </div>

          <div className="grid grid-cols-3 gap-4 md:col-span-2">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/30 ml-4">Stock Reserva</label>
                <input type="number" className={inputClass} value={activeGame.stock || 0} onChange={e => setActiveGame({...activeGame, stock: parseInt(e.target.value) || 0})} />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/30 ml-4">Stock Venta</label>
                <input type="number" className={inputClass} value={activeGame.stockVenta || 0} onChange={e => setActiveGame({...activeGame, stockVenta: parseInt(e.target.value) || 0})} />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/30 ml-4">Precio Venta ($)</label>
                <input type="number" className={inputClass} value={activeGame.price || 0} onChange={e => setActiveGame({...activeGame, price: parseFloat(e.target.value) || 0})} />
             </div>
          </div>

          <div className="md:col-span-3 flex gap-4 pt-6">
             <NeumorphicButton type="submit" className="flex-1 py-5 bg-forest-green text-white font-black uppercase tracking-widest text-[11px] shadow-neu-flat border-none">
                {status === 'loading' ? 'Procesando...' : isEditing ? 'Guardar Cambios' : 'Registrar Juego'}
             </NeumorphicButton>
             {isEditing && (
               <NeumorphicButton type="button" variant="flat" onClick={resetForm} className="px-12 text-terracotta font-black uppercase text-[10px]">Cancelar</NeumorphicButton>
             )}
          </div>
        </form>
      </NeumorphicCard>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center bg-cafe-surface p-6 rounded-[2.5rem] shadow-neu-flat border border-white/10 gap-6">
           <h3 className="text-3xl font-black text-deep-green font-lora ml-4">Inventario Actual</h3>
           <div className="relative w-full md:w-96">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-deep-green/20" size={18} />
              <input 
                type="text" placeholder="Buscar por nombre..." 
                className="w-full pl-14 pr-6 py-4 rounded-full bg-cafe-bg shadow-neu-pressed border-none outline-none text-deep-green font-bold text-sm"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
           {paginatedGames.map(game => (
             <NeumorphicCard key={game.id} className="p-8 flex flex-col md:flex-row items-center gap-8 group hover:scale-[1.01] transition-transform">
                <div className="w-24 h-24 rounded-3xl bg-cafe-bg shadow-neu-pressed flex items-center justify-center text-4xl overflow-hidden flex-shrink-0 border border-white/20">
                   {game.imageUrl ? <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover" /> : '🎲'}
                </div>
                <div className="flex-1 space-y-2 text-center md:text-left">
                   <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                      <h4 className="text-2xl font-black text-deep-green font-lora leading-none">{game.name}</h4>
                      {game.difficulty && <span className="text-[8px] font-black uppercase px-2 py-1 rounded-full bg-coffee-bean/5 text-coffee-bean/40 border border-coffee-bean/10">{game.difficulty.name}</span>}
                   </div>
                   <div className="flex flex-wrap justify-center md:justify-start gap-1">
                      {game.categories?.map(c => <span key={c.id} className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-forest-green/10 text-forest-green">{c.name}</span>)}
                   </div>
                   <div className="flex justify-center md:justify-start gap-6 pt-3">
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-deep-green/30"><Package size={12}/> Res: {game.stock}</div>
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-deep-green/30"><Package size={12}/> Venta: {game.stockVenta}</div>
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-terracotta"><Tag size={12}/> ${game.price}</div>
                   </div>
                </div>
                <div className="flex gap-3">
                   <NeumorphicButton onClick={() => handleEdit(game)} className="p-4 text-forest-green hover:bg-forest-green/5"><Edit3 size={18}/></NeumorphicButton>
                   <NeumorphicButton onClick={() => handleDelete(game.id)} className="p-4 text-terracotta hover:bg-terracotta/5"><Trash2 size={18}/></NeumorphicButton>
                </div>
             </NeumorphicCard>
           ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-12 bg-cafe-bg w-fit mx-auto px-6 py-3 rounded-full shadow-neu-pressed">
             <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="text-deep-green disabled:opacity-20"><ChevronLeft/></button>
             <span className="text-[10px] font-black uppercase tracking-widest text-deep-green/40">Página {currentPage} de {totalPages}</span>
             <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="text-deep-green disabled:opacity-20"><ChevronRight/></button>
          </div>
        )}
      </div>
    </div>
  );
};
