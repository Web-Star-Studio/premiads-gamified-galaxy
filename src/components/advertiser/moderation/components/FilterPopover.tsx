import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Check } from "lucide-react";
import { missionService } from '@/services/supabase';
import { useAuth } from '@/hooks/useAuth';
import { FilterOptions } from '../ModerationContent';

interface FilterPopoverProps {
  children: React.ReactNode;
  onFilterChange: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const FilterPopover = ({ children, onFilterChange, currentFilters }: FilterPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedMissionId, setSelectedMissionId] = useState<string | undefined>(currentFilters.missionId);
  const [missions, setMissions] = useState<{ id: string; title: string }[]>([]);
  const { currentUser } = useAuth();
  
  // Carregar missões do anunciante para o filtro
  useEffect(() => {
    const fetchMissions = async () => {
      if (!currentUser?.id) return;
      
      try {
        const fetchedMissions = await missionService.getMissions();
        setMissions(fetchedMissions.map(mission => ({
          id: mission.id,
          title: mission.title
        })));
      } catch (error) {
        console.error('Erro ao carregar missões:', error);
      }
    };
    
    fetchMissions();
  }, [currentUser?.id]);
  
  // Quando as datas mudam
  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange([range.from || null, range.to || null]);
  };
  
  // Aplicar filtros
  const applyFilters = () => {
    onFilterChange({
      ...currentFilters,
      missionId: selectedMissionId,
      dateRange
    });
    setOpen(false);
  };
  
  // Limpar filtros
  const clearFilters = () => {
    setSelectedMissionId(undefined);
    setDateRange([null, null]);
    onFilterChange({
      status: [],
      missionId: undefined,
      dateRange: undefined
    });
    setOpen(false);
  };
  
  // Formatar data para exibição
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('pt-BR');
  };
  
  // Verificar se há filtros ativos
  const hasActiveFilters = !!selectedMissionId || (dateRange[0] !== null || dateRange[1] !== null);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          {children}
          {hasActiveFilters && (
            <Badge 
              variant="default" 
              className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center"
            >
              {(selectedMissionId ? 1 : 0) + ((dateRange[0] || dateRange[1]) ? 1 : 0)}
            </Badge>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-galaxy-darkPurple border-galaxy-purple">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Filtros</h4>
          
          <div className="space-y-2">
            <Label htmlFor="mission">Missão</Label>
            <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto p-1">
              <Button 
                variant={selectedMissionId === undefined ? "default" : "outline"}
                className="justify-start text-sm h-auto py-1.5"
                onClick={() => setSelectedMissionId(undefined)}
              >
                {selectedMissionId === undefined && <Check className="mr-1 h-3 w-3" />}
                Todas as missões
              </Button>
              
              {missions.map(mission => (
                <Button
                  key={mission.id}
                  variant={selectedMissionId === mission.id ? "default" : "outline"}
                  className="justify-start text-sm h-auto py-1.5 truncate"
                  onClick={() => setSelectedMissionId(mission.id)}
                >
                  {selectedMissionId === mission.id && <Check className="mr-1 h-3 w-3" />}
                  {mission.title}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Período</Label>
            <div className="grid gap-2">
              <Calendar
                mode="range"
                selected={{
                  from: dateRange[0] || undefined,
                  to: dateRange[1] || undefined
                }}
                onSelect={handleDateRangeChange}
                numberOfMonths={1}
                className="border border-galaxy-purple rounded-md p-2"
              />
              
              {(dateRange[0] || dateRange[1]) && (
                <div className="text-xs text-muted-foreground">
                  {dateRange[0] ? formatDate(dateRange[0]) : 'Início'} - {dateRange[1] ? formatDate(dateRange[1]) : 'Fim'}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpar
            </Button>
            <Button variant="default" size="sm" onClick={applyFilters}>
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover; 