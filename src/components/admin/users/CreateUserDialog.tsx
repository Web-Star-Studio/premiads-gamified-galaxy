import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminCreateUser } from "@/hooks/admin/useAdminCreateUser";
import UserRoleSelector from "./UserRoleSelector";
import { UserType } from "@/types/auth";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

type FormState = {
  email: string;
  name: string;
  password: string;
  user_type: UserType;
  active: boolean;
};

const initialForm: FormState = {
  email: "",
  name: "",
  password: "",
  user_type: "participante",
  active: true
};

export default function CreateUserDialog({ open, onOpenChange, onCreated }: CreateUserDialogProps) {
  const [form, setForm] = useState<FormState>({
    ...initialForm
  });
  const [loading, setLoading] = useState(false);
  const { createUser } = useAdminCreateUser();

  const canSubmit =
    form.email &&
    form.name &&
    form.password &&
    form.user_type &&
    !loading;

  const submit = async () => {
    setLoading(true);
    const result = await createUser(form);
    setLoading(false);
    if (result.success) {
      setForm({ ...initialForm });
      onCreated();
      onOpenChange(false);
    }
  };

  // Garantir que user_type nunca seja undefined
  const userType = form.user_type || "participante";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar um novo usuário do sistema.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={e => {e.preventDefault(); if (canSubmit) submit();}}>
          <Input
            placeholder="Nome completo"
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          <Input
            placeholder="E-mail"
            type="email"
            value={form.email}
            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
            required
          />
          <Input
            placeholder="Senha"
            type="text"
            value={form.password}
            onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
            required
          />
          <UserRoleSelector 
            currentRole={userType} 
            onRoleChange={(role) => setForm(prev => ({ ...prev, user_type: role as UserType }))} 
          />
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={e => setForm(prev => ({ ...prev, active: e.target.checked }))}
            />
            Ativo
          </label>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              className="bg-neon-pink text-white"
            >
              {loading ? "Criando..." : "Criar Usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
