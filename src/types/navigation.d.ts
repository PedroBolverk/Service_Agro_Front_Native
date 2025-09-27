// src/types/navigation.d.ts
export type RootStackParamList = {
  Home: undefined; // Para a tela inicial, sem parâmetros
  ServiceDescription: {
    serviceType: string;
    onBack: () => void;
    onSubmit: (description: string) => void;
  };
};
