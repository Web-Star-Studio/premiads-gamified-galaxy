
import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminCreateUser } from "@/hooks/admin/useAdminCreateUser";
import UserRoleSelector from "./UserRoleSelector";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}
const initialForm = {
  email: "",
  name: "",
  password: "",
  user_type: "participante",
  active: true
} as const;

export default function CreateUserDialog({ open, onOpenChange, onCreated }: CreateUserDialogProps) {
  const [form, setForm] = useState({
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
    const result = await createUser(form as any);
    setLoading(false);
    if (result.success) {
      setForm({ ...initialForm });
      onCreated();
      onOpenChange(false);
    }
  };

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
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            placeholder="E-mail"
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
          />
          <Input
            placeholder="Senha"
            type="text"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
          />
          <UserRoleSelector currentRole={form.user_type} onRoleChange={role => setForm(f => ({ ...f, user_type: role }))} />
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
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
              loading={loading}
            >
              {loading ? "Criando..." : "Criar Usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
