
import { CashbackCampaign, CashbackRedemption } from '@/types/cashback';

// Mock data for cashback campaigns
export const mockCashbackCampaigns: CashbackCampaign[] = [
  {
    id: '1',
    title: 'Restaurante Desconto',
    description: 'Ganhe 20% de desconto em restaurantes parceiros',
    advertiser_name: 'Restaurantes',
    advertiser_id: 'rest123',
    advertiser_logo: '/mock/restaurant-logo.png',
    advertiser_image: '/mock/restaurant-banner.jpg',
    discount_percentage: 20,
    conditions: 'Válido de segunda a quinta-feira',
    min_purchase: 50,
    is_active: true,
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2023-01-15T10:00:00Z',
    expires_at: '2025-12-31T23:59:59Z'
  },
  {
    id: '2',
    title: 'Cashback em Tecnologia',
    description: 'Receba 10% de cashback em compras de eletrônicos',
    advertiser_name: 'Tecnologia',
    advertiser_id: 'tech456',
    advertiser_logo: '/mock/tech-logo.png',
    advertiser_image: '/mock/tech-banner.jpg',
    discount_percentage: 10,
    conditions: 'Produtos selecionados. Limite de R$200 em cashback',
    min_purchase: 100,
    is_active: true,
    created_at: '2023-02-10T14:30:00Z',
    updated_at: '2023-02-10T14:30:00Z',
    expires_at: '2025-12-31T23:59:59Z'
  },
  {
    id: '3',
    title: 'Farmácia com Desconto',
    description: '15% de desconto em medicamentos',
    advertiser_name: 'Saúde',
    advertiser_id: 'health789',
    advertiser_logo: '/mock/health-logo.png',
    advertiser_image: '/mock/health-banner.jpg',
    discount_percentage: 15,
    conditions: 'Exceto medicamentos controlados',
    min_purchase: 30,
    is_active: true,
    created_at: '2023-03-05T09:15:00Z',
    updated_at: '2023-03-05T09:15:00Z',
    expires_at: '2025-11-30T23:59:59Z'
  },
  {
    id: '4',
    title: 'Beleza Premium',
    description: '25% de cashback em produtos de beleza',
    advertiser_name: 'Beleza',
    advertiser_id: 'beauty101',
    advertiser_logo: '/mock/beauty-logo.png',
    advertiser_image: '/mock/beauty-banner.jpg',
    discount_percentage: 25,
    conditions: 'Produtos premium selecionados',
    min_purchase: 80,
    is_active: true,
    created_at: '2023-04-20T11:45:00Z',
    updated_at: '2023-04-20T11:45:00Z',
    expires_at: '2025-10-31T23:59:59Z'
  },
  {
    id: '5',
    title: 'Serviços Especiais',
    description: '30% de desconto em serviços domésticos',
    advertiser_name: 'Serviços',
    advertiser_id: 'service202',
    advertiser_logo: '/mock/service-logo.png',
    advertiser_image: '/mock/service-banner.jpg',
    discount_percentage: 30,
    conditions: 'Primeira contratação. Agenda limitada',
    min_purchase: 120,
    is_active: true,
    created_at: '2023-05-15T13:20:00Z',
    updated_at: '2023-05-15T13:20:00Z',
    expires_at: '2025-09-30T23:59:59Z'
  },
  {
    id: '6',
    title: 'Descontos no Varejo',
    description: '5% de cashback em compras no varejo',
    advertiser_name: 'Varejo',
    advertiser_id: 'retail303',
    advertiser_logo: '/mock/retail-logo.png',
    advertiser_image: '/mock/retail-banner.jpg',
    discount_percentage: 5,
    conditions: 'Todas as lojas parceiras. Sem limite de cashback',
    min_purchase: 20,
    is_active: true,
    created_at: '2023-06-10T16:40:00Z',
    updated_at: '2023-06-10T16:40:00Z',
    expires_at: '2025-08-31T23:59:59Z'
  }
];

// Mock user cashback balance
export const mockUserCashback = 250;

// Generate a redemption code
export const generateRedemptionCode = (): string => {
  return `CB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

// Mock function to create a redemption
export const createMockRedemption = (campaignId: string, amount: number): CashbackRedemption => {
  return {
    id: Math.random().toString(36).substring(2, 15),
    campaign_id: campaignId,
    user_id: 'mock-user-id',
    amount: amount,
    status: 'pending',
    code: generateRedemptionCode(),
    created_at: new Date().toISOString(),
    redeemed_at: null
  };
};
