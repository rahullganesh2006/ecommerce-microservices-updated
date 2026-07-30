import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-store";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export const Route = createFileRoute("/_customer/shop/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const user = useAuth((s) => s.user);
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Profile</h1>
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-brand text-lg text-primary-foreground">
                {user?.name?.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg font-semibold">{user?.name}</div>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1"><Label>Full name</Label><Input defaultValue={user?.name} /></div>
            <div className="space-y-1"><Label>Email</Label><Input defaultValue={user?.email} /></div>
            <div className="space-y-1"><Label>Phone</Label><Input defaultValue="+1 415 555 0132" /></div>
            <div className="space-y-1"><Label>Country</Label><Input defaultValue="United States" /></div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => toast.success("Profile updated")} className="bg-gradient-brand">Save changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 shadow-soft">
        <CardContent className="p-6">
          <h2 className="font-semibold">Security</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1"><Label>Current password</Label><Input type="password" /></div>
            <div className="space-y-1"><Label>New password</Label><Input type="password" /></div>
          </div>
          <div className="mt-4 flex justify-end"><Button variant="outline">Update password</Button></div>
        </CardContent>
      </Card>
    </div>
  );
}
