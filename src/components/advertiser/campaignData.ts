
export interface Campaign {
  id: number;
  title: string;
  status: string;
  audience: string;
  completions: number;
  reward: string;
  expires: string;
}

export const mockCampaigns: Campaign[] = [
  {
    id: 1,
    title: "Pesquisa de Satisfação",
    status: "ativa",
    audience: "todos",
    completions: 243,
    reward: "30-50",
    expires: "12/06/2025",
  },
  {
    id: 2,
    title: "Teste de Produto",
    status: "pendente",
    audience: "nível 3+",
    completions: 0,
    reward: "100",
    expires: "30/07/2025",
  },
  {
    id: 3,
    title: "Compartilhar nas Redes",
    status: "ativa",
    audience: "todos",
    completions: 124,
    reward: "20-40",
    expires: "05/06/2025",
  },
  {
    id: 4,
    title: "Desafio Criativo",
    status: "encerrada",
    audience: "convite",
    completions: 87,
    reward: "200",
    expires: "10/04/2025",
  },
  {
    id: 5,
    title: "Tutorial de Produto",
    status: "ativa",
    audience: "novos",
    completions: 56,
    reward: "25-75",
    expires: "20/08/2025",
  },
];
