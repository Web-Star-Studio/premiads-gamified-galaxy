
export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
  userType?: "participante" | "anunciante";
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export type UserType = "participante" | "anunciante";
