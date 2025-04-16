
import { Campaign } from "@/components/advertiser/campaignData";

export const mockCampaigns: Campaign[] = [
  {
    id: 1,
    title: "Campanha de Verão",
    status: "ativa",
    audience: "jovens",
    completions: 120,
    reward: "100-200",
    expires: "01/05/2023"
  },
  {
    id: 2,
    title: "Promoção Relâmpago",
    status: "ativa",
    audience: "todos",
    completions: 45,
    reward: "50-150",
    expires: "15/06/2023"
  },
  {
    id: 3,
    title: "Campanha Nova",
    status: "rascunho",
    audience: "adultos",
    completions: 0,
    reward: "75-125",
    expires: "30/07/2023"
  }
];
