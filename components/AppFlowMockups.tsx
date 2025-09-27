import React, { useState } from 'react';
import { 
  Smartphone, 
  User, 
  Wrench, 
  MapPin, 
  Settings, 
  Bell, 
  Clock, 
  CheckCircle, 
  XCircle,
  Phone,
  MessageCircle,
  Calendar,
  Search,
  Filter,
  Plus,
  ArrowLeft,
  Menu,
  Home,
  List,
  Map,
  LogOut,
  Edit,
  Star,
  Shield,
  HelpCircle,
  FileText,
  Camera,
  Mail,
  MapPinIcon,
  Banknote,
  BarChart3,
  History,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  Smartphone as SmartphoneIcon
} from 'lucide-react';

export function AppFlowMockups() {
  const [activeFlow, setActiveFlow] = useState<'mechanic' | 'producer'>('mechanic');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AgroService - Fluxo Completo do App
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sistema completo para conexão entre produtores rurais e mecânicos
          </p>
          
          {/* Flow Selector */}
          <div className="inline-flex bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveFlow('mechanic')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeFlow === 'mechanic'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Wrench className="w-4 h-4 inline mr-2" />
              Fluxo do Mecânico
            </button>
            <button
              onClick={() => setActiveFlow('producer')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeFlow === 'producer'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Fluxo do Produtor
            </button>
          </div>
        </div>

        {/* Mockups */}
        {activeFlow === 'mechanic' ? <MechanicFlow /> : <ProducerFlow />}

        {/* Navigation Strategy */}
        <NavigationStrategy />
      </div>
    </div>
  );
}

