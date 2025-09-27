import { useState } from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";

interface ServiceDescriptionScreenProps {
  serviceType: string;
  onBack: () => void;
  onSubmit: (description: string) => void;
}

export default function ServiceDescriptionScreen({ serviceType, onBack, onSubmit }: ServiceDescriptionScreenProps) {
  const [description, setDescription] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (description.trim()) {
      setIsSubmitted(true);
      // Simular envio
      setTimeout(() => {
        onSubmit(description);
      }, 1500);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 rounded-lg border bg-card">
          <div className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="mb-2">Solicitação Enviada!</h2>
            <p className="text-muted-foreground mb-6">
              Sua solicitação de serviço foi enviada com sucesso. 
              Em breve entraremos em contato.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full h-10 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Nova Solicitação
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="pt-6">
          <button 
            onClick={onBack}
            className="mb-4 pl-0 flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          
          <div className="text-center">
            <h1 className="text-primary mb-2">Descrever Serviço</h1>
            <div className="flex justify-center mb-4">
              <div className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                {serviceType}
              </div>
            </div>
            <p className="text-muted-foreground">
              Descreva detalhadamente o serviço necessário
            </p>
          </div>
        </div>

        {/* Description Form */}
        <div className="p-6 rounded-lg border bg-card">
          <div className="pb-4">
            <h3 className="font-medium">Descrição do Serviço</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Detalhe o problema ou serviço necessário
              </label>
              <textarea
                id="description"
                placeholder="Ex: Trator apresentando problema no motor, fazendo ruídos estranhos durante operação. Necessário diagnóstico completo e possível reparo..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-32 p-3 rounded-lg border bg-input-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                maxLength={500}
              />
              <div className="text-right">
                <span className="text-muted-foreground text-sm">
                  {description.length}/500 caracteres
                </span>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="mb-2 font-medium">Dicas para uma boa descrição:</h4>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li>• Descreva o problema detalhadamente</li>
                <li>• Informe quando o problema começou</li>
                <li>• Mencione modelo e ano do equipamento</li>
                <li>• Inclua sintomas observados</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={!description.trim()}
            className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            Enviar Solicitação
          </button>
        </div>
      </div>
    </div>
  );
}