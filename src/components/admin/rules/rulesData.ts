
import { 
  ShieldCheck, 
  Users, 
  Gift, 
  Bell, 
  LucideIcon 
} from "lucide-react";

export interface RuleCategory {
  id: string;
  label: string;
  icon: LucideIcon | null;
}

export const ruleCategories: RuleCategory[] = [
  {
    id: "security",
    label: "Segurança",
    icon: ShieldCheck
  },
  {
    id: "users",
    label: "Usuários",
    icon: Users
  },
  {
    id: "raffles",
    label: "Sorteios",
    icon: Gift
  },
  {
    id: "notifications",
    label: "Notificações",
    icon: Bell
  }
];
