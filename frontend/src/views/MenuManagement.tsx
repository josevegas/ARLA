import React, { useState, useEffect } from 'react';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { useAuth } from '../context/AuthContext';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  imageUrl: string | null;
  available: boolean;
}

export const MenuManagement: React.FC = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeItem, setActiveItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'Café',
    imageUrl: '',
    available: true
  });

  const categories = ['Café', 'Bebidas', 'Snacks', 'Postres', 'Pizzas', 'Hamburguesas', 'Especiales'];

  const fetchMenu = async () => {
    try {
      const resp = await fetch('http://localhost:3000/api/admin/menu');
      const data = await resp.json();
      setItems(data);
    } catch (err) {
      console.error('Error fetching menu:', err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');

    const dataToSave = {
      name: activeItem.name,
      category: activeItem.category,
      available: activeItem.available,
      description: activeItem.description || null,
      imageUrl: activeItem.imageUrl || null,
      price: Number(activeItem.price) || 0
    };

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing 
      ? `http://localhost:3000/api/admin/menu/${activeItem.id}`
      : 'http://localhost:3000/api/admin/menu';

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
        await fetchMenu();
        setIsEditing(false);
        setActiveItem({ name: '', description: '', price: 0, category: 'Café', imageUrl: '', available: true });
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

  const handleEdit = (item: MenuItem) => {
    setActiveItem({
      ...item,
      description: item.description || '',
      imageUrl: item.imageUrl || '',
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este ítem del menú?')) return;
    try {
      await fetch(`http://localhost:3000/api/admin/menu/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchMenu();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const inputStyles = "w-full px-4 py-3 rounded-cafe bg-cafe-bg shadow-neu-pressed border-none focus:ring-2 focus:ring-forest-green/30 outline-none text-deep-green text-sm transition-all";

  return (
    <div className="space-y-12">
      <NeumorphicCard className="p-8">
        <h3 className="text-2xl font-black text-deep-green mb-8 font-lora">
          {isEditing ? 'Editar Ítem' : 'Añadir al Menú'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Nombre del Plato/Bebida</label>
            <input 
              className={inputStyles}
              value={activeItem.name}
              onChange={e => setActiveItem({...activeItem, name: e.target.value})}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">URL de la Imagen</label>
            <input 
              className={inputStyles}
              placeholder="https://ejemplo.com/plato.jpg"
              value={activeItem.imageUrl || ''}
              onChange={e => setActiveItem({...activeItem, imageUrl: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Descripción Gourmet</label>
            <textarea 
              className={`${inputStyles} h-24 pt-4`}
              value={activeItem.description || ''}
              onChange={e => setActiveItem({...activeItem, description: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Categoría</label>
            <select 
              className={inputStyles}
              value={activeItem.category || 'Café'}
              onChange={e => setActiveItem({...activeItem, category: e.target.value})}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Precio ($)</label>
              <input 
                type="number"
                step="0.01"
                className={inputStyles}
                value={activeItem.price || ''}
                onChange={e => setActiveItem({...activeItem, price: parseFloat(e.target.value)})}
                required
              />
            </div>
            <div className="flex flex-col justify-center items-center">
               <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2">Disponible</label>
               <input 
                 type="checkbox"
                 className="w-6 h-6 rounded border-none shadow-neu-pressed text-forest-green focus:ring-0"
                 checked={activeItem.available}
                 onChange={e => setActiveItem({...activeItem, available: e.target.checked})}
               />
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col gap-4 mt-4">
            <div className="flex gap-4">
              <NeumorphicButton 
                type="submit" 
                className={`flex-1 py-4 font-black uppercase tracking-widest ${status === 'saving' ? 'opacity-50' : 'bg-forest-green text-white shadow-neu-flat'}`}
                disabled={status === 'saving'}
              >
                {status === 'saving' ? 'Procesando...' : isEditing ? 'Actualizar Ítem' : 'Guardar Ítem'}
              </NeumorphicButton>
              {isEditing && (
                <NeumorphicButton 
                  type="button" 
                  variant="flat"
                  onClick={() => {
                    setIsEditing(false);
                    setActiveItem({ name: '', description: '', price: 0, category: 'Café', imageUrl: '', available: true });
                  }}
                  className="px-8 text-terracotta font-black uppercase tracking-widest"
                >
                  Cancelar
                </NeumorphicButton>
              )}
            </div>
            {status === 'success' && <p className="text-center text-forest-green font-black uppercase tracking-widest text-[10px] animate-pulse">¡Carta actualizada con éxito! ✨</p>}
            {status === 'error' && <p className="text-center text-terracotta font-black uppercase tracking-widest text-[10px]">Error al guardar el plato. Revisa los campos. ❌</p>}
          </div>
        </form>
      </NeumorphicCard>

      <div className="space-y-6">
        <h3 className="text-3xl font-black text-deep-green font-lora pl-4">Carta Actual</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map(item => (
            <NeumorphicCard key={item.id} className="p-6 flex items-center gap-6">
              <div className="w-20 h-20 rounded-cafe bg-cafe-bg shadow-neu-pressed flex items-center justify-center text-3xl overflow-hidden flex-shrink-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : '🍽️'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-xl font-black text-deep-green font-lora truncate">{item.name}</h4>
                  <span className="text-forest-green font-black">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-xs text-deep-green/60 italic mb-2 line-clamp-2">{item.description}</p>
                <div className="flex gap-2">
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-forest-green/10 text-forest-green">
                    {item.category}
                  </span>
                  {!item.available && (
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta">
                      Agotado
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <NeumorphicButton onClick={() => handleEdit(item)} className="p-2 text-[10px] font-black uppercase tracking-widest text-forest-green hover:text-deep-green">
                  Editar
                </NeumorphicButton>
                <NeumorphicButton onClick={() => handleDelete(item.id)} className="p-2 text-[10px] font-black uppercase tracking-widest text-terracotta">
                  Borrar
                </NeumorphicButton>
              </div>
            </NeumorphicCard>
          ))}
          {items.length === 0 && (
            <p className="col-span-full text-center py-10 text-forest-green/40 font-bold italic">No hay platos registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
};
