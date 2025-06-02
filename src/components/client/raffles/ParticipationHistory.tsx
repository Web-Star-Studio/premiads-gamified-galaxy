
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSounds } from "@/hooks/use-sounds";
import { Calendar, ChevronLeft, ChevronRight, Gift, Search, Ticket, Trophy } from "lucide-react";

// Mock history data
const HISTORY_DATA = [
  {
    id: 1,
    raffleName: "Sorteio Semanal de Pontos",
    ticketsUsed: 2,
    participationDate: "2025-04-08T14:30:00",
    drawDate: "2025-04-09T18:00:00",
    result: "win",
    prize: "5000 Pontos"
  },
  {
    id: 2,
    raffleName: "Loot Box Exclusiva",
    ticketsUsed: 5,
    participationDate: "2025-04-01T10:15:00",
    drawDate: "2025-04-02T18:00:00",
    result: "loss",
    prize: null
  },
  {
    id: 3,
    raffleName: "Sorteio de Eletrônicos",
    ticketsUsed: 3,
    participationDate: "2025-03-25T16:45:00",
    drawDate: "2025-03-26T18:00:00",
    result: "win",
    prize: "Fone de Ouvido"
  },
  {
    id: 4,
    raffleName: "Sorteio Especial de Aniversário",
    ticketsUsed: 1,
    participationDate: "2025-03-15T09:20:00",
    drawDate: "2025-03-16T18:00:00",
    result: "loss",
    prize: null
  },
  {
    id: 5,
    raffleName: "Sorteio Mensal",
    ticketsUsed: 10,
    participationDate: "2025-03-01T11:05:00",
    drawDate: "2025-03-05T18:00:00",
    result: "win",
    prize: "10000 Pontos"
  }
];

const ParticipationHistory = () => {
  const { playSound } = useSounds();
  const [history, setHistory] = useState(HISTORY_DATA);
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
  
  const getResultColor = (result: string) => result === 'win' ? 
      'bg-neon-lime/20 text-neon-lime border-neon-lime/30' : 
      'bg-gray-700/20 text-gray-400 border-gray-600/30';
  
  const getResultText = (result: string) => result === 'win' ? 'Prêmio Ganho' : 'Não Premiado';
  
  // Pagination
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedHistory = history.slice(startIndex, startIndex + itemsPerPage);
  
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
          <span className="text-sm">{history.length} participações</span>
        </div>
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 mx-auto text-gray-500 mb-3" />
          <h3 className="text-lg font-medium mb-2">Nenhuma participação ainda</h3>
          <p className="text-gray-400">
            Você ainda não participou de nenhum sorteio. Converta seus tickets em tickets e tente a sorte!
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-galaxy-purple/20">
                  <TableHead>Sorteio</TableHead>
                  <TableHead className="text-center">Tickets</TableHead>
                  <TableHead>Data de Participação</TableHead>
                  <TableHead>Data do Sorteio</TableHead>
                  <TableHead>Resultado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedHistory.map((entry) => (
                  <TableRow 
                    key={entry.id}
                    className="border-galaxy-purple/10 hover:bg-galaxy-deepPurple/30"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Gift className="w-4 h-4 mr-2 text-neon-pink" />
                        {entry.raffleName}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <Ticket className="w-4 h-4 mr-1 text-neon-cyan" />
                        {entry.ticketsUsed}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm">{formatDate(entry.participationDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm">{formatDate(entry.drawDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge className={`${getResultColor(entry.result)} text-xs`}>
                          {getResultText(entry.result)}
                        </Badge>
                        {entry.prize && (
                          <span className="text-xs text-neon-lime">
                            {entry.prize}
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
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, history.length)} de {history.length} entradas
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
