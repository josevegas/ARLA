import React from 'react';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';

export const AdminManagementView: React.FC = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-700">Panel de Administración</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NeumorphicCard className="space-y-4">
          <h3 className="font-semibold text-gray-600">Gestión de Juegos</h3>
          <p className="text-sm text-gray-500">Añade o edita juegos de la ludoteca.</p>
          <NeumorphicButton className="w-full text-sm">Nuevo Juego</NeumorphicButton>
        </NeumorphicCard>

        <NeumorphicCard className="space-y-4">
          <h3 className="font-semibold text-gray-600">Gestión del Menú</h3>
          <p className="text-sm text-gray-500">Actualiza platos, bebidas y precios.</p>
          <NeumorphicButton className="w-full text-sm">Editar Ítem</NeumorphicButton>
        </NeumorphicCard>

        <NeumorphicCard className="space-y-4">
          <h3 className="font-semibold text-gray-600">Promociones</h3>
          <p className="text-sm text-gray-500">Crea ofertas para tus clientes.</p>
          <NeumorphicButton className="w-full text-sm">Crear Promo</NeumorphicButton>
        </NeumorphicCard>
      </div>
    </div>
  );
};
