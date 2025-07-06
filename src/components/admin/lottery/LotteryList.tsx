import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Trophy, Users, Eye, MoreVertical, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Lottery } from "@/types/lottery";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface LotteryListProps {
  lotteries: Lottery[];
  onViewDetails: (lottery: Lottery) => void;
  onEdit: (lottery: Lottery) => void;
  onDelete: (lotteryId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'completed':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'canceled':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Ativa';
    case 'pending':
      return 'Pendente';
    case 'completed':
      return 'Finalizada';
    case 'canceled':
      return 'Cancelada';
    default:
      return status;
  }
};

const LotteryList = ({ lotteries, onViewDetails, onEdit, onDelete }: LotteryListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lotteryToDelete, setLotteryToDelete] = useState<string | null>(null);

  // Filter out lotteries with null or undefined IDs
  const validLotteries = lotteries.filter(lottery => lottery?.id && lottery.id !== null && lottery.id !== 'null');

  const handleDelete = (lotteryId: string) => {
    // Validate ID before attempting deletion
    if (!lotteryId || lotteryId === 'null' || lotteryId === 'undefined') {
      console.error('Invalid lottery ID for deletion:', lotteryId);
      return;
    }
    
    setLotteryToDelete(lotteryId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (lotteryToDelete && lotteryToDelete !== 'null' && lotteryToDelete !== 'undefined') {
      onDelete(lotteryToDelete);
      setDeleteDialogOpen(false);
      setLotteryToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {validLotteries.map((lottery, index) => (
        <Card key={lottery.id || `lottery-${index}-${Date.now()}`} className="border-gray-800 bg-gray-900/50">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg text-white truncate">{lottery.title || lottery.name}</CardTitle>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{lottery.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <Badge className={getStatusColor(lottery.status)}>
                  {getStatusText(lottery.status)}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onViewDetails(lottery)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </DropdownMenuItem>
                    {lottery.id && lottery.id !== 'null' && (
                      <>
                        <DropdownMenuItem onClick={() => onEdit(lottery)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(lottery.id)}
                          className="text-red-400 focus:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-6 pb-6">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <span className="text-gray-400 whitespace-nowrap">Prêmio:</span>
                <span className="text-white font-medium truncate">
                  {(lottery.prize_type || lottery.prizeType) === 'money' ? 
                    `R$ ${lottery.prize_value || lottery.prizeValue}` : 
                    (lottery.prize_value || lottery.prizeValue)
                  }
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400 whitespace-nowrap">Números:</span>
                <span className="text-white font-medium">
                  {lottery.numbers?.length || 0}/{lottery.numbers_total || lottery.numbersTotal}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-400 whitespace-nowrap">Sorteio:</span>
                <span className="text-white font-medium truncate">
                  {lottery.draw_date || lottery.drawDate ? 
                    format(new Date(lottery.draw_date || lottery.drawDate), "dd/MM/yyyy", { locale: ptBR }) : 
                    'Não definido'
                  }
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 whitespace-nowrap">Tipo:</span>
                <span className="text-white font-medium capitalize truncate">{lottery.type}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewDetails(lottery)}
                className="border-gray-700 hover:bg-gray-800 w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalhes
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir esta rifa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { LotteryList };
export default LotteryList;
