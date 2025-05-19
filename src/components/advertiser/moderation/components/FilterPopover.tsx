
import { useState } from "react";
import { Check, Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

// Interface simplificada para FilterOptions
interface FilterOptions {
  missionId?: string;
  status?: string;
  searchQuery?: string;
}

// Componente simplificado para funcionar sem os hooks faltantes
export const FilterPopover = ({ onChange, filterOptions }: { 
  onChange: (options: FilterOptions) => void; 
  filterOptions: FilterOptions;
}) => {
  const [open, setOpen] = useState(false);
  // Mock data para evitar dependência de useAdvertiserMissions
  const missions = [
    { id: '1', title: 'Missão teste 1' },
    { id: '2', title: 'Missão teste 2' }
  ];
  const loading = false;
  const selectedMission = missions.find(m => m.id === filterOptions.missionId);

  const handleSelectMission = (missionId: string) => {
    onChange({
      ...filterOptions,
      missionId: missionId === "all" ? undefined : missionId
    });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline"
          size="sm"
          className={`h-9 gap-1 ${selectedMission ? 'border-neon-cyan text-neon-cyan' : ''}`}
        >
          <Filter className="h-4 w-4" />
          <span>Filtrar</span>
          {selectedMission && (
            <span className="ml-1 rounded-md bg-neon-cyan/20 px-1.5 py-0.5 text-xs font-medium text-neon-cyan">
              {selectedMission.title}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar por missão..." className="h-9" />
          <CommandEmpty>Nenhuma missão encontrada.</CommandEmpty>
          <CommandGroup>
            <CommandItem 
              onSelect={() => handleSelectMission("all")}
              className="flex items-center gap-2"
            >
              <div className={`mr-2 h-4 w-4 flex items-center justify-center ${!filterOptions.missionId ? 'text-neon-cyan' : 'opacity-0'}`}>
                <Check className="h-4 w-4" />
              </div>
              <span>Todas as missões</span>
            </CommandItem>
            
            {missions.map((mission) => (
              <CommandItem
                key={mission.id}
                onSelect={() => handleSelectMission(mission.id)}
                className="flex items-center gap-2"
              >
                <div className={`mr-2 h-4 w-4 flex items-center justify-center ${filterOptions.missionId === mission.id ? 'text-neon-cyan' : 'opacity-0'}`}>
                  <Check className="h-4 w-4" />
                </div>
                <span>{mission.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
