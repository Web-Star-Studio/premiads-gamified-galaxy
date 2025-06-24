import { CashbackCampaign, CashbackRedemption } from '@/types/cashback';

// Mock data for cashback campaigns
export const mockCashbackCampaigns: CashbackCampaign[] = [
  {
    id: '1',
    title: 'Super Desconto Tecnologia',
    description: '20% de desconto em produtos eletrônicos',
    advertiser_name: 'Tech Store',
    advertiser_logo: '/mock/tech-logo.png',
    cashback_percentage: 20,
    discount_percentage: 20,
    is_active: true,
    created_at: '2023-01-15T10:30:00Z',
    updated_at: '2023-01-15T10:30:00Z',
    start_date: '2023-01-15T10:30:00Z',
    end_date: '2025-12-31T23:59:59Z',
    category: 'tecnologia'
  },
  {
    id: '2',
    title: 'Gastronomia Premium',
    description: '10% de cashback em restaurantes parceiros',
    advertiser_name: 'Sabor & Arte',
    advertiser_logo: '/mock/food-logo.png',
    cashback_percentage: 10,
    discount_percentage: 10,
    is_active: true,
    created_at: '2023-02-10T14:20:00Z',
    updated_at: '2023-02-10T14:20:00Z',
    start_date: '2023-02-10T14:20:00Z',
    end_date: '2025-06-30T23:59:59Z',
    category: 'restaurantes'
  },
  {
    id: '3',
    title: 'Farmácia com Desconto',
    description: '15% de desconto em medicamentos',
    advertiser_name: 'Saúde',
    advertiser_logo: '/mock/health-logo.png',
    cashback_percentage: 15,
    discount_percentage: 15,
    is_active: true,
    created_at: '2023-03-05T09:15:00Z',
    updated_at: '2023-03-05T09:15:00Z',
    start_date: '2023-03-05T09:15:00Z',
    end_date: '2025-11-30T23:59:59Z',
    category: 'saude'
  },
  {
    id: '4',
    title: 'Beleza Premium',
    description: '25% de cashback em produtos de beleza',
    advertiser_name: 'Beleza',
    advertiser_logo: '/mock/beauty-logo.png',
    cashback_percentage: 25,
    discount_percentage: 25,
    is_active: true,
    created_at: '2023-04-20T11:45:00Z',
    updated_at: '2023-04-20T11:45:00Z',
    start_date: '2023-04-20T11:45:00Z',
    end_date: '2025-10-31T23:59:59Z',
    category: 'beleza'
  },
  {
    id: '5',
    title: 'Serviços Especiais',
    description: '30% de desconto em serviços domésticos',
    advertiser_name: 'Serviços',
    advertiser_logo: '/mock/service-logo.png',
    cashback_percentage: 30,
    discount_percentage: 30,
    is_active: true,
    created_at: '2023-05-15T13:20:00Z',
    updated_at: '2023-05-15T13:20:00Z',
    start_date: '2023-05-15T13:20:00Z',
    end_date: '2025-09-30T23:59:59Z',
    category: 'outros'
  },
  {
    id: '6',
    title: 'Descontos no Varejo',
    description: '5% de cashback em compras no varejo',
    advertiser_name: 'Varejo',
    advertiser_logo: '/mock/retail-logo.png',
    cashback_percentage: 5,
    discount_percentage: 5,
    is_active: true,
    created_at: '2023-06-10T16:40:00Z',
    updated_at: '2023-06-10T16:40:00Z',
    start_date: '2023-06-10T16:40:00Z',
    end_date: '2025-08-31T23:59:59Z',
    category: 'outros'
  }
];

// Mock user cashback balance
export const mockUserCashback = 250;

// Generate a redemption code
export const generateRedemptionCode = (): string => `CB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

// Mock function to create a redemption
export const createMockRedemption = (campaignId: string, amount: number): CashbackRedemption => ({
    id: Math.random().toString(36).substring(2, 15),
    campaign_id: campaignId,
    user_id: 'mock-user-id',
    amount,
    status: 'pending',
    code: generateRedemptionCode(),
    created_at: new Date().toISOString(),
    redeemed_at: null
  });
