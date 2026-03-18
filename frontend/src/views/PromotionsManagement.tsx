import React, { useState, useEffect } from 'react';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { useAuth } from '../context/AuthContext';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  expirationDate: string;
  imageUrl: string | null;
  active: boolean;
}

export const PromotionsManagement: React.FC = () => {
  const { token } = useAuth();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activePromo, setActivePromo] = useState<Partial<Promotion>>({
    title: '',
    description: '',
    discount: 0,
    expirationDate: '',
    imageUrl: '',
    active: true
  });

  const fetchPromotions = async () => {
    try {
      const resp = await fetch('http://localhost:3000/api/admin/promotions');
      const data = await resp.json();
      setPromotions(data);
    } catch (err) {
      console.error('Error fetching promotions:', err);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');

    const dataToSave = {
      title: activePromo.title,
      description: activePromo.description || '',
      imageUrl: activePromo.imageUrl || null,
      discount: Number(activePromo.discount) || 0,
      expirationDate: new Date(activePromo.expirationDate as string).toISOString(),
      active: activePromo.active !== undefined ? activePromo.active : true
    };

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing 
      ? `http://localhost:3000/api/admin/promotions/${activePromo.id}`
      : 'http://localhost:3000/api/admin/promotions';

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
        await fetchPromotions();
        setIsEditing(false);
        setActivePromo({ title: '', description: '', discount: 0, expirationDate: '', imageUrl: '', active: true });
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

  const handleEdit = (promo: Promotion) => {
    setActivePromo({
      ...promo,
      imageUrl: promo.imageUrl || '',
      expirationDate: new Date(promo.expirationDate).toISOString().split('T')[0]
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta promoción?')) return;
    try {
      await fetch(`http://localhost:3000/api/admin/promotions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchPromotions();
    } catch (err) {
      console.error('Error deleting promotion:', err);
    }
  };

  const inputStyles = "w-full px-4 py-3 rounded-cafe bg-cafe-bg shadow-neu-pressed border-none focus:ring-2 focus:ring-forest-green/30 outline-none text-deep-green text-sm transition-all";

  return (
    <div className="space-y-12">
      <NeumorphicCard className="p-8">
        <h3 className="text-2xl font-black text-deep-green mb-8 font-lora">
          {isEditing ? 'Editar Promo' : 'Nueva Campaña Marketing'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Título de la Promoción</label>
            <input 
              className={inputStyles}
              value={activePromo.title}
              onChange={e => setActivePromo({...activePromo, title: e.target.value})}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Condiciones / Detalles</label>
            <textarea 
              className={`${inputStyles} h-24 pt-4`}
              value={activePromo.description || ''}
              onChange={e => setActivePromo({...activePromo, description: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">URL de la Imagen</label>
            <input 
              className={inputStyles}
              placeholder="https://ejemplo.com/promo.jpg"
              value={activePromo.imageUrl || ''}
              onChange={e => setActivePromo({...activePromo, imageUrl: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Descuento (%)</label>
            <input 
              type="number"
              className={inputStyles}
              value={activePromo.discount || ''}
              onChange={e => setActivePromo({...activePromo, discount: parseFloat(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Válido hasta</label>
            <input 
              type="date"
              className={inputStyles}
              value={activePromo.expirationDate || ''}
              onChange={e => setActivePromo({...activePromo, expirationDate: e.target.value})}
              required
            />
          </div>
          <div className="md:col-span-2 flex flex-col gap-4 mt-6">
            <div className="flex gap-4">
              <NeumorphicButton 
                type="submit" 
                className={`flex-1 py-4 font-black uppercase tracking-widest transition-all ${status === 'saving' ? 'opacity-50 cursor-wait' : 'bg-terracotta text-white shadow-neu-flat'}`}
                disabled={status === 'saving'}
              >
                {status === 'saving' ? 'Lanzando...' : isEditing ? 'Actualizar Campaña' : 'Lanzar Promoción'}
              </NeumorphicButton>
              {isEditing && (
                <NeumorphicButton 
                  type="button" 
                  variant="flat"
                  onClick={() => {
                    setIsEditing(false);
                    setActivePromo({ title: '', description: '', discount: 0, expirationDate: '', imageUrl: '', active: true });
                  }}
                  className="px-8 text-forest-green font-black uppercase tracking-widest"
                >
                  Cancelar
                </NeumorphicButton>
              )}
            </div>
            {status === 'success' && <p className="text-center text-forest-green font-black uppercase tracking-widest text-[10px] animate-pulse">¡Campaña actualizada con éxito! 🚀</p>}
            {status === 'error' && <p className="text-center text-terracotta font-black uppercase tracking-widest text-[10px]">Error al configurar la promoción. Verifica los campos. ❌</p>}
          </div>
        </form>
      </NeumorphicCard>

      <div className="space-y-6">
        <h3 className="text-3xl font-black text-deep-green font-lora pl-4">Campañas Activas</h3>
        <div className="grid grid-cols-1 gap-6 lg:px-4">
          {promotions.map(promo => (
            <NeumorphicCard key={promo.id} className="p-8 border-l-8 border-terracotta overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              {promo.imageUrl && (
                <div className="absolute top-4 right-4 w-24 h-24 rounded-cafe overflow-hidden opacity-20 group-hover:opacity-100 transition-opacity duration-500 shadow-neu-flat">
                  <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-2">
                    <h4 className="text-2xl font-black text-deep-green font-lora">{promo.title}</h4>
                    <span className="text-terracotta font-black text-xl italic whitespace-nowrap">-{promo.discount}% OFF</span>
                  </div>
                  <p className="text-sm text-deep-green/70 mb-4 max-w-2xl">{promo.description}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-forest-green">
                    Vence el {new Date(promo.expirationDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-4">
                  <NeumorphicButton onClick={() => handleEdit(promo)} className="px-8 py-3 text-xs font-black uppercase tracking-widest text-forest-green hover:text-deep-green">
                    Editar
                  </NeumorphicButton>
                  <NeumorphicButton onClick={() => handleDelete(promo.id)} className="px-8 py-3 text-xs font-black uppercase tracking-widest text-terracotta hover:text-deep-green">
                    Retirar
                  </NeumorphicButton>
                </div>
              </div>
            </NeumorphicCard>
          ))}
          {promotions.length === 0 && (
            <p className="text-center py-10 text-forest-green/40 font-bold italic">No hay promociones activas.</p>
          )}
        </div>
      </div>
    </div>
  );
};