function MechanicFlow() {
  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        🔧 FLUXO DO MECÂNICO
      </h2>

      {/* Login Screen */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4">1. Tela de Login</h3>
          <p className="text-gray-600 mb-4">
            Mecânico faz login com suas credenciais. O sistema identifica o perfil automaticamente.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Logo da empresa centralizada</li>
            <li>• Campos de email e senha</li>
            <li>• Botão "Entrar" estilizado</li>
            <li>• Link para cadastro de novos mecânicos</li>
          </ul>
        </div>
        <div className="w-80">
          <LoginMockup userType="mechanic" />
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="w-80">
          <MechanicDashboardMockup />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4">2. Dashboard Principal</h3>
          <p className="text-gray-600 mb-4">
            Interface principal com navegação por abas na parte inferior (Mobile-First).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900">📊 Estatísticas</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Serviços pendentes</li>
                <li>• Em andamento</li>
                <li>• Finalizados hoje</li>
                <li>• Avaliação média</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">🎯 Ações Rápidas</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Ver mapa de serviços</li>
                <li>• Atualizar disponibilidade</li>
                <li>• Histórico completo</li>
                <li>• Configurações</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4">3. Mapa de Serviços</h3>
          <p className="text-gray-600 mb-4">
            Visualização geográfica de todos os serviços na região do mecânico.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900">🗺️ Funcionalidades</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Pins coloridos por status</li>
                <li>• Filtros por tipo de equipamento</li>
                <li>• Raio de atendimento</li>
                <li>• Rota otimizada</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">📍 Informações</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Distância do mecânico</li>
                <li>• Prioridade do serviço</li>
                <li>• Preview da solicitação</li>
                <li>• Contato direto</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-80">
          <MapMockup userType="mechanic" />
        </div>
      </div>

      {/* Service Details */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="w-80">
          <ServiceDetailsMockup />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4">4. Detalhes do Serviço</h3>
          <p className="text-gray-600 mb-4">
            Modal ou tela completa com todas as informações do serviço solicitado.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900">📋 Informações</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Tipo de equipamento</li>
                <li>• Descrição do problema</li>
                <li>• Localização exata</li>
                <li>• Urgência do serviço</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">👤 Produtor</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Nome e avaliação</li>
                <li>• Telefone de contato</li>
                <li>• Histórico de serviços</li>
                <li>• Botões de ação</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Screen */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4">5. Tela de Perfil</h3>
          <p className="text-gray-600 mb-4">
            Configurações pessoais, histórico completo e funcionalidade de logout para o mecânico.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900">👤 Informações Pessoais</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Foto do perfil editável</li>
                <li>• Nome e especialidades</li>
                <li>• Avaliação e estatísticas</li>
                <li>• Informações de contato</li>
                <li>• Localização de trabalho</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">⚙️ Configurações</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Disponibilidade/status</li>
                <li>• Notificações push</li>
                <li>• Raio de atendimento</li>
                <li>• Tema da aplicação</li>
                <li>• Logout seguro</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-80">
          <ProfileMockup userType="mechanic" />
        </div>
      </div>
    </div>
  );
}

function ProducerFlow() {
  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        🌾 FLUXO DO PRODUTOR
      </h2>

      {/* Login Screen */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4">1. Tela de Login</h3>
          <p className="text-gray-600 mb-4">
            Produtor faz login e é direcionado para o dashboard de solicitações.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Mesmo layout do mecânico</li>
            <li>• Identificação automática do perfil</li>
            <li>• Redirecionamento inteligente</li>
            <li>• Lembrança de sessão</li>
          </ul>
        </div>
        <div className="w-80">
          <LoginMockup userType="producer" />
        </div>
      </div>

      {/* Service Selection */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="w-80">
          <ServiceSelectionMockup />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4">2. Seleção de Equipamento</h3>
          <p className="text-gray-600 mb-4">
            Primeira etapa da solicitação: escolher o tipo de equipamento com problema.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900">🚜 Equipamentos</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Tratores</li>
                <li>• Colheitadeiras</li>
                <li>• Plantadeiras</li>
                <li>• Pulverizadores</li>
                <li>• Implementos</li>
                <li>• Outros</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">💡 Funcionalidades</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Cards visuais grandes</li>
                <li>• Ícones representativos</li>
                <li>• Busca por nome</li>
                <li>• Histórico de seleções</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Service Description */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4">3. Descrição do Problema</h3>
          <p className="text-gray-600 mb-4">
            Formulário detalhado para descrever o problema e urgência do serviço.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900">📝 Campos</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Descrição detalhada</li>
                <li>• Nível de urgência</li>
                <li>• Localização (GPS)</li>
                <li>• Fotos opcionais</li>
                <li>• Horário preferencial</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">🎯 Validações</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Mínimo de caracteres</li>
                <li>• Localização obrigatória</li>
                <li>• Validação em tempo real</li>
                <li>• Sugestões automáticas</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-80">
          <ServiceDescriptionMockup />
        </div>
      </div>

      {/* Producer Dashboard */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="w-80">
          <ProducerDashboardMockup />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4">4. Dashboard do Produtor</h3>
          <p className="text-gray-600 mb-4">
            Visualização de todas as solicitações e status dos serviços.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900">📊 Status</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Aguardando mecânico</li>
                <li>• Mecânico a caminho</li>
                <li>• Em atendimento</li>
                <li>• Concluído</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">⚡ Ações</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Nova solicitação</li>
                <li>• Conversar com mecânico</li>
                <li>• Avaliar serviço</li>
                <li>• Ver histórico</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Map View Producer */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4">5. Mapa - Acompanhamento</h3>
          <p className="text-gray-600 mb-4">
            Visualização em tempo real da localização do mecânico e tempo estimado.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900">🚗 Rastreamento</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Localização em tempo real</li>
                <li>• Tempo estimado de chegada</li>
                <li>• Rota otimizada</li>
                <li>• Notificações de status</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">💬 Comunicação</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Chat integrado</li>
                <li>• Chamadas diretas</li>
                <li>• Compartilhamento de localização</li>
                <li>• Histórico de mensagens</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-80">
          <MapMockup userType="producer" />
        </div>
      </div>

      {/* Profile Screen Producer */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="w-80">
          <ProfileMockup userType="producer" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4">6. Tela de Perfil do Produtor</h3>
          <p className="text-gray-600 mb-4">
            Gerenciamento da conta, propriedades rurais e configurações personalizadas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900">🌾 Informações da Propriedade</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Nome da fazenda/propriedade</li>
                <li>• Localização principal</li>
                <li>• Tipos de cultivo</li>
                <li>• Equipamentos cadastrados</li>
                <li>• Área total da propriedade</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">📊 Histórico e Configurações</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Histórico de serviços</li>
                <li>• Avaliações dadas</li>
                <li>• Preferências de mecânicos</li>
                <li>• Configurações de notificação</li>
                <li>• Logout e segurança</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavigationStrategy() {
  return (
    <div className="mt-16 bg-white rounded-xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        📱 Estratégia de Navegação
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mobile Navigation */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Navegação Mobile (Principal)
          </h3>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Bottom Tab Navigation</h4>
              <p className="text-sm text-gray-600 mb-3">
                Abas fixas na parte inferior para navegação principal
              </p>
              <div className="flex justify-around bg-gray-50 rounded-lg p-2">
                <div className="text-center">
                  <Home className="w-5 h-5 mx-auto text-primary" />
                  <span className="text-xs text-primary">Home</span>
                </div>
                <div className="text-center">
                  <List className="w-5 h-5 mx-auto text-gray-400" />
                  <span className="text-xs text-gray-400">Serviços</span>
                </div>
                <div className="text-center">
                  <Map className="w-5 h-5 mx-auto text-gray-400" />
                  <span className="text-xs text-gray-400">Mapa</span>
                </div>
                <div className="text-center">
                  <User className="w-5 h-5 mx-auto text-gray-400" />
                  <span className="text-xs text-gray-400">Perfil</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Stack Navigation</h4>
              <p className="text-sm text-gray-600 mb-3">
                Para fluxos específicos (login, nova solicitação, detalhes)
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Login → Dashboard</li>
                <li>• Nova Solicitação → Seleção → Descrição → Confirmação</li>
                <li>• Lista → Detalhes → Chat/Mapa</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Monitor className="w-5 h-5 mr-2" />
            Navegação Desktop (Secundária)
          </h3>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Sidebar Navigation</h4>
              <p className="text-sm text-gray-600 mb-3">
                Menu lateral para telas maiores com mais espaço
              </p>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="space-y-2">
                  <div className="flex items-center text-primary bg-white rounded px-3 py-2">
                    <Home className="w-4 h-4 mr-3" />
                    <span className="text-sm">Dashboard</span>
                  </div>
                  <div className="flex items-center text-gray-600 px-3 py-2">
                    <List className="w-4 h-4 mr-3" />
                    <span className="text-sm">Serviços</span>
                  </div>
                  <div className="flex items-center text-gray-600 px-3 py-2">
                    <Map className="w-4 h-4 mr-3" />
                    <span className="text-sm">Mapa</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Modal Overlays</h4>
              <p className="text-sm text-gray-600 mb-3">
                Para detalhes e ações rápidas sem sair da tela principal
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Detalhes do serviço</li>
                <li>• Formulários de edição</li>
                <li>• Confirmações importantes</li>
                <li>• Chat integrado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Flow */}
      <div className="mt-8 border-t pt-8">
        <h3 className="text-xl font-semibold mb-4 text-center">
          🔄 Fluxo de Navegação Completo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">👤 MECÂNICO</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-3">1</div>
                <span>Login → Dashboard Principal</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-3">2</div>
                <span>Tabs: Home | Serviços | Mapa | Perfil</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-3">3</div>
                <span>Serviços → Detalhes (Modal/Stack)</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-3">4</div>
                <span>Ações: Aceitar | Chat | Navegar</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">🌾 PRODUTOR</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs mr-3">1</div>
                <span>Login → Dashboard de Solicitações</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs mr-3">2</div>
                <span>Tabs: Home | Minhas Solicitações | Mapa | Perfil</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-centers justify-center text-xs mr-3">3</div>
                <span>Nova Solicitação: Equipamento → Descrição</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs mr-3">4</div>
                <span>Acompanhamento: Status | Chat | Avaliação</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Decisões de UX</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Mobile-First:</strong> Interface otimizada para dispositivos móveis</li>
            <li>• <strong>Bottom Navigation:</strong> Facilita uso com uma mão</li>
            <li>• <strong>Stack Navigation:</strong> Para fluxos lineares (solicitações)</li>
            <li>• <strong>Modals:</strong> Para ações rápidas sem perder contexto</li>
            <li>• <strong>Gestos:</strong> Swipe, pull-to-refresh, long-press</li>
            <li>• <strong>Notificações:</strong> Push notifications para updates importantes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Mock Components
function LoginMockup({ userType }: { userType: 'mechanic' | 'producer' }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-gray-800 mx-auto" style={{ width: '300px', height: '600px' }}>
      {/* Status Bar */}
      <div className="bg-black h-6 flex items-center justify-center">
        <div className="flex space-x-1">
          <div className="w-4 h-1 bg-white rounded"></div>
          <div className="w-4 h-1 bg-white rounded"></div>
          <div className="w-4 h-1 bg-white rounded"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8 h-full bg-gradient-to-b from-green-50 to-white">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">AS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AgroService</h1>
          <p className="text-gray-600 text-sm">Conectando produtores e mecânicos</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full p-4 border border-gray-200 rounded-lg bg-white"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Senha" 
              className="w-full p-4 border border-gray-200 rounded-lg bg-white"
            />
          </div>
          <button className="w-full bg-primary text-white p-4 rounded-lg font-medium">
            Entrar como {userType === 'mechanic' ? 'Mecânico' : 'Produtor'}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Não tem conta? <span className="text-primary font-medium">Cadastre-se</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function MechanicDashboardMockup() {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-gray-800 mx-auto" style={{ width: '300px', height: '600px' }}>
      {/* Status Bar */}
      <div className="bg-black h-6"></div>
      
      {/* Header */}
      <div className="bg-white p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900">Olá, João!</h2>
            <p className="text-sm text-gray-600">Mecânico Especialista</p>
          </div>
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">JS</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-orange-50 p-3 rounded-lg text-center">
            <div className="w-6 h-6 bg-orange-500 rounded mx-auto mb-1"></div>
            <p className="text-lg font-bold text-gray-900">3</p>
            <p className="text-xs text-gray-600">Pendentes</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="w-6 h-6 bg-blue-500 rounded mx-auto mb-1"></div>
            <p className="text-lg font-bold text-gray-900">2</p>
            <p className="text-xs text-gray-600">Ativos</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="w-6 h-6 bg-green-500 rounded mx-auto mb-1"></div>
            <p className="text-lg font-bold text-gray-900">15</p>
            <p className="text-xs text-gray-600">Concluídos</p>
          </div>
        </div>

        {/* Service Cards */}
        <div className="space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900">Trator John Deere</h3>
              <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded">Pendente</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Carlos Santos - 2.5km</p>
            <p className="text-xs text-gray-500">Problema no motor...</p>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 bg-green-500 text-white text-xs py-2 rounded">Aceitar</button>
              <button className="flex-1 border border-red-300 text-red-600 text-xs py-2 rounded">Recusar</button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900">Colheitadeira Case</h3>
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">Em Andamento</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Maria Oliveira - 1.2km</p>
            <p className="text-xs text-gray-500">Esteira transportadora...</p>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 bg-blue-500 text-white text-xs py-2 rounded">Ligar</button>
              <button className="flex-1 bg-blue-500 text-white text-xs py-2 rounded">Navegar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 w-full bg-white border-t">
        <div className="flex justify-around py-2">
          <div className="text-center py-2">
            <Home className="w-5 h-5 mx-auto text-primary" />
            <span className="text-xs text-primary">Home</span>
          </div>
          <div className="text-center py-2">
            <List className="w-5 h-5 mx-auto text-gray-400" />
            <span className="text-xs text-gray-400">Serviços</span>
          </div>
          <div className="text-center py-2">
            <Map className="w-5 h-5 mx-auto text-gray-400" />
            <span className="text-xs text-gray-400">Mapa</span>
          </div>
          <div className="text-center py-2">
            <User className="w-5 h-5 mx-auto text-gray-400" />
            <span className="text-xs text-gray-400">Perfil</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceSelectionMockup() {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-gray-800 mx-auto" style={{ width: '300px', height: '600px' }}>
      {/* Status Bar */}
      <div className="bg-black h-6"></div>
      
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center">
        <ArrowLeft className="w-5 h-5 text-gray-600 mr-3" />
        <div>
          <h2 className="font-bold text-gray-900">Novo Serviço</h2>
          <p className="text-sm text-gray-600">Selecione o equipamento</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar equipamento..." 
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50"
          />
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-2xl">🚜</span>
            </div>
            <h3 className="font-medium text-gray-900">Trator</h3>
            <p className="text-xs text-gray-600">Máquinas agrícolas</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-2xl">🌾</span>
            </div>
            <h3 className="font-medium text-gray-900">Colheitadeira</h3>
            <p className="text-xs text-gray-600">Equipamentos de colheita</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-2xl">🌱</span>
            </div>
            <h3 className="font-medium text-gray-900">Plantadeira</h3>
            <p className="text-xs text-gray-600">Máquinas de plantio</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-2xl">💧</span>
            </div>
            <h3 className="font-medium text-gray-900">Pulverizador</h3>
            <p className="text-xs text-gray-600">Aplicação de defensivos</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-2xl">🔧</span>
            </div>
            <h3 className="font-medium text-gray-900">Implementos</h3>
            <p className="text-xs text-gray-600">Arados, grades, etc.</p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-gray-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-2xl">📦</span>
            </div>
            <h3 className="font-medium text-gray-900">Outros</h3>
            <p className="text-xs text-gray-600">Outros equipamentos</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceDescriptionMockup() {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-gray-800 mx-auto" style={{ width: '300px', height: '600px' }}>
      {/* Status Bar */}
      <div className="bg-black h-6"></div>
      
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center">
        <ArrowLeft className="w-5 h-5 text-gray-600 mr-3" />
        <div>
          <h2 className="font-bold text-gray-900">Trator</h2>
          <p className="text-sm text-gray-600">Descreva o problema</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Descrição do Problema *
          </label>
          <textarea 
            placeholder="Descreva detalhadamente o problema do seu equipamento..."
            className="w-full h-24 p-3 border border-gray-200 rounded-lg bg-gray-50 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">Mínimo 20 caracteres</p>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Urgência
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button className="p-2 border border-gray-200 rounded-lg text-center">
              <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-1"></div>
              <span className="text-xs">Baixa</span>
            </button>
            <button className="p-2 border-2 border-orange-500 bg-orange-50 rounded-lg text-center">
              <div className="w-4 h-4 bg-orange-500 rounded mx-auto mb-1"></div>
              <span className="text-xs font-medium">Média</span>
            </button>
            <button className="p-2 border border-gray-200 rounded-lg text-center">
              <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-1"></div>
              <span className="text-xs">Alta</span>
            </button>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Localização
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center">
            <MapPin className="w-4 h-4 text-green-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-900">Localização Atual</p>
              <p className="text-xs text-gray-600">Fazenda Santa Rita, Ribeirão Preto</p>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Fotos (Opcional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Adicionar fotos</p>
            <p className="text-xs text-gray-500">Até 3 fotos</p>
          </div>
        </div>

        {/* Submit Button */}
        <button className="w-full bg-primary text-white p-4 rounded-lg font-medium mt-6">
          Solicitar Atendimento
        </button>
      </div>
    </div>
  );
}

function ProducerDashboardMockup() {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-gray-800 mx-auto" style={{ width: '300px', height: '600px' }}>
      {/* Status Bar */}
      <div className="bg-black h-6"></div>
      
      {/* Header */}
      <div className="bg-white p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900">Minhas Solicitações</h2>
            <p className="text-sm text-gray-600">2 serviços ativos</p>
          </div>
          <button className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-2 bg-gray-50 border-b">
        <div className="flex space-x-4">
          <button className="px-3 py-1 bg-primary text-white text-sm rounded-full">Todas</button>
          <button className="px-3 py-1 text-gray-600 text-sm">Ativas</button>
          <button className="px-3 py-1 text-gray-600 text-sm">Concluídas</button>
        </div>
      </div>

      {/* Service Cards */}
      <div className="p-4 space-y-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900">Trator John Deere 6600</h3>
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">A caminho</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">João Silva - Mecânico</p>
          <p className="text-xs text-gray-500 mb-3">Problema no motor. Ruído estranho...</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              <span>ETA: 15 min</span>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded border border-blue-200">
                <MessageCircle className="w-3 h-3 inline mr-1" />
                Chat
              </button>
              <button className="px-3 py-1 bg-green-50 text-green-600 text-xs rounded border border-green-200">
                <Phone className="w-3 h-3 inline mr-1" />
                Ligar
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900">Plantadeira New Holland</h3>
            <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded">Aguardando</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">Procurando mecânico...</p>
          <p className="text-xs text-gray-500 mb-3">Sistema de distribuição com defeito...</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Há 2 horas</span>
            </div>
            <button className="px-3 py-1 bg-red-50 text-red-600 text-xs rounded border border-red-200">
              Cancelar
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900">Colheitadeira Case IH</h3>
            <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">Concluído</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">Maria Santos - Mecânica</p>
          <p className="text-xs text-gray-500 mb-3">Manutenção preventiva realizada</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <CheckCircle className="w-3 h-3 mr-1" />
              <span>Ontem</span>
            </div>
            <button className="px-3 py-1 bg-yellow-50 text-yellow-600 text-xs rounded border border-yellow-200">
              Avaliar
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 w-full bg-white border-t">
        <div className="flex justify-around py-2">
          <div className="text-center py-2">
            <Home className="w-5 h-5 mx-auto text-primary" />
            <span className="text-xs text-primary">Home</span>
          </div>
          <div className="text-center py-2">
            <List className="w-5 h-5 mx-auto text-gray-400" />
            <span className="text-xs text-gray-400">Serviços</span>
          </div>
          <div className="text-center py-2">
            <Map className="w-5 h-5 mx-auto text-gray-400" />
            <span className="text-xs text-gray-400">Mapa</span>
          </div>
          <div className="text-center py-2">
            <User className="w-5 h-5 mx-auto text-gray-400" />
            <span className="text-xs text-gray-400">Perfil</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapMockup({ userType }: { userType: 'mechanic' | 'producer' }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-gray-800 mx-auto" style={{ width: '300px', height: '600px' }}>
      {/* Status Bar */}
      <div className="bg-black h-6"></div>
      
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center justify-between">
        <h2 className="font-bold text-gray-900">
          {userType === 'mechanic' ? 'Serviços na Região' : 'Acompanhar Serviço'}
        </h2>
        <div className="flex space-x-2">
          <button className="p-2 bg-gray-100 rounded-lg">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 bg-gray-100 rounded-lg">
            <Search className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative bg-green-50 h-96 overflow-hidden">
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200">
          {/* Roads */}
          <div className="absolute top-20 left-0 w-full h-1 bg-gray-300"></div>
          <div className="absolute top-40 left-0 w-full h-1 bg-gray-300"></div>
          <div className="absolute top-10 left-20 w-1 h-full bg-gray-300"></div>
          <div className="absolute top-10 left-40 w-1 h-full bg-gray-300"></div>
          
          {/* Location Pins */}
          <div className="absolute top-16 left-16 w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          
          <div className="absolute top-36 left-36 w-6 h-6 bg-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          
          <div className="absolute top-28 left-48 w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>

          {/* User location */}
          <div className="absolute bottom-32 left-32 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse"></div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-sm">
          <button className="p-2 border-b border-gray-200">
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2">
            <span className="w-4 h-4 flex items-center justify-center text-gray-600 font-bold">-</span>
          </button>
        </div>

        {/* Current Location Button */}
        <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
        </button>
      </div>

      {/* Bottom Info Panel */}
      <div className="bg-white p-4 border-t">
        {userType === 'mechanic' ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">3 serviços próximos</h3>
              <span className="text-sm text-gray-600">Raio: 15km</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-900">Trator - Urgente</span>
                </div>
                <span className="text-xs text-gray-600">2.5km</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-900">Colheitadeira</span>
                </div>
                <span className="text-xs text-gray-600">4.1km</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">João Silva a caminho</h3>
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">ETA: 15min</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Distância: 3.2km</span>
              <div className="flex space-x-2">
                <button className="p-1 bg-green-100 rounded">
                  <Phone className="w-3 h-3 text-green-600" />
                </button>
                <button className="p-1 bg-blue-100 rounded">
                  <MessageCircle className="w-3 h-3 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceDetailsMockup() {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-gray-800 mx-auto" style={{ width: '300px', height: '600px' }}>
      {/* Status Bar */}
      <div className="bg-black h-6"></div>
      
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center">
        <ArrowLeft className="w-5 h-5 text-gray-600 mr-3" />
        <div>
          <h2 className="font-bold text-gray-900">Trator John Deere 6600</h2>
          <div className="flex items-center">
            <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded mr-2">Pendente</span>
            <span className="text-xs text-gray-500">há 2 horas</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 overflow-y-auto" style={{ height: 'calc(100% - 140px)' }}>
        {/* Producer Info */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">CS</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Carlos Eduardo Santos</h3>
              <div className="flex items-center text-sm text-gray-600">
                <div className="flex text-yellow-500 mr-2">
                  ⭐⭐⭐⭐⭐
                </div>
                <span>4.8 (23 avaliações)</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Phone className="w-4 h-4 mr-1" />
              <span>(11) 98765-4321</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>2.5km de distância</span>
            </div>
          </div>
        </div>

        {/* Problem Description */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Descrição do Problema</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            Trator John Deere 6600 apresentando problema no motor. Está fazendo ruído estranho durante operação e 
            perdendo potência. Necessário diagnóstico urgente pois é época de colheita.
          </p>
        </div>

        {/* Service Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Equipamento</h4>
            <p className="text-sm text-gray-600">Trator</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Urgência</h4>
            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">Alta</span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Localização</h4>
            <p className="text-sm text-gray-600">Fazenda Santa Rita</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Solicitado</h4>
            <p className="text-sm text-gray-600">15/01 - 10:30</p>
          </div>
        </div>

        {/* Photos */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Fotos do Problema</h4>
          <div className="flex space-x-2">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-xs">📷</span>
            </div>
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-xs">📷</span>
            </div>
          </div>
        </div>

        {/* Location Button */}
        <button className="w-full bg-blue-50 border border-blue-200 text-blue-600 p-3 rounded-lg flex items-center justify-center">
          <MapPin className="w-4 h-4 mr-2" />
          Ver Localização no Mapa
        </button>
      </div>

      {/* Actions */}
      <div className="absolute bottom-0 w-full bg-white border-t p-4">
        <div className="flex space-x-3">
          <button className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium">
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Aceitar Serviço
          </button>
          <button className="flex-1 border border-red-300 text-red-600 py-3 rounded-lg font-medium">
            <XCircle className="w-4 h-4 inline mr-2" />
            Recusar
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileMockup({ userType }: { userType: 'mechanic' | 'producer' }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-gray-800 mx-auto" style={{ width: '300px', height: '600px' }}>
      {/* Status Bar */}
      <div className="bg-black h-6"></div>
      
      {/* Header */}
      <div className="bg-white p-4 border-b">
        <div className="flex items-center space-x-3">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {userType === 'mechanic' ? 'JS' : 'CS'}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-100 rounded-full border border-white flex items-center justify-center">
              <Camera className="w-2 h-2 text-gray-600" />
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex-1">
            <h2 className="font-bold text-gray-900">
              {userType === 'mechanic' ? 'João Silva' : 'Carlos Santos'}
            </h2>
            <p className="text-xs text-gray-600">
              {userType === 'mechanic' ? 'Mecânico Especialista' : 'Produtor Rural'}
            </p>
            <div className="flex items-center mt-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs text-gray-600 ml-1">
                {userType === 'mechanic' ? '4.8 (127)' : '4.9 (45)'}
              </span>
            </div>
          </div>
          
          {/* Edit Button */}
          <button className="p-2 bg-gray-100 rounded-lg">
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 overflow-y-auto" style={{ height: 'calc(100% - 140px)' }}>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-900">
              {userType === 'mechanic' ? '127' : '23'}
            </div>
            <p className="text-xs text-gray-600">
              {userType === 'mechanic' ? 'Serviços' : 'Solicitações'}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-900">
              {userType === 'mechanic' ? '98%' : '4.9'}
            </div>
            <p className="text-xs text-gray-600">
              {userType === 'mechanic' ? 'Aprovação' : 'Avaliação'}
            </p>
          </div>
        </div>

        {/* Information Section */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">
            {userType === 'mechanic' ? 'Informações Profissionais' : 'Propriedade'}
          </h3>
          
          {userType === 'mechanic' ? (
            <>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Especialidades</p>
                    <p className="text-xs text-gray-600">Tratores, Colheitadeiras</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Área de Atendimento</p>
                    <p className="text-xs text-gray-600">Ribeirão Preto - 50km</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Fazenda Santa Rita</p>
                    <p className="text-xs text-gray-600">Ribeirão Preto, SP</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Área Total</p>
                    <p className="text-xs text-gray-600">850 hectares</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </>
          )}
        </div>

        {/* Settings */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Configurações</h3>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-gray-900">Notificações</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Moon className="w-4 h-4 text-purple-600" />
              <p className="text-sm text-gray-900">Tema</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-orange-600" />
              <p className="text-sm text-gray-900">Privacidade</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-gray-600" />
              <p className="text-sm text-gray-900">Ajuda</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Logout */}
        <button className="w-full flex items-center justify-center space-x-2 bg-red-50 border border-red-200 text-red-600 py-3 rounded-lg mt-4">
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sair da Conta</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 w-full bg-white border-t">
        <div className="flex justify-around py-2">
          <div className="text-center py-2">
            <Home className="w-5 h-5 mx-auto text-gray-400" />
            <span className="text-xs text-gray-400">Home</span>
          </div>
          <div className="text-center py-2">
            <List className="w-5 h-5 mx-auto text-gray-400" />
            <span className="text-xs text-gray-400">Serviços</span>
          </div>
          <div className="text-center py-2">
            <Map className="w-5 h-5 mx-auto text-gray-400" />
            <span className="text-xs text-gray-400">Mapa</span>
          </div>
          <div className="text-center py-2">
            <User className="w-5 h-5 mx-auto text-primary" />
            <span className="text-xs text-primary">Perfil</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function Monitor({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="4" width="20" height="12" rx="2"/>
      <path d="M2 8h20"/>
      <path d="M8 21h8"/>
      <path d="M12 17v4"/>
    </svg>
  );
}