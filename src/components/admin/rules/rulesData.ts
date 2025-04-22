import { BarChart3, Target, Trophy, Ticket } from "lucide-react";
import { RuleCategory, RulesByCategory } from "./types";

export const ruleCategories: RuleCategory[] = [
  { id: 'points', label: 'Sistema de Pontos', icon: BarChart3 },
  { id: 'missions', label: 'Missões', icon: Target },
  { id: 'rewards', label: 'Recompensas', icon: Trophy },
  { id: 'raffles', label: 'Sorteios', icon: Ticket },
];

export const initialRules: RulesByCategory = {
  points: [
    { 
      id: 'dailyLoginPoints', 
      name: 'Pontos por Login Diário', 
      value: 50, 
      enabled: true,
      description: 'Pontos concedidos ao usuário por fazer login diariamente',
      lastModified: '2025-04-01'
    },
    { 
      id: 'missionCompletionPoints', 
      name: 'Multiplicador de Pontos por Missão', 
      value: 2, 
      enabled: true,
      description: 'Multiplicador aplicado aos pontos ganhos por completar missões',
      lastModified: '2025-04-05'
    },
    { 
      id: 'referralPoints', 
      name: 'Pontos por Indicação', 
      value: 500, 
      enabled: true,
      description: 'Pontos concedidos ao usuário que indicar um novo usuário',
      lastModified: '2025-03-22'
    },
    { 
      id: 'purchasePointsRate', 
      name: 'Taxa de Pontos por Compra', 
      value: 10, 
      enabled: true,
      description: 'Pontos concedidos a cada R$ 1,00 em compras realizadas',
      lastModified: '2025-04-10'
    },
    { 
      id: 'socialSharePoints', 
      name: 'Pontos por Compartilhamento', 
      value: 25, 
      enabled: false,
      description: 'Pontos concedidos ao compartilhar conteúdo nas redes sociais',
      lastModified: '2025-03-18'
    }
  ],
  missions: [
    { 
      id: 'dailyMissionResetTime', 
      name: 'Horário de Reset das Missões Diárias', 
      value: '00:00', 
      enabled: true,
      description: 'Horário em que as missões diárias são resetadas',
      lastModified: '2025-04-02'
    },
    { 
      id: 'maxActiveMissions', 
      name: 'Máximo de Missões Ativas', 
      value: 5, 
      enabled: true,
      description: 'Número máximo de missões que um usuário pode ter ativas simultaneamente',
      lastModified: '2025-04-08'
    },
    { 
      id: 'missionExpirationDays', 
      name: 'Dias para Expiração de Missões', 
      value: 7, 
      enabled: true,
      description: 'Número de dias até uma missão expirar se não for completada',
      lastModified: '2025-03-25'
    }
  ],
  rewards: [
    { 
      id: 'minPointsForReward', 
      name: 'Mínimo de Pontos para Recompensa', 
      value: 1000, 
      enabled: true,
      description: 'Mínimo de pontos necessários para resgatar qualquer recompensa',
      lastModified: '2025-04-03'
    },
    { 
      id: 'rewardProcessingTime', 
      name: 'Tempo de Processamento de Recompensas (horas)', 
      value: 24, 
      enabled: true,
      description: 'Tempo máximo para processar o resgate de uma recompensa',
      lastModified: '2025-04-09'
    },
    { 
      id: 'maxMonthlyRewards', 
      name: 'Máximo de Recompensas Mensais', 
      value: 5, 
      enabled: true,
      description: 'Número máximo de recompensas que um usuário pode resgatar por mês',
      lastModified: '2025-03-30'
    }
  ],
  raffles: [
    { 
      id: 'ticketPointsRate', 
      name: 'Pontos por Ticket de Sorteio', 
      value: 100, 
      enabled: true,
      description: 'Quantidade de pontos necessários para gerar um ticket de sorteio',
      lastModified: '2025-04-04'
    },
    { 
      id: 'maxTicketsPerUser', 
      name: 'Máximo de Tickets por Usuário', 
      value: 50, 
      enabled: true,
      description: 'Número máximo de tickets que um usuário pode ter em um único sorteio',
      lastModified: '2025-04-07'
    },
    { 
      id: 'weeklyRaffleDay', 
      name: 'Dia do Sorteio Semanal', 
      value: 'Sexta-feira', 
      enabled: true,
      description: 'Dia da semana em que o sorteio semanal é realizado',
      lastModified: '2025-03-20'
    }
  ]
};
