
import { CashbackCampaign } from '@/types/cashback';

// Mock data for when no authenticated user is available
export const MOCK_CASHBACK_CAMPAIGNS: CashbackCampaign[] = [
  {
    id: "1",
    advertiser_id: "101",
    title: "Cashback 15% Ciao Moda Masculina",
    description: "Ganhe 15% de cashback em compras acima de R$80",
    discount_percentage: 15,
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    minimum_purchase: 80,
    maximum_discount: 60,
    is_active: true,
    conditions: "Válido para compras acima de R$80",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    advertiser_logo: "https://via.placeholder.com/80x80.png?text=CM",
    advertiser_name: "Ciao Moda Masculina"
  },
  {
    id: "2",
    advertiser_id: "102",
    title: "Cashback 20% Forneria 1121",
    description: "Ganhe 20% de cashback em pizzas",
    discount_percentage: 20,
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    minimum_purchase: 50,
    maximum_discount: 40,
    is_active: true,
    conditions: "Válido para pedidos acima de R$50",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    advertiser_logo: "https://via.placeholder.com/80x80.png?text=F1121",
    advertiser_name: "Forneria 1121"
  },
  {
    id: "3",
    advertiser_id: "103",
    title: "Cashback 25% Homepizza",
    description: "Ganhe 25% de cashback em delivery de pizza",
    discount_percentage: 25,
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    minimum_purchase: 40,
    maximum_discount: 30,
    is_active: true,
    conditions: "Válido para pedidos acima de R$40",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    advertiser_logo: "https://via.placeholder.com/80x80.png?text=HP",
    advertiser_name: "Homepizza"
  }
];

// Mock data for advertiser logos and names
export const advertisers = [
  { 
    name: "Restaurantes", 
    logo: "https://via.placeholder.com/80x80.png?text=R" 
  },
  { 
    name: "Tecnologia", 
    logo: "https://via.placeholder.com/80x80.png?text=T" 
  },
  { 
    name: "Varejo", 
    logo: "https://via.placeholder.com/80x80.png?text=V" 
  },
  { 
    name: "Saúde", 
    logo: "https://via.placeholder.com/80x80.png?text=S" 
  },
  { 
    name: "Beleza", 
    logo: "https://via.placeholder.com/80x80.png?text=B" 
  },
  { 
    name: "Serviços", 
    logo: "https://via.placeholder.com/80x80.png?text=Svc" 
  }
];

// Mock conditions for campaigns
export const conditions = [
  "Válido somente para compras online.",
  "Não cumulativo com outras promoções.",
  "Cashback limitado a uma utilização por CPF.",
  "Válido para todos os produtos da loja, exceto eletrônicos.",
  "Necessário cadastro no programa de fidelidade da loja.",
  "Válido apenas para a primeira compra."
];

// Default mock cashback balance for demo
export const DEFAULT_CASHBACK_BALANCE = 57.25;
