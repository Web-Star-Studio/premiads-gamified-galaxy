
export type UserType = 'participante' | 'anunciante' | 'admin' | 'admin-master';

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
  userType?: UserType;
}

export interface SignInCredentials {
  email: string;
  password: string;
}
