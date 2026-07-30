import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/unauthorized")({
  component: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
          <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">403 — Unauthorized</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your role doesn't have access to this resource.</p>
        <Button asChild className="mt-6 bg-gradient-brand">
          <Link to="/login">Back to sign in</Link>
        </Button>
      </div>
    </div>
  ),
});
