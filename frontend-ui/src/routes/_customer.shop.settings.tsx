import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Bell, Monitor, CreditCard, Smartphone, Loader2, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { updatePassword } from "aws-amplify/auth";
import { useAuth } from "@/lib/auth-store";
import { useBilling, type PaymentMethod } from "@/lib/billing-store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  const nav = useNavigate();
  const logout = useAuth((s) => s.logout);
  const { paymentMethods, addPaymentMethod, removePaymentMethod, setDefault } = useBilling();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCard, setNewCard] = useState({ name: "", number: "", expiry: "", cvc: "" });
  
  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both current and new passwords.");
      return;
    }
    setLoading(true);
    try {
      await updatePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
      });
      toast.success("Password updated successfully! Please log in again.");
      logout();
      nav({ to: "/login" });
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (newCard.expiry.length === 3 && val.length === 2 && newCard.expiry.endsWith("/")) {
      val = val.slice(0, 1);
    } else {
      val = val.replace(/\D/g, "");
      if (val.length >= 2) {
        val = val.substring(0, 2) + "/" + val.substring(2, 4);
      }
    }
    setNewCard({ ...newCard, expiry: val });
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.name || !newCard.number || !newCard.expiry) {
      toast.error("Please fill in all card details.");
      return;
    }
    const last4 = newCard.number.slice(-4) || "0000";
    addPaymentMethod({
      name: newCard.name,
      type: newCard.number.startsWith("4") ? "VISA" : "MASTERCARD",
      last4,
      expiry: newCard.expiry
    });
    toast.success("Payment method added successfully!");
    setIsAddingCard(false);
    setNewCard({ name: "", number: "", expiry: "", cvc: "" });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your preferences, security, and notification settings.</p>
      </div>

      <Tabs defaultValue="appearance" className="w-full flex flex-col md:flex-row gap-8">
        <TabsList className="flex md:flex-col h-auto w-full md:w-64 bg-transparent p-0 gap-2 items-start justify-start">
          <TabsTrigger value="appearance" className="w-full justify-start gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl px-4 py-3">
            <Monitor className="h-4 w-4" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="w-full justify-start gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl px-4 py-3">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="w-full justify-start gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl px-4 py-3">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="w-full justify-start gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl px-4 py-3">
            <CreditCard className="h-4 w-4" /> Billing
          </TabsTrigger>
        </TabsList>

        <div className="flex-1">
          <TabsContent value="appearance" className="mt-0 outline-none">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="shadow-elegant border-border/50 rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50">
                  <CardTitle>Theme Preferences</CardTitle>
                  <CardDescription>Customize how the application looks on your device.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                    </div>
                    <Switch checked={dark} onCheckedChange={setDark} className="data-[state=checked]:bg-primary" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between opacity-50 pointer-events-none">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">High Contrast</Label>
                      <p className="text-sm text-muted-foreground">Improve readability with high contrast colors</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 outline-none">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="shadow-elegant border-border/50 rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50">
                  <CardTitle>Notification Channels</CardTitle>
                  <CardDescription>Choose how you want to be kept in the loop.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive weekly digests and important account updates</p>
                    </div>
                    <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium flex items-center gap-2"><Smartphone className="h-4 w-4"/> Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get real-time alerts on your mobile device</p>
                    </div>
                    <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Marketing & Promos</Label>
                      <p className="text-sm text-muted-foreground">Exclusive deals, flash sales, and early access</p>
                    </div>
                    <Switch className="data-[state=checked]:bg-primary" />
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/10 border-t border-border/50 px-6 py-4">
                  <Button onClick={handleSave} className="bg-gradient-brand shadow-soft w-full sm:w-auto">Save Preferences</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="security" className="mt-0 outline-none">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="shadow-elegant border-border/50 rounded-2xl overflow-hidden mb-6">
                <CardHeader className="bg-muted/30 border-b border-border/50">
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-muted/30 focus-visible:bg-background" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-muted/30 focus-visible:bg-background" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/10 border-t border-border/50 px-6 py-4">
                  <Button onClick={handleUpdatePassword} disabled={loading} variant="default" className="shadow-soft w-full sm:w-auto">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Update Password
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="billing" className="mt-0 outline-none">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
               <Card className="shadow-elegant border-border/50 rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your saved cards and payment methods.</CardDescription>
                  </div>
                  <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-gradient-brand shadow-soft"><Plus className="h-4 w-4 mr-1"/> Add New</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-background border-border">
                      <DialogHeader>
                        <DialogTitle>Add Payment Method</DialogTitle>
                        <DialogDescription>Enter your card details to save for future checkouts.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddCard} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>Name on Card</Label>
                          <Input value={newCard.name} onChange={e => setNewCard({...newCard, name: e.target.value})} placeholder="Rahull Ganesh" required />
                        </div>
                        <div className="space-y-2">
                          <Label>Card Number</Label>
                          <Input value={newCard.number} onChange={e => setNewCard({...newCard, number: e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')})} placeholder="4242 4242 4242 4242" required maxLength={19} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Expiry</Label>
                            <Input value={newCard.expiry} onChange={handleExpiryChange} placeholder="MM/YY" required maxLength={5} />
                          </div>
                          <div className="space-y-2">
                            <Label>CVC</Label>
                            <Input value={newCard.cvc} onChange={e => setNewCard({...newCard, cvc: e.target.value.replace(/\D/g, '')})} placeholder="123" type="password" required maxLength={4} />
                          </div>
                        </div>
                        <div className="pt-4 flex justify-end">
                          <Button type="submit" className="bg-gradient-brand">Save Card</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="p-0">
                  {paymentMethods.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                      <CreditCard className="h-12 w-12 mb-4 opacity-20" />
                      <p>You have no saved payment methods.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {paymentMethods.map(method => (
                        <div key={method.id} className="p-6 flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-16 bg-white rounded-md border flex items-center justify-center text-xs font-bold text-muted-foreground overflow-hidden">
                              {method.type === "MASTERCARD" ? (
                                <div className="flex items-center -space-x-2">
                                  <div className="h-6 w-6 rounded-full bg-red-500/80 mix-blend-multiply" />
                                  <div className="h-6 w-6 rounded-full bg-yellow-500/80 mix-blend-multiply" />
                                </div>
                              ) : method.type === "VISA" ? (
                                <div className="font-bold text-blue-700 italic tracking-tighter text-xl leading-none">VISA</div>
                              ) : (
                                method.type
                              )}
                            </div>
                            <div>
                              <p className="font-medium flex items-center gap-2">
                                {method.type} ending in {method.last4}
                                {method.isDefault && <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">Default</span>}
                              </p>
                              <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!method.isDefault && (
                              <Button variant="ghost" size="sm" onClick={() => setDefault(method.id)}>Set Default</Button>
                            )}
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removePaymentMethod(method.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
