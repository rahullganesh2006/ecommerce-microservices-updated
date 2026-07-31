import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-store";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { updateUserAttributes } from "aws-amplify/auth";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_customer/shop/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const user = useAuth((s) => s.user);
  const updateUser = useAuth((s) => s.updateUser);
  
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "+91 9876543210");
  const [country, setCountry] = useState(user?.country || "India");
  const [address, setAddress] = useState(user?.address || "");
  const [city, setCity] = useState(user?.city || "");
  const [zip, setZip] = useState(user?.zip || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.phone) setPhone(user.phone);
      if (user.country) setCountry(user.country);
      if (user.address) setAddress(user.address);
      if (user.city) setCity(user.city);
      if (user.zip) setZip(user.zip);
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserAttributes({
        userAttributes: {
          name: name,
          phone_number: phone.startsWith("+") ? phone : `+91${phone}`, // Cognito expects E.164 format
        }
      });
      updateUser({ name, phone, country, address, city, zip });
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
      updateUser({ name, phone, country, address, city, zip });
    } finally {
      setLoading(false);
    }
  };

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
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="space-y-2"><Label>Full Name</Label><Input className="bg-muted/30 focus-visible:bg-background" value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Email Address</Label><Input className="bg-muted/30 focus-visible:bg-background" value={user?.email || ""} disabled /></div>
            <div className="space-y-2"><Label>Phone Number</Label><Input className="bg-muted/30 focus-visible:bg-background" value={phone} onChange={e => setPhone(e.target.value)} /></div>
            <div className="space-y-2"><Label>Country</Label><Input className="bg-muted/30 focus-visible:bg-background" value={country} onChange={e => setCountry(e.target.value)} /></div>
            <div className="space-y-2 sm:col-span-2"><Label>Street Address</Label><Input className="bg-muted/30 focus-visible:bg-background" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St, Apt 4B" /></div>
            <div className="space-y-2"><Label>City</Label><Input className="bg-muted/30 focus-visible:bg-background" value={city} onChange={e => setCity(e.target.value)} placeholder="Chennai" /></div>
            <div className="space-y-2"><Label>ZIP Code</Label><Input className="bg-muted/30 focus-visible:bg-background" value={zip} onChange={e => setZip(e.target.value)} placeholder="600001" /></div>
          </div>
          <div className="mt-8 flex justify-end">
            <Button onClick={handleSave} disabled={loading} className="bg-gradient-brand shadow-soft px-8">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
