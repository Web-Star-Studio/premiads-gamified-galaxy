
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calendar, Users, Percent } from 'lucide-react';
import { CashbackCampaign } from './types';

interface CashbackListProps {
  campaigns: CashbackCampaign[];
  onEdit: (campaign: CashbackCampaign) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const CashbackList: React.FC<CashbackListProps> = ({
  campaigns,
  onEdit,
  onDelete,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-40 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign, index) => (
        <motion.div
          key={campaign.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-40 bg-gradient-to-br from-purple-500 to-pink-600">
              <div className="absolute top-2 right-2">
                <Badge variant={campaign.is_active ? "default" : "secondary"}>
                  {campaign.is_active ? "Ativa" : "Inativa"}
                </Badge>
              </div>
              <div className="absolute bottom-2 left-2 text-white">
                <div className="flex items-center gap-1">
                  <Percent className="h-4 w-4" />
                  <span className="text-lg font-bold">{campaign.cashback_percentage}%</span> {/* Fixed: Use cashback_percentage */}
                </div>
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg line-clamp-2">{campaign.title}</CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {campaign.description}
              </p>
              
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Até {new Date(campaign.end_date).toLocaleDateString()}</span>
                </div>
                {campaign.min_purchase && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>Min. R$ {campaign.min_purchase}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(campaign)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(campaign.id)}
                  className="flex-1"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default CashbackList;
