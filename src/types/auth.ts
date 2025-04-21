
export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
  userType?: "participante" | "anunciante" | "admin" | "moderator";
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export type UserType = "participante" | "anunciante" | "admin" | "moderator";
