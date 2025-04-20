
export interface Campaign {
  id: string | number;
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
    title: "Missão #1",
    status: "ativa",
    audience: "todos",
    completions: 324,
    reward: "50",
    expires: "30/05/2025"
  },
  {
    id: 2,
    title: "Promoção Especial",
    status: "pendente",
    audience: "novos",
    completions: 0,
    reward: "100",
    expires: "N/A"
  },
  {
    id: 3,
    title: "Campanha de Fidelidade",
    status: "ativa",
    audience: "nivel3",
    completions: 154,
    reward: "30-60",
    expires: "15/06/2025"
  }
];
