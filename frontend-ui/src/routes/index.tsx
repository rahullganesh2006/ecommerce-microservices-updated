import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const { isAuthenticated, user } = useAuth.getState();
    if (!isAuthenticated || !user) {
      throw redirect({ to: "/login" });
    }
    throw redirect({ to: user.role === "ADMIN" ? "/admin/dashboard" : "/shop" });
  },
  component: () => null,
});
