import React, { useState, useEffect } from 'react';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { useAuth } from '../context/AuthContext';

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

  const [status, setStatus] = useState<'idle' | 'creating' | 'updating' | 'success' | 'error'>('idle');

  const fetchTables = async () => {
    try {
      const resp = await fetch('http://localhost:3000/api/admin/tables', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await resp.json();
      setTables(data);
    } catch (err) {
      console.error('Error fetching tables:', err);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(isEditing ? 'updating' : 'creating');

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
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleEdit = (table: Table) => {
    setActiveTable(table);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta mesa?')) return;
    try {
      await fetch(`http://localhost:3000/api/admin/tables/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchTables();
    } catch (err) {
      console.error('Error deleting table:', err);
    }
  };

  const inputStyles = "w-full px-4 py-3 rounded-cafe bg-cafe-bg shadow-neu-pressed border-none focus:ring-2 focus:ring-forest-green/30 outline-none text-deep-green text-sm transition-all";

  return (
    <div className="space-y-12">
      <NeumorphicCard className="p-8">
        <h3 className="text-2xl font-black text-deep-green mb-8 font-lora">
          {isEditing ? 'Editar Mesa' : 'Registrar Nueva Mesa'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Capacidad (Personas)</label>
            <input
              type="number"
              className={inputStyles}
              value={activeTable.capacity || ''}
              onChange={e => setActiveTable({ ...activeTable, capacity: Number(e.target.value) })}
              required
              min="1"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Descripción</label>
            <input
              className={inputStyles}
              placeholder="Ej. Mesa junto a la ventana"
              value={activeTable.description || ''}
              onChange={e => setActiveTable({ ...activeTable, description: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-deep-green/50 mb-2 ml-4">Estado</label>
            <select
              className={inputStyles}
              value={activeTable.status || 'AVAILABLE'}
              onChange={e => setActiveTable({ ...activeTable, status: e.target.value })}
            >
              <option value="AVAILABLE">Disponible</option>
              <option value="OCCUPIED">Ocupada</option>
              <option value="RESERVED">Reservada</option>
            </select>
          </div>
          <div className="md:col-span-2 flex flex-col gap-4 mt-4">
            <div className="flex gap-4">
              <NeumorphicButton
                type="submit"
                className={`flex-1 py-4 font-black uppercase tracking-widest ${status === 'creating' || status === 'updating' ? 'opacity-50 cursor-not-allowed' : 'bg-forest-green text-white shadow-neu-flat'}`}
                disabled={status === 'creating' || status === 'updating'}
              >
                {status === 'creating' ? 'Guardando...' : status === 'updating' ? 'Actualizando...' : isEditing ? 'Actualizar Mesa' : 'Guardar Mesa'}
              </NeumorphicButton>
              {isEditing && (
                <NeumorphicButton
                  type="button"
                  variant="flat"
                  onClick={() => {
                    setIsEditing(false);
                    setActiveTable({ capacity: 4, description: '', status: 'AVAILABLE' });
                  }}
                  className="px-8 text-terracotta font-black uppercase tracking-widest"
                >
                  Cancelar
                </NeumorphicButton>
              )}
            </div>
            {status === 'success' && <p className="text-center text-forest-green font-black uppercase tracking-widest text-[10px] animate-pulse">¡Operación completada con éxito! ✨</p>}
            {status === 'error' && <p className="text-center text-terracotta font-black uppercase tracking-widest text-[10px]">Error al procesar la solicitud. Verifica los datos. ❌</p>}
          </div>
        </form>
      </NeumorphicCard>

      <div className="space-y-6">
        <h3 className="text-3xl font-black text-deep-green font-lora pl-4">Mesas Registradas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tables.map(table => (
            <NeumorphicCard key={table.id} className="p-6 flex justify-between items-center gap-6">
              <div className="flex-1">
                <h4 className="text-xl font-black text-deep-green font-lora mb-1">
                  Mesa para {table.capacity}
                </h4>
                <div className="flex gap-2">
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-forest-green/10 text-forest-green">
                    {table.description}
                  </span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${table.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                      table.status === 'OCCUPIED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {table.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <NeumorphicButton onClick={() => handleEdit(table)} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-forest-green hover:text-deep-green">
                  Editar
                </NeumorphicButton>
                <NeumorphicButton onClick={() => handleDelete(table.id)} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-terracotta">
                  Borrar
                </NeumorphicButton>
              </div>
            </NeumorphicCard>
          ))}
          {tables.length === 0 && (
            <p className="text-center md:col-span-2 py-10 text-forest-green/40 font-bold italic">No hay mesas registradas.</p>
          )}
        </div>
      </div>
    </div>
  );
};
