
import { BarChart, Sparkles, Trophy, Target } from "lucide-react";
import { FormData } from "./types";

interface BasicInfoStepProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

const BasicInfoStep = ({ formData, updateFormData }: BasicInfoStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nome da Campanha</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData("title", e.target.value)}
          placeholder="Ex: Desafio Verão 2025"
          className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:border-neon-cyan focus:outline-none"
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Tipo de Missão</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: "survey", label: "Pesquisa", icon: <BarChart className="w-4 h-4 mr-2" /> },
            { id: "social", label: "Social Share", icon: <Trophy className="w-4 h-4 mr-2" /> },
            { id: "creative", label: "Criativo", icon: <Sparkles className="w-4 h-4 mr-2" /> },
            { id: "product", label: "Produto", icon: <Target className="w-4 h-4 mr-2" /> },
          ].map((type) => (
            <div
              key={type.id}
              className={`flex items-center p-3 border rounded-md cursor-pointer transition-all ${
                formData.type === type.id
                  ? "border-neon-cyan bg-neon-cyan/10 text-white"
                  : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500"
              }`}
              onClick={() => updateFormData("type", type.id)}
            >
              {type.icon}
              <span>{type.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Público Alvo</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: "todos", label: "Todos" },
            { id: "novos", label: "Novos" },
            { id: "nivel3", label: "Nível 3+" },
          ].map((audience) => (
            <div
              key={audience.id}
              className={`flex items-center justify-center p-2 border rounded-md cursor-pointer transition-all ${
                formData.audience === audience.id
                  ? "border-neon-cyan bg-neon-cyan/10 text-white"
                  : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500"
              }`}
              onClick={() => updateFormData("audience", audience.id)}
            >
              <span>{audience.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
