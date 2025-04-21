
import { useState } from "react";
import { useAuthMethods } from "@/hooks/useAuthMethods";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/Icons";
import { validateFormFields, isValidEmail, isValidPassword, isRequired } from "@/utils/formValidation";

type Props = {
  onSuccess: () => void;
};

const SignupForm = ({ onSuccess }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"participante" | "anunciante">("participante");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { signUp, loading } = useAuthMethods();
  const { toast } = useToast();

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };

  const validateField = (field: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'name':
        if (!isRequired(name)) {
          newErrors.name = "Nome é obrigatório";
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        if (!isRequired(email)) {
          newErrors.email = "Email é obrigatório";
        } else if (!isValidEmail(email)) {
          newErrors.email = "Email inválido";
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!isRequired(password)) {
          newErrors.password = "Senha é obrigatória";
        } else if (!isValidPassword(password)) {
          newErrors.password = "Senha deve ter pelo menos 6 caracteres";
        } else {
          delete newErrors.password;
        }
        break;
      case 'confirmPassword':
        if (password !== confirmPassword) {
          newErrors.confirmPassword = "As senhas não coincidem";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    let formErrors = validateFormFields({
      name,
      email,
      password
    });
    
    if (password !== confirmPassword) {
      formErrors = { ...formErrors, confirmPassword: "As senhas não coincidem" };
    }
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });
    
    if (!validateForm()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos corretamente.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const validUserType = userType === "participante" || userType === "anunciante"
        ? userType
        : "participante";
      
      const success = await signUp({ name, email, password, userType: validUserType });
      
      if (success) {
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Verifique seu email para confirmar seu cadastro.",
        });
        onSuccess();
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Erro",
        description: error?.message || "Não foi possível completar o cadastro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input
          type="text"
          id="name"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => handleBlur('name')}
          disabled={loading}
          className={errors.name && touched.name ? "border-red-500" : ""}
        />
        {errors.name && touched.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur('email')}
          disabled={loading}
          className={errors.email && touched.email ? "border-red-500" : ""}
        />
        {errors.email && touched.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <Label htmlFor="password">Senha</Label>
        <Input
          type="password"
          id="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => handleBlur('password')}
          disabled={loading}
          className={errors.password && touched.password ? "border-red-500" : ""}
        />
        {errors.password && touched.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <Input
          type="password"
          id="confirmPassword"
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => handleBlur('confirmPassword')}
          disabled={loading}
          className={errors.confirmPassword && touched.confirmPassword ? "border-red-500" : ""}
        />
        {errors.confirmPassword && touched.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant={userType === "participante" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setUserType("participante")}
          disabled={loading}
        >
          Participante
        </Button>
        <Button
          type="button"
          variant={userType === "anunciante" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setUserType("anunciante")}
          disabled={loading}
        >
          Anunciante
        </Button>
      </div>
      <Button type="submit" className="w-full neon-button" disabled={loading}>
        {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </form>
  );
};

export default SignupForm;
