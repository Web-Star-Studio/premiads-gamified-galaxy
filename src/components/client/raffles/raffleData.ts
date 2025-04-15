
// Mock data for raffles
export const RAFFLES = [
  {
    id: 1,
    name: "Sorteio Semanal de Pontos",
    description: "Participe do sorteio semanal e concorra a pontos extras e benefícios exclusivos. Quanto mais tickets, maiores suas chances!",
    startDate: "2025-04-15",
    endDate: "2025-04-22",
    drawDate: "2025-04-23",
    ticketsRequired: 1,
    status: "active",
    maxTicketsPerUser: 10,
    totalParticipants: 147,
    prizes: [
      { id: 1, name: "5000 Pontos", rarity: "common", probability: 60, image: "https://source.unsplash.com/random/100x100/?coin" },
      { id: 2, name: "10000 Pontos", rarity: "uncommon", probability: 30, image: "https://source.unsplash.com/random/100x100/?diamond" },
      { id: 3, name: "Premium por 1 mês", rarity: "rare", probability: 10, image: "https://source.unsplash.com/random/100x100/?crown" }
    ]
  },
  {
    id: 2,
    name: "Loot Box Especial",
    description: "Uma loot box recheada de itens exclusivos e raros para personalizar sua experiência. Participe agora!",
    startDate: "2025-04-17",
    endDate: "2025-04-24",
    drawDate: "2025-04-25",
    ticketsRequired: 3,
    status: "active",
    maxTicketsPerUser: 5,
    totalParticipants: 72,
    prizes: [
      { id: 4, name: "Skin Exclusiva", rarity: "common", probability: 55, image: "https://source.unsplash.com/random/100x100/?skin" },
      { id: 5, name: "Título Raro", rarity: "uncommon", probability: 35, image: "https://source.unsplash.com/random/100x100/?title" },
      { id: 6, name: "Pacote VIP", rarity: "legendary", probability: 10, image: "https://source.unsplash.com/random/100x100/?vip" }
    ]
  },
  {
    id: 3,
    name: "Sorteio de Eletrônicos",
    description: "Concorra a incríveis produtos eletrônicos! Este é um sorteio especial com prêmios físicos que serão enviados diretamente para sua casa.",
    startDate: "2025-04-10",
    endDate: "2025-05-10",
    drawDate: "2025-05-12",
    ticketsRequired: 5,
    status: "active",
    maxTicketsPerUser: 3,
    totalParticipants: 238,
    prizes: [
      { id: 7, name: "Fone de Ouvido", rarity: "uncommon", probability: 70, image: "https://source.unsplash.com/random/100x100/?headphones" },
      { id: 8, name: "SmartWatch", rarity: "rare", probability: 25, image: "https://source.unsplash.com/random/100x100/?smartwatch" },
      { id: 9, name: "Smartphone", rarity: "legendary", probability: 5, image: "https://source.unsplash.com/random/100x100/?smartphone" }
    ]
  }
];

// Mock user data
export const USER_TICKETS = 8;

export interface Prize {
  id: number;
  name: string;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  probability: number;
  image: string;
}

export interface Raffle {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  drawDate: string;
  ticketsRequired: number;
  status: string;
  maxTicketsPerUser: number;
  totalParticipants: number;
  prizes: Prize[];
}

export const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "common": return "text-gray-300";
    case "uncommon": return "text-neon-lime";
    case "rare": return "text-neon-cyan";
    case "legendary": return "text-neon-pink";
    default: return "text-gray-300";
  }
};

export const getRarityBorderColor = (rarity: string) => {
  switch (rarity) {
    case "common": return "border-gray-300/30";
    case "uncommon": return "border-neon-lime/30";
    case "rare": return "border-neon-cyan/30";
    case "legendary": return "border-neon-pink/30";
    default: return "border-gray-300/30";
  }
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
