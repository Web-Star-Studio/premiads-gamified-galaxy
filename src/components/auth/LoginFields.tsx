
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFieldsProps = {
  email: string;
  password: string;
  errors: Record<string, string>;
  loading: boolean;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
};

const LoginFields: React.FC<LoginFieldsProps> = ({
  email,
  password,
  errors,
  loading,
  setEmail,
  setPassword,
}) => (
  <>
    <div>
      <Label htmlFor="email">Email</Label>
      <Input
        type="email"
        id="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        className={errors.email ? "border-red-500" : ""}
      />
      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
    </div>
    <div>
      <Label htmlFor="password">Senha</Label>
      <Input
        type="password"
        id="password"
        placeholder="********"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        className={errors.password ? "border-red-500" : ""}
      />
      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
    </div>
  </>
);

export default LoginFields;
