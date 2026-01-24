export interface User {
  id: string;
  email: string;
  hashedPassword: string;
  isChirpyRed: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublic {
  id: string;
  email: string;
  isChirpyRed: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  user: UserPublic;
  accessToken: string;
  refreshToken: string;
}
