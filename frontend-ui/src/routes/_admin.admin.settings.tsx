import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_admin/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [dark, setDark] = useState(false);
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
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Settings</h1>
      <Card className="shadow-soft"><CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div><Label className="text-base">Dark mode</Label><p className="text-xs text-muted-foreground">Console theme</p></div>
          <Switch checked={dark} onCheckedChange={toggle} />
        </div>
        <div className="flex items-center justify-between">
          <div><Label className="text-base">Slack alerts</Label><p className="text-xs text-muted-foreground">Post low-stock and failed-payment alerts</p></div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div><Label className="text-base">CloudWatch metrics</Label><p className="text-xs text-muted-foreground">Stream metrics to CW dashboard</p></div>
          <Switch defaultChecked />
        </div>
      </CardContent></Card>
    </div>
  );
}
