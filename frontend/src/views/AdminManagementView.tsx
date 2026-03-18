import React, { useState } from 'react';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { GameManagement } from './GameManagement';
import { MenuManagement } from './MenuManagement';
import { PromotionsManagement } from './PromotionsManagement';

export const AdminManagementView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'juegos' | 'menu' | 'promos'>('juegos');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black text-deep-green tracking-tighter mb-4 font-lora">Gestión ARLA</h1>
        <p className="text-forest-green font-black uppercase tracking-[0.4em] text-xs">Panel Administrativo Central</p>
      </div>

      <div className="flex justify-center flex-wrap gap-4 mb-16">
        {[
          { id: 'juegos', label: 'Ludoteca', icon: '🎲' },
          { id: 'menu', label: 'Gastronomía', icon: '☕' },
          { id: 'promos', label: 'Marketing', icon: '🏷️' },
        ].map(tab => (
          <NeumorphicButton 
            key={tab.id}
            variant={activeTab === tab.id ? 'pressed' : 'flat'}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-12 py-4 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-3 ${
              activeTab === tab.id ? 'text-forest-green' : 'text-deep-green/50 opacity-70 grayscale'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            {tab.label}
          </NeumorphicButton>
        ))}
      </div>

      <div className="max-w-6xl mx-auto transition-all duration-500">
        {activeTab === 'juegos' && <GameManagement />}
        {activeTab === 'menu' && <MenuManagement />}
        {activeTab === 'promos' && <PromotionsManagement />}
      </div>
    </div>
  );
};
