
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserRoleSelector from "./UserRoleSelector";
import { useUserOperations } from "@/hooks/admin/useUserOperations";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/hooks/admin/useUsers";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onUpdated: () => void;
}

export default function EditUserDialog({
  open,
  onOpenChange,
  user,
  onUpdated
}: EditUserDialogProps) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    user_type: user.role,
    status: user.status,
    newPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { updateUserStatus } = useUserOperations();

  const updateUserStatusHandler = async (active: boolean) => {
    setLoading(true);
    await updateUserStatus(user.id, active);
    setLoading(false);
    onUpdated();
  };

  const updateRoleHandler = async (newRole: string) => {
    // Not implemented: would require patching user_type in profiles table
    // Can be implemented in future
    toast({
      title: "Não implementado",
      description: "Alterar papel do usuário só é possível via suporte.",
      variant: "destructive"
    });
  };

  const updatePasswordHandler = async () => {
    // Not implemented: would require admin edge function to send password reset
    toast({
      title: "Não implementado",
      description: "Redefinir senha do usuário só é possível via suporte.",
      variant: "destructive"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Edite os detalhes deste usuário. A alteração de papel ou redefinição de senha só é possível via suporte.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); }}>
          <Input placeholder="Nome completo" value={form.name} disabled />
          <Input placeholder="E-mail" value={form.email} disabled />
          <UserRoleSelector currentRole={form.user_type} onRoleChange={(role) => updateRoleHandler(role)} disabled />
          {/* Status Toggle */}
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={form.status === "active"}
              onChange={e => updateUserStatusHandler(e.target.checked)}
              disabled={loading}
            />
            Ativo
          </label>
          {/* Change password */}
          <Input
            placeholder="Nova senha"
            type="password"
            value={form.newPassword}
            onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
            disabled
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
            <Button type="button" variant="secondary" disabled>
              Salvar (desabilitado)
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
