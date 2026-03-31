import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, CheckCircle2 } from 'lucide-react';

export const CartView: React.FC = () => {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!user) return navigate('/login');
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:3000/api/games/purchase', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          cartItems: items.map(i => ({ gameId: i.id, quantity: i.quantity }))
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setIsSuccess(true);
      clearCart();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center px-4 animate-in zoom-in duration-500">
        <NeumorphicCard className="p-16 space-y-10 group">
          <div className="w-24 h-24 bg-forest-green text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-neu-flat border-4 border-white/20">
             <CheckCircle2 size={48} />
          </div>
          <div>
             <h2 className="text-5xl font-black text-deep-green font-lora">¡Compra Exitosa!</h2>
             <p className="text-forest-green font-medium mt-3 opacity-60">Tus juegos de mesa te están esperando. Recógelos en recepción.</p>
          </div>
          <NeumorphicButton onClick={() => navigate('/ludoteca')} variant="pressed" className="px-12 py-5 bg-forest-green text-white font-black uppercase tracking-widest text-[10px]">Seguir explorando</NeumorphicButton>
        </NeumorphicCard>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center px-4">
        <NeumorphicCard className="p-16 space-y-8 opacity-40">
           <ShoppingBag size={80} className="mx-auto text-deep-green/10" />
           <h2 className="text-3xl font-black text-deep-green font-lora">Tu carrito está vacío</h2>
           <p className="text-forest-green font-medium">Parece que aún no tienes aventuras listas para llevar a casa.</p>
           <NeumorphicButton onClick={() => navigate('/ludoteca')} className="px-10 py-5 bg-deep-green text-white font-black uppercase tracking-widest text-[10px]">Ir a la Ludoteca</NeumorphicButton>
        </NeumorphicCard>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between">
         <NeumorphicButton onClick={() => navigate('/ludoteca')} variant="flat" className="p-4 flex items-center gap-2 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-green/40">Volver</span>
         </NeumorphicButton>
         <h1 className="text-5xl font-black text-deep-green font-lora tracking-tighter">Tu Carrito</h1>
         <div className="w-20"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map(item => (
            <NeumorphicCard key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden group">
               <div className="w-28 h-28 rounded-[2rem] bg-cafe-bg shadow-neu-pressed flex-shrink-0 flex items-center justify-center text-4xl border border-white/20">
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-[2rem]" /> : '🎲'}
               </div>
               
               <div className="flex-1 text-center sm:text-left space-y-2">
                  <h3 className="text-2xl font-black text-deep-green leading-tight">{item.name}</h3>
                  <p className="text-terracotta font-black text-lg font-lora">${item.price} <span className="text-[10px] uppercase text-deep-green/30 tracking-widest ml-2">por unidad</span></p>
               </div>

               <div className="flex items-center gap-6 bg-cafe-bg px-5 py-3 rounded-full shadow-neu-pressed">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-deep-green hover:text-terracotta transition-colors"><Minus size={16}/></button>
                  <span className="text-xl font-black text-deep-green min-w-[20px] text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-deep-green hover:text-forest-green transition-colors"><Plus size={16}/></button>
               </div>

               <div className="text-right min-w-[100px]">
                  <p className="text-[10px] font-black uppercase text-deep-green/30 tracking-widest">Subtotal</p>
                  <p className="text-xl font-black text-deep-green font-lora">${(item.price * item.quantity).toFixed(2)}</p>
               </div>

               <button onClick={() => removeFromCart(item.id)} className="absolute top-4 right-4 text-terracotta/20 hover:text-terracotta transition-colors">
                  <Trash2 size={20} />
               </button>
            </NeumorphicCard>
          ))}
        </div>

        <div className="lg:col-span-1">
          <NeumorphicCard className="p-10 space-y-10 border-t-8 border-terracotta sticky top-24">
             <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-deep-green/40">Resumen de Compra</h3>
                <div className="space-y-3 pt-4">
                   {items.map(item => (
                     <div key={item.id} className="flex justify-between text-xs font-medium text-deep-green/60">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="pt-6 border-t border-deep-green/10 flex justify-between items-baseline">
                <span className="text-xs font-bold uppercase tracking-widest text-deep-green">Total</span>
                <span className="text-5xl font-black text-deep-green font-lora">${total.toFixed(2)}</span>
             </div>

             {error && <p className="text-center text-terracotta font-black text-[10px] uppercase animate-pulse">{error}</p>}

             <div className="space-y-4 pt-4">
                <NeumorphicButton 
                  disabled={loading} 
                  onClick={handleCheckout} 
                  className="w-full py-5 bg-terracotta text-white font-black uppercase tracking-widest text-[11px] shadow-neu-flat border-none group hover:scale-[1.02] transition-transform"
                >
                   {loading ? 'Procesando...' : 'Confirmar Compra'}
                </NeumorphicButton>
                <div className="flex justify-center gap-4 text-[9px] font-bold text-deep-green/30 uppercase tracking-[0.2em]">
                   🔒 Pago Seguro en Caja
                </div>
             </div>
          </NeumorphicCard>
        </div>
      </div>
    </div>
  );
};
