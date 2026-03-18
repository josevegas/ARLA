import React, { useState, useEffect } from 'react';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  imageUrl: string | null;
  available: boolean;
}

export const MenuView: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('Todos');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const resp = await fetch('http://localhost:3000/api/admin/menu');
        const data = await resp.json();
        setItems(data);
      } catch (err) {
        console.error('Error fetching menu:', err);
      }
    };
    fetchMenu();
  }, []);

  const categories = ['Todos', ...new Set(items.map(i => i.category).filter(Boolean) as string[])];

  const filteredItems = activeCategory === 'Todos' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  const getEmoji = (category: string) => {
    switch (category.toLowerCase()) {
      case 'café':
      case 'cafe': return '☕';
      case 'bebidas': return '🍵';
      case 'snacks': return '🥪';
      case 'postres': return '🍰';
      case 'pizzas': return '🍕';
      case 'hamburguesas': return '🍔';
      default: return '🍽️';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-20">
        <h1 className="text-6xl font-black text-deep-green tracking-tighter mb-4 font-lora">Carta Gastronómica</h1>
        <p className="text-lg text-forest-green max-w-2xl mx-auto font-medium">
          Sabores diseñados para acompañar tus partidas y hacer cada momento especial.
        </p>
      </div>

      <div className="flex justify-center flex-wrap gap-4 mb-20">
        {categories.map(cat => (
          <NeumorphicButton 
            key={cat}
            variant={activeCategory === cat ? 'pressed' : 'flat'}
            onClick={() => setActiveCategory(cat)}
            className={`px-10 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-colors ${activeCategory === cat ? 'text-forest-green' : 'text-deep-green/50'}`}
          >
            {cat}
          </NeumorphicButton>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:px-10">
        {filteredItems.map(item => (
          <div key={item.id} className="group">
            <NeumorphicCard className={`flex items-center p-6 transition-all duration-500 hover:scale-[1.03] cursor-pointer border border-white/5 ${!item.available ? 'opacity-50 grayscale' : ''}`}>
              <div className="w-28 h-28 rounded-cafe bg-cafe-bg shadow-neu-pressed flex items-center justify-center text-5xl mr-8 flex-shrink-0 group-hover:rotate-6 transition-transform duration-500 overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  getEmoji(item.category)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-2xl font-black text-deep-green truncate mr-4 font-lora">{item.name}</h3>
                  <span className="text-xl font-black text-forest-green">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-deep-green/60 font-medium leading-relaxed line-clamp-2 italic">{item.description}</p>
                <div className="mt-4 flex gap-2">
                   <span className="text-[10px] font-black uppercase tracking-widest text-forest-green/40">
                    {item.available ? 'Agregar +' : 'No disponible'}
                   </span>
                </div>
              </div>
            </NeumorphicCard>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-20">
            <p className="text-xl font-black text-forest-green/40 italic">No hay productos disponibles en esta categoría.</p>
          </div>
        )}
      </div>

      <div className="mt-32 text-center">
        <NeumorphicCard className="inline-block py-12 px-16 max-w-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <p className="text-forest-green font-black uppercase tracking-[0.4em] text-xs mb-6">¿Hambre de victoria?</p>
          <h2 className="text-4xl font-black text-deep-green mb-10 leading-tight">Pide directo desde <br/> tu mesa digital</h2>
          <NeumorphicButton className="bg-terracotta text-cafe-surface px-12 py-5 text-xl font-black uppercase tracking-widest shadow-neu-flat border-none transition-transform hover:scale-105">
            Abrir Pedido
          </NeumorphicButton>
        </NeumorphicCard>
      </div>
    </div>
  );
};
