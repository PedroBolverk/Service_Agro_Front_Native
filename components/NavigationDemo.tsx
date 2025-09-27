import React from 'react';

interface NavigationDemoProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function NavigationDemo({ currentScreen, onNavigate }: NavigationDemoProps) {
  const screens = [
    { id: "service-request", name: "📋 Solicitação de Serviço", description: "Tela para criar nova solicitação (React Native)" },
    { id: "mockups", name: "📱 Mockups Completos", description: "Visualização completa do fluxo" },
    { id: "react-native-dashboards", name: "📱 Dashboards React Native", description: "Versões nativas dos dashboards" },
    { id: "login", name: "🔐 Login", description: "Tela de autenticação" },
    { id: "service-selection", name: "🚜 Seleção de Equipamento", description: "Escolher tipo de máquina" },
    { id: "service-description", name: "📝 Descrição do Problema", description: "Detalhar o serviço" },
    { id: "mechanic-dashboard", name: "🔧 Dashboard Mecânico", description: "Painel do mecânico (ícones vetoriais)" },
    { id: "producer-dashboard", name: "🌾 Dashboard Produtor", description: "Painel do produtor (ícones vetoriais)" },
    { id: "profile-mechanic", name: "👤 Perfil Mecânico", description: "Configurações do mecânico" },
    { id: "profile-producer", name: "👤 Perfil Produtor", description: "Configurações do produtor" },
  ];

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs z-50">
      <h3 className="font-semibold text-gray-900 mb-3">Navegação - Demo</h3>
      <div className="space-y-2">
        {screens.map((screen) => (
          <button
            key={screen.id}
            onClick={() => onNavigate(screen.id)}
            className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
              currentScreen === screen.id
                ? 'bg-primary text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="font-medium">{screen.name}</div>
            <div className={`text-xs ${currentScreen === screen.id ? 'text-gray-200' : 'text-gray-500'}`}>
              {screen.description}
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Tela atual: <span className="font-medium">{currentScreen}</span>
        </p>
      </div>
    </div>
  );
}