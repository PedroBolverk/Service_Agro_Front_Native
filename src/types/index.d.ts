// src/types/index.d.ts

export interface ServiceRequest {
  id: string;
  description: string;
  machineType: string;
  status: 'ABERTA' | 'ATRIBUIDA' | 'CANCELADA' | 'CONCLUIDA';
  createdAt: string;
  updatedAt: string;
  // adicione outros campos conforme necessário
}

export interface NewServiceRequest {
  machineType: string;
  description: string;
}

// Prisma Models -> TypeScript Types

export type Role = 'PRODUCER' | 'MECHANIC';

export type StatusAtribuicao = 'PENDENTE' | 'ACEITA' | 'RECUSADA' | 'CANCELADA';

export type RequestStatus = 'ABERTA' | 'ATRIBUIDA' | 'CANCELADA' | 'CONCLUIDA';

interface Users {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: Role;
  phone?: string;
  cpfCnpj?: string;
  stateReg?: string; // inscrição estadual
  mechanic?: Mechanic;
  producer?: {
    photoUrl?: string;
    // Outros campos relacionados ao produtor
  };
  createdAt: Date;
  updatedAt: Date;
  SolicitacaoServicos: SolicitacaoServicos[];
  AtribuicaoServicos: AtribuicaoServicos[];
  Message: Message[];
  ratingsComoProdutor: Rating[];
}

export interface Mechanic {
  userId: string;
  user: Users;
  specialty: string;
  photoUrl: string;
  isAvailable: boolean;
  lat?: number;
  lng?: number;
  updatedAt: Date;
  ratings: Rating[];
}

export interface SolicitacaoServicos {
  id: string;
  producerId: string;
  producer: Users;
  description: string;
  machineType?: string;
  locationLat?: number;
  locationLng?: number;
  scheduledFor?: Date;
  status: RequestStatus;
  createdAt: Date;
  assignments: AtribuicaoServicos[];
  messages: Message[];
  Rating: Rating[];
}

export interface AtribuicaoServicos {
  id: string;
  solicitacaoServicoId: string;
  solicitacaoServico: SolicitacaoServicos;
  mechanicId: string;
  mechanic: Users;
  status: StatusAtribuicao;
  decidedAt?: Date;
  createdAt: Date;
}

export interface Message {
  id: string;
  solicitacaoServicoId: string;
  solicitacaoServico: SolicitacaoServicos;
  senderId: string;
  sender: Users;
  content: string;
  createdAt: Date;
}

export interface Rating {
  id: string;
  mechanicId: string;
  mechanic: Mechanic;
  producerId: string;
  producer: Users;
  solicitacaoServicoId: string;
  solicitacaoServico: SolicitacaoServicos;
  score: number;
  comment?: string;
  createdAt: Date;
}
