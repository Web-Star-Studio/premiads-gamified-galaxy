import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const roles = [
  { value: "admin", label: "Administrator" },
  { value: "moderator", label: "Moderator" },
  { value: "anunciante", label: "Anunciante" },
  { value: "participante", label: "Participante" },
] as const;

interface UserRoleSelectorProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  disabled?: boolean;
}

const UserRoleSelector = ({ currentRole, onRoleChange, disabled }: UserRoleSelectorProps) => {
  const [open, setOpen] = useState(false);
  
  // Encontrar o rótulo do papel atual, com fallback para um valor padrão se não encontrado
  const currentRoleLabel = roles.find((role) => role.value === currentRole)?.label || "Participante";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between"
        >
          {currentRoleLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search role..." />
          <CommandList>
            <CommandEmpty>No role found.</CommandEmpty>
            <CommandGroup>
              {roles.map((role) => (
                <CommandItem
                  key={role.value}
                  value={role.value}
                  onSelect={(currentValue) => {
                    if (currentValue) {
                      onRoleChange(currentValue);
                      setOpen(false);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentRole === role.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {role.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default UserRoleSelector;
