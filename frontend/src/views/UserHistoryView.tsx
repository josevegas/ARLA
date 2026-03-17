import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { NeumorphicCard } from '../components/NeumorphicCard';

export const UserHistoryView: React.FC = () => {
  const { token } = useAuth();
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/users/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  if (loading) return <div>Cargando historial...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-700">Mi Historial</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NeumorphicCard>
          <h3 className="text-lg font-semibold mb-4 text-gray-600">Juegos Jugados</h3>
          {history?.gameHistory?.length > 0 ? (
            <ul className="space-y-2">
              {history.gameHistory.map((item: any) => (
                <li key={item.id} className="flex justify-between border-b pb-2 border-gray-200">
                  <span>{item.game.name}</span>
                  <span className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No has registrado juegos aún.</p>
          )}
        </NeumorphicCard>

        <NeumorphicCard>
          <h3 className="text-lg font-semibold mb-4 text-gray-600">Visitas Recientes</h3>
          {history?.visitHistory?.length > 0 ? (
            <ul className="space-y-2">
              {history.visitHistory.map((item: any) => (
                <li key={item.id} className="flex justify-between border-b pb-2 border-gray-200">
                  <span>Visita #{item.id.slice(-4)}</span>
                  <span className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No tienes visitas registradas.</p>
          )}
        </NeumorphicCard>
      </div>
    </div>
  );
};
