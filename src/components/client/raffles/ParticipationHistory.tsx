import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSounds } from "@/hooks/use-sounds";
import { useAuth } from "@/hooks/core/useAuth";
import { useFixedRaffleParticipations } from "@/hooks/client/useFixedRaffleParticipations";
import { Calendar, ChevronLeft, ChevronRight, Gift, Search, Ticket, Trophy } from "lucide-react";

const ParticipationHistory = () => {
  const { playSound } = useSounds();
  const { user } = useAuth();
  const { participations, loading, error } = useFixedRaffleParticipations(user?.id || null);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(4);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      playSound("chime");
    }, 300);
    
    return () => clearTimeout(timer);
  }, [playSound]);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getResultColor = (status: string) => {
    if (status === 'completed') {
      return 'bg-neon-lime/20 text-neon-lime border-neon-lime/30';
    } else if (status === 'active') {
      return 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30';
    }
    return 'bg-gray-700/20 text-gray-400 border-gray-600/30';
  };
  
  const getResultText = (status: string) => {
    if (status === 'completed') return 'Finalizado';
    if (status === 'active') return 'Em Andamento';
    return 'Pendente';
  };
  
  // Pagination
  const totalPages = Math.ceil(participations.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedHistory = participations.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
      playSound("pop");
    }
  };
  
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      playSound("pop");
    }
  };

  if (loading) {
    return (
      <motion.div
        className="glass-panel p-6"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando histórico...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="glass-panel p-6"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 mx-auto text-red-500 mb-3" />
          <h3 className="text-lg font-medium mb-2">Erro ao carregar histórico</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold font-heading">Histórico de Participações</h2>
        <div className="flex items-center">
          <Search className="w-4 h-4 mr-2 text-neon-cyan" />
          <span className="text-sm">{participations.length} participações</span>
        </div>
      </div>
      
      {participations.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 mx-auto text-gray-500 mb-3" />
          <h3 className="text-lg font-medium mb-2">Nenhuma participação ainda</h3>
          <p className="text-gray-400">
            Você ainda não participou de nenhum sorteio. Use suas rifas e tente a sorte!
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-galaxy-purple/20">
                  <TableHead>Sorteio</TableHead>
                  <TableHead className="text-center">Números</TableHead>
                  <TableHead>Data de Participação</TableHead>
                  <TableHead>Data do Sorteio</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedHistory.map((entry) => (
                  <TableRow 
                    key={entry.participation.id}
                    className="border-galaxy-purple/10 hover:bg-galaxy-deepPurple/30"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Gift className="w-4 h-4 mr-2 text-neon-pink" />
                        {entry.raffle.title || entry.raffle.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <Ticket className="w-4 h-4 mr-1 text-neon-cyan" />
                        {entry.participation.numbers.length}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm">{formatDate(entry.participation.created_at)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm">
                          {entry.raffle.draw_date ? formatDate(entry.raffle.draw_date) : 'A definir'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge className={`${getResultColor(entry.raffle.status)} text-xs`}>
                          {getResultText(entry.raffle.status)}
                        </Badge>
                        {entry.raffle.status === 'completed' && entry.raffle.winner && (
                          <span className="text-xs text-neon-lime">
                            {entry.raffle.winner.id === entry.participation.user_id ? 'Você ganhou!' : 'Não premiado'}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-400">
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, participations.length)} de {participations.length} entradas
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                  className="h-8 px-2 border-galaxy-purple/20"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="text-sm">
                  Página {page} de {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="h-8 px-2 border-galaxy-purple/20"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default ParticipationHistory;
