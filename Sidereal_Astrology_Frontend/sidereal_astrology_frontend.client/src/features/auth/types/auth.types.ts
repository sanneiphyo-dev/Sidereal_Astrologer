export interface AuthUser {
  userId: number;
  name: string;
  email: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  token?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
}

export interface LoginPayload {
  emailOrName: string;
  password: string;
}
