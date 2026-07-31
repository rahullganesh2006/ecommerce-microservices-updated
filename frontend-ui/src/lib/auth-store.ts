import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "CUSTOMER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresAt: number;
}
interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string,
    remember: boolean
  ) => Promise<AuthUser>;

  setAuth: (
    user: AuthUser,
    tokens: AuthTokens
  ) => void;

  logout: () => void;

  refresh: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      login: async (email, password) => {
        // Deprecated: Login logic moved to login.tsx for OTP and Google flows
        throw new Error("Use setAuth after login flow");
      },
      setAuth: (user, tokens) => {
        set({
          user,
          tokens,
          isAuthenticated: true,
        });
      },
      logout: () => set({ user: null, tokens: null, isAuthenticated: false }),
      refresh: async () => {
        // In a real app, hit the refresh endpoint here
      },
    }),
    { name: "cloudcart.auth" },
  ),
);
