import React, { useState, useEffect } from 'react';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { useAuth } from '../context/AuthContext';
import { Layers, MapPin, Users, Edit3, Trash2, PlusCircle } from 'lucide-react';

interface Table {
  id: string;
  capacity: number;
  description: string;
  status: string;
}

export const TableManagement: React.FC = () => {
  const { token } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTable, setActiveTable] = useState<Partial<Table>>({
    capacity: 4,
    description: '',
    status: 'AVAILABLE'
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const fetchTables = async () => {
    try {
      const resp = await fetch('http://localhost:3000/api/admin/tables', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await resp.json();
      setTables(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchTables(); }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing
      ? `http://localhost:3000/api/admin/tables/${activeTable.id}`
      : 'http://localhost:3000/api/admin/tables';

    try {
      const resp = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          capacity: Number(activeTable.capacity),
          description: activeTable.description,
          status: activeTable.status,
        })
      });

      if (resp.ok) {
        await fetchTables();
        setIsEditing(false);
        setActiveTable({ capacity: 4, description: '', status: 'AVAILABLE' });
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else { setStatus('error'); }
    } catch (err) { setStatus('error'); }
  };

  const handleEdit = (table: Table) => {
    setActiveTable(table);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta mesa definitivamente?')) return;
    try {
      await fetch(`http://localhost:3000/api/admin/tables/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchTables();
    } catch (err) { console.error(err); }
  };

  const inputClass = "w-full px-6 py-4 rounded-3xl bg-cafe-bg shadow-neu-pressed border-none outline-none text-deep-green font-bold text-sm focus:ring-2 focus:ring-forest-green/20 transition-all";

  return (
    <div className="space-y-16 py-8">
      <NeumorphicCard className="p-10 border-t-8 border-terracotta relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta/5 rounded-bl-[5rem] -z-10" />
        <h3 className="text-4xl font-black text-deep-green mb-10 font-lora flex items-center gap-4">
           {isEditing ? <Edit3 /> : <PlusCircle />} {isEditing ? 'Configurar Espacio' : 'Nueva Mesa de Aventuras'}
        </h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/30 ml-4">Capacidad de Jugadores</label>
              <div className="relative">
                 <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-deep-green/20" size={16} />
                 <input type="number" className={`${inputClass} pl-14`} value={activeTable.capacity || ''} onChange={e => setActiveTable({ ...activeTable, capacity: Number(e.target.value) })} required min="1" />
              </div>
           </div>

           <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/30 ml-4">Ubicación / Descripción</label>
              <div className="relative">
                 <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-deep-green/20" size={16} />
                 <input className={`${inputClass} pl-14`} placeholder="Ej. Ventanal Norte, Zona VIP..." value={activeTable.description || ''} onChange={e => setActiveTable({ ...activeTable, description: e.target.value })} required />
              </div>
           </div>

           <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-deep-green/30 ml-4">Estado de Disponibilidad Inicial</label>
              <select className={inputClass} value={activeTable.status || 'AVAILABLE'} onChange={e => setActiveTable({ ...activeTable, status: e.target.value })}>
                 <option value="AVAILABLE">✅ Disponible para reserva</option>
                 <option value="OCCUPIED">❌ No disponible temporalmente</option>
                 <option value="RESERVED">📅 Reservada por sistema</option>
              </select>
           </div>

           <div className="md:col-span-3 flex gap-4 pt-6">
              <NeumorphicButton type="submit" className="flex-1 py-5 bg-terracotta text-white font-black uppercase tracking-widest text-[11px] shadow-neu-flat border-none">
                 {status === 'loading' ? 'Guardando...' : isEditing ? 'Aplicar Cambios' : 'Crear Mesa'}
              </NeumorphicButton>
              {isEditing && (
                 <NeumorphicButton type="button" variant="flat" onClick={() => { setIsEditing(false); setActiveTable({ capacity: 4, description: '', status: 'AVAILABLE' }); }} className="px-12 text-deep-green/40 font-black uppercase text-[10px]">Cancelar</NeumorphicButton>
              )}
           </div>
        </form>
      </NeumorphicCard>

      <div className="space-y-8">
        <h3 className="text-3xl font-black text-deep-green font-lora ml-4 flex items-center gap-4"><Layers /> Mapa de Salón</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {tables.map(table => (
             <NeumorphicCard key={table.id} className="p-8 group hover:scale-[1.02] transition-transform flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 rounded-[2rem] bg-cafe-bg shadow-neu-pressed flex flex-col items-center justify-center border border-white/20">
                         <span className="text-2xl font-black text-deep-green">{table.capacity}</span>
                         <span className="text-[7px] font-black uppercase text-deep-green/30">pax</span>
                      </div>
                      <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full border ${
                        table.status === 'AVAILABLE' ? 'bg-green-100/50 text-green-700 border-green-200' : 'bg-red-100/50 text-red-700 border-red-200'
                      }`}>
                         {table.status}
                      </span>
                   </div>
                   <h4 className="text-xl font-black text-deep-green font-lora mb-2">{table.description}</h4>
                   <p className="text-[10px] font-bold text-deep-green/30 uppercase tracking-[0.2em] mb-8">Ref: {table.id.slice(-8)}</p>
                </div>

                <div className="flex gap-3 pt-6 border-t border-deep-green/5">
                   <NeumorphicButton onClick={() => handleEdit(table)} className="flex-1 py-3 text-[10px] font-black uppercase text-forest-green hover:bg-forest-green/5">Configurar</NeumorphicButton>
                   <NeumorphicButton onClick={() => handleDelete(table.id)} className="px-4 py-3 text-terracotta hover:bg-terracotta/5"><Trash2 size={16}/></NeumorphicButton>
                </div>
             </NeumorphicCard>
           ))}
           {tables.length === 0 && (
             <div className="col-span-full py-20 text-center opacity-20 italic">No hay mesas registradas en el local.</div>
           )}
        </div>
      </div>
    </div>
  );
};
