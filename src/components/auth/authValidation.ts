
/** Shared validation functions for auth forms */

export const validateSignup = ({
  name,
  email,
  password,
  confirmPassword,
}: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  let valid = true;
  const errors: Record<string, string> = {};

  if (!name.trim()) {
    errors.name = "Nome é obrigatório";
    valid = false;
  }

  if (!email.trim()) {
    errors.email = "Email é obrigatório";
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email inválido";
    valid = false;
  }

  if (!password.trim()) {
    errors.password = "Senha é obrigatória";
    valid = false;
  } else if (password.length < 6) {
    errors.password = "Senha deve ter pelo menos 6 caracteres";
    valid = false;
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "As senhas não coincidem";
    valid = false;
  }

  return { valid, errors };
};

export const validateLogin = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  let valid = true;
  const errors: Record<string, string> = {};

  if (!email.trim()) {
    errors.email = "Email é obrigatório";
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email inválido";
    valid = false;
  }

  if (!password.trim()) {
    errors.password = "Senha é obrigatória";
    valid = false;
  }

  return { valid, errors };
};
