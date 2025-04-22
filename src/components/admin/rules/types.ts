
export interface Rule {
  id: string;
  name: string;
  value: number | string | boolean;
  enabled: boolean;
  description: string;
  lastModified: string;
}

export interface RuleCategory {
  id: string;
  label: string;
  icon: React.ComponentType;
}

export type RulesByCategory = {
  [key: string]: Rule[];
};
