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

const mockAccounts: Record<string, { pw: string; user: AuthUser }> = {
  "admin@cloudcart.io": {
    pw: "admin",
    user: {
      id: "u_admin",
      email: "admin@cloudcart.io",
      name: "Rahull Ganesh",
      role: "ADMIN",
    },
  },
  "customer@cloudcart.io": {
    pw: "customer",
    user: {
      id: "u_cust",
      email: "customer@cloudcart.io",
      name: "",
      role: "CUSTOMER",
    },
  },
};

function mintTokens(): AuthTokens {
  const now = Date.now();
  return {
    accessToken: `mock.jwt.${btoa(String(now))}`,
    refreshToken: `mock.refresh.${btoa(String(now))}`,
    idToken: `mock.id.${btoa(String(now))}`,
    expiresAt: now + 60 * 60 * 1000,
  };
}

// Mock Cognito — replace with @aws-amplify/auth in production

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      login: async (email, password) => {
        await new Promise((r) => setTimeout(r, 700));
        const acct = mockAccounts[email.toLowerCase()];
        if (!acct || acct.pw !== password) {
          throw new Error("Invalid email or password");
        }
        set({ user: acct.user, tokens: mintTokens(), isAuthenticated: true });
        return acct.user;
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
        const { tokens } = get();
        if (!tokens) return;
        set({ tokens: mintTokens() });
      },
    }),
    { name: "cloudcart.auth" },
  ),
);
