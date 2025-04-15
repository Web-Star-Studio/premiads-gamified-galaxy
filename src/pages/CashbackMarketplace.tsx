
import React from 'react';
import { useCashbackMarketplace } from '@/hooks/useCashbackMarketplace';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Wallet, Tag, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CashbackMarketplace: React.FC = () => {
  const { campaigns, userCashback, loading, redeemCashback } = useCashbackMarketplace();
  const navigate = useNavigate();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold neon-text-cyan">Marketplace de Cashback</h1>
        <div className="flex items-center space-x-2">
          <Wallet className="w-6 h-6 text-neon-cyan" />
          <span className="text-xl font-semibold">
            Saldo: R$ {userCashback.toFixed(2)}
          </span>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto w-24 h-24 text-gray-400 mb-4" />
          <p className="text-xl text-gray-300">
            Nenhuma campanha de cashback disponível no momento
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-panel-hover">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {campaign.title}
                    <Tag className="w-6 h-6 text-neon-pink" />
                  </CardTitle>
                  <CardDescription>
                    {campaign.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Desconto:</span>
                      <strong>{campaign.discount_percentage}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Validade:</span>
                      <span>
                        {new Date(campaign.start_date).toLocaleDateString()} 
                        {' até '}
                        {new Date(campaign.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    {campaign.minimum_purchase && (
                      <div className="flex justify-between">
                        <span>Compra mínima:</span>
                        <strong>R$ {campaign.minimum_purchase.toFixed(2)}</strong>
                      </div>
                    )}
                    <Button 
                      className="neon-button w-full mt-4"
                      onClick={() => redeemCashback(campaign.id, userCashback)}
                      disabled={userCashback === 0}
                    >
                      Resgatar Cashback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CashbackMarketplace;
