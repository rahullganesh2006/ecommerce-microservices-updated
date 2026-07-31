import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-store";
import { updatePassword } from "aws-amplify/auth";
import { toast } from "sonner";
import { Lock, User, Monitor } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const user = useAuth((s) => s.user);
  const [dark, setDark] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem("cc.theme") === "dark";
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
  }, []);

  function toggle(v: boolean) {
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
    localStorage.setItem("cc.theme", v ? "dark" : "light");
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("New passwords do not match");
    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters");
    
    setIsUpdating(true);
    try {
      await updatePassword({ oldPassword, newPassword });
      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and platform preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5 text-primary" /> Profile Information</CardTitle>
              <CardDescription>Your personal account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input value={user?.name || ""} disabled className="bg-muted/50" />
              </div>
              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <Input value={user?.email || ""} disabled className="bg-muted/50" />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Input value={user?.role || "ADMIN"} disabled className="bg-muted/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Monitor className="h-5 w-5 text-primary" /> Preferences</CardTitle>
              <CardDescription>Customize your console experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div><Label className="text-base">Dark mode</Label><p className="text-xs text-muted-foreground">Console theme</p></div>
                <Switch checked={dark} onCheckedChange={toggle} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label className="text-base">Slack alerts</Label><p className="text-xs text-muted-foreground">Post low-stock and failed-payment alerts</p></div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Lock className="h-5 w-5 text-primary" /> Change Password</CardTitle>
              <CardDescription>Update your account password securely.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Current Password</Label>
                  <Input type="password" required value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>New Password</Label>
                  <Input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Confirm New Password</Label>
                  <Input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
                <Button type="submit" disabled={isUpdating} className="w-full mt-2">
                  {isUpdating ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
