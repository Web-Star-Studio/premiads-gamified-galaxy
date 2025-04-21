
export interface Campaign {
  id: number;
  title: string;
  status: string;
  audience: string;
  completions: number;
  reward: string;
  expires: string;
}

// Provide some initial mock data for development
export const mockCampaigns: Campaign[] = [
  {
    id: 1,
    title: "Missão #1: Compartilhe nas Redes",
    status: "ativa",
    audience: "todos",
    completions: 423,
    reward: "50-150",
    expires: "30/07/2025",
  },
  {
    id: 2,
    title: "Missão #2: Responda à Pesquisa",
    status: "ativa",
    audience: "premium",
    completions: 189,
    reward: "75-125",
    expires: "15/08/2025",
  },
  {
    id: 3,
    title: "Missão #3: Avalie o Produto",
    status: "pendente",
    audience: "novos",
    completions: 0,
    reward: "100-200",
    expires: "01/09/2025",
  },
  {
    id: 4,
    title: "Missão #4: Indique um Amigo",
    status: "encerrada",
    audience: "todos",
    completions: 721,
    reward: "150-300",
    expires: "01/04/2025",
  },
  {
    id: 5,
    title: "Missão #5: Teste o Novo Recurso",
    status: "ativa",
    audience: "beta",
    completions: 62,
    reward: "75-150",
    expires: "30/06/2025",
  }
];
