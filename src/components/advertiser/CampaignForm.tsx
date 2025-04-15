
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { X, Check, ChevronRight, Calendar, BarChart, Trophy, Target, Sparkles } from "lucide-react";

interface CampaignFormProps {
  onClose: () => void;
}

const CampaignForm = ({ onClose }: CampaignFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    audience: "",
    pointsRange: [30, 50],
    randomPoints: true,
    hasBadges: false,
    hasLootBox: false,
    startDate: "",
    endDate: "",
    streakBonus: false,
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="relative overflow-hidden border-neon-cyan/30 shadow-[0_0_20px_rgba(0,255,231,0.2)]">
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
        onClick={onClose}
      >
        <X className="w-4 h-4" />
      </Button>

      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-heading">
          {step === 1 && "Criar Nova Campanha"}
          {step === 2 && "Definir Recompensas"}
          {step === 3 && "Configurar Datas"}
        </CardTitle>
        <div className="flex items-center mt-2">
          <div className={`h-1 w-1/3 ${step >= 1 ? "bg-neon-cyan" : "bg-gray-700"}`}></div>
          <div className={`h-1 w-1/3 ${step >= 2 ? "bg-neon-cyan" : "bg-gray-700"}`}></div>
          <div className={`h-1 w-1/3 ${step >= 3 ? "bg-neon-cyan" : "bg-gray-700"}`}></div>
        </div>
      </CardHeader>

      <CardContent className="pb-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
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
                  { id: "all", label: "Todos" },
                  { id: "new", label: "Novos" },
                  { id: "level3", label: "Nível 3+" },
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
          </motion.div>
        )}

        {/* Step 2: Rewards */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Pontos</label>
                <div className="text-sm">
                  <span className="mr-3 text-neon-cyan">{formData.pointsRange[0]} - {formData.pointsRange[1]}</span>
                </div>
              </div>
              <Slider
                defaultValue={formData.pointsRange}
                min={10}
                max={200}
                step={5}
                onValueChange={(value) => updateFormData("pointsRange", value)}
                className="py-4"
              />
            </div>

            <div className="flex items-center justify-between px-1 py-2">
              <div className="space-y-1">
                <p className="text-sm font-medium">Pontuação Aleatória</p>
                <p className="text-xs text-gray-400">Os usuários receberão pontos aleatórios dentro do intervalo</p>
              </div>
              <Switch
                checked={formData.randomPoints}
                onCheckedChange={(checked) => updateFormData("randomPoints", checked)}
              />
            </div>

            <div className="flex items-center justify-between px-1 py-2">
              <div className="space-y-1">
                <p className="text-sm font-medium">Badge Exclusivo</p>
                <p className="text-xs text-gray-400">Crie um badge para os usuários que completarem esta missão</p>
              </div>
              <Switch
                checked={formData.hasBadges}
                onCheckedChange={(checked) => updateFormData("hasBadges", checked)}
              />
            </div>

            <div className="flex items-center justify-between px-1 py-2">
              <div className="space-y-1">
                <p className="text-sm font-medium">Loot Box</p>
                <p className="text-xs text-gray-400">Inclui uma chance de prêmio surpresa</p>
              </div>
              <Switch
                checked={formData.hasLootBox}
                onCheckedChange={(checked) => updateFormData("hasLootBox", checked)}
              />
            </div>
          </motion.div>
        )}

        {/* Step 3: Dates & Streaks */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data de Início</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateFormData("startDate", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:border-neon-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Data de Término</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateFormData("endDate", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:border-neon-cyan focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-1 py-2">
              <div className="space-y-1">
                <p className="text-sm font-medium">Bônus de Streak</p>
                <p className="text-xs text-gray-400">Recompensas extras por dias consecutivos</p>
              </div>
              <Switch
                checked={formData.streakBonus}
                onCheckedChange={(checked) => updateFormData("streakBonus", checked)}
              />
            </div>

            {formData.streakBonus && (
              <div className="p-4 border border-neon-pink/30 rounded-md bg-neon-pink/5">
                <p className="text-sm">Configurar bônus de streak</p>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="p-2 text-center border border-gray-700 rounded-md bg-gray-800/50">
                    <p className="text-xs text-gray-400">3 dias</p>
                    <p className="font-medium">+10%</p>
                  </div>
                  <div className="p-2 text-center border border-gray-700 rounded-md bg-gray-800/50">
                    <p className="text-xs text-gray-400">5 dias</p>
                    <p className="font-medium">+25%</p>
                  </div>
                  <div className="p-2 text-center border border-gray-700 rounded-md bg-gray-800/50">
                    <p className="text-xs text-gray-400">7 dias</p>
                    <p className="font-medium">+50%</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 border border-gray-700 rounded-md bg-gray-800/50 mt-4">
              <p className="text-sm font-medium mb-2">Resumo da Campanha</p>
              <div className="space-y-1 text-sm">
                <p>Tipo: <span className="text-neon-cyan">{formData.type || "Não selecionado"}</span></p>
                <p>Público: <span className="text-neon-cyan">{formData.audience || "Não selecionado"}</span></p>
                <p>Pontos: <span className="text-neon-cyan">{formData.pointsRange[0]} - {formData.pointsRange[1]}</span></p>
                <p>Extras: 
                  <span className="text-neon-cyan">
                    {[
                      formData.randomPoints ? "Pontos aleatórios" : "",
                      formData.hasBadges ? "Badge exclusivo" : "",
                      formData.hasLootBox ? "Loot box" : "",
                      formData.streakBonus ? "Bônus de streak" : ""
                    ].filter(Boolean).join(", ") || "Nenhum"}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              Voltar
            </Button>
          ) : (
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          )}

          <Button 
            onClick={handleNext}
            className="bg-gradient-to-r from-purple-600/60 to-pink-500/60 hover:from-purple-600/80 hover:to-pink-500/80"
          >
            {step === 3 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Finalizar
              </>
            ) : (
              <>
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignForm;
