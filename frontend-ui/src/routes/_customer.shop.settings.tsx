import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_customer/shop/settings")({
  component: SettingsPage,
});

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const v = localStorage.getItem("cc.theme") === "dark";
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
  }, []);
  return {
    dark,
    setDark: (v: boolean) => {
      setDark(v);
      document.documentElement.classList.toggle("dark", v);
      localStorage.setItem("cc.theme", v ? "dark" : "light");
    },
  };
}

function SettingsPage() {
  const { dark, setDark } = useTheme();
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Settings</h1>
      <Card className="shadow-soft">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Dark mode</Label>
              <p className="text-xs text-muted-foreground">Toggle between light and dark theme</p>
            </div>
            <Switch checked={dark} onCheckedChange={setDark} />
          </div>
          <div className="flex items-center justify-between">
            <div><Label className="text-base">Email notifications</Label><p className="text-xs text-muted-foreground">Order updates and offers</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><Label className="text-base">Push notifications</Label><p className="text-xs text-muted-foreground">Real-time order status</p></div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
