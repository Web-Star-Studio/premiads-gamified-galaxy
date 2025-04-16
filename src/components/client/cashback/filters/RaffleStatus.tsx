
import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface RaffleStatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const statuses = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'completed', label: 'Concluídos' },
  { value: 'cancelled', label: 'Cancelados' },
];

const RaffleStatusFilter: React.FC<RaffleStatusFilterProps> = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  
  const getLabel = (value: string) => {
    const status = statuses.find(status => status.value === value);
    return status ? status.label : 'Filtrar por Status';
  };
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Status</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-galaxy-deepPurple border-galaxy-purple/30"
          >
            {getLabel(value)}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 bg-galaxy-darkPurple">
          <Command>
            <CommandInput placeholder="Buscar status..." />
            <CommandEmpty>Nenhum status encontrado</CommandEmpty>
            <CommandGroup>
              {statuses.map(status => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === status.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {status.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RaffleStatusFilter;
