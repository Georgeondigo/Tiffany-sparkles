import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LogOut,
  Home,
  Users,
  MapPin,
  MessageSquare,
  HelpCircle,
  Settings,
  Image,
  Megaphone,
} from "lucide-react";
import HeroEditor from "@/components/admin/HeroEditor";
import ProductsEditor from "@/components/admin/ProductsEditor";
import TestimonialsEditor from "@/components/admin/TestimonialsEditor";
import FAQEditor from "@/components/admin/FAQEditor";
import LocationsEditor from "@/components/admin/LocationsEditor";
import ContactEditor from "@/components/admin/ContactEditor";
import MarketingEditor from "@/components/admin/MarketingEditor";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/admin/auth");
        return;
      }

      const { data: profile, error } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error || !profile || profile.role !== "admin") {
        navigate("/admin/auth");
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/admin/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/auth");
  };

  const goToSite = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:space-x-4">
              <div
                className="flex items-start space-x-2 cursor-pointer"
              >
                <img
                  src="/logo4.png"
                  alt="Tiffany Sparkles Logo"
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <h1 className="text-xl font-display text-primary font-semibold">
                    Tiffany Sparkles Admin
                  </h1> 
                </div>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">
                Welcome, {user?.email}
              </span>
            </div>
            <div className="flex flex-row sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={goToSite}
                className="w-full sm:w-auto"
              >
                <Home className="mr-1 sm:mr-2" size={16} />
                <span className="text-xs sm:text-sm">View Site</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full sm:w-auto"
              >
                <LogOut className="mr-1 sm:mr-2" size={16} />
                <span className="text-xs sm:text-sm">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="hero" className="space-y-6">
          <div className="sticky top-0 z-10 bg-muted/30 backdrop-blur">
            <TabsList className="w-full flex flex-wrap gap-2 sm:grid sm:grid-cols-7 overflow-auto">
              <TooltipProvider>
                {[
                  { value: "hero", icon: <Image size={16} />, label: "Hero" },
                  {
                    value: "products",
                    icon: <Users size={16} />,
                    label: "Products",
                  },
                  {
                    value: "marketing",
                    icon: <Megaphone size={16} />,
                    label: "Marketing",
                  },
                  {
                    value: "testimonials",
                    icon: <MessageSquare size={16} />,
                    label: "Reviews",
                  },
                  {
                    value: "faq",
                    icon: <HelpCircle size={16} />,
                    label: "FAQ",
                  },
                  {
                    value: "locations",
                    icon: <MapPin size={16} />,
                    label: "Stores",
                  },
                  {
                    value: "contact",
                    icon: <Settings size={16} />,
                    label: "Contact",
                  },
                ].map(({ value, icon, label }) => (
                  <Tooltip key={value}>
                    <TooltipTrigger asChild>
                      <TabsTrigger
                        value={value}
                        className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                      >
                        {icon}
                        <span className="hidden sm:inline">{label}</span>
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="sm:hidden">
                      {label}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </TabsList>
          </div>

          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent>
                <HeroEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Featured Products</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductsEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Showcase</CardTitle>
              </CardHeader>
              <CardContent>
                <MarketingEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <CardTitle>Customer Testimonials</CardTitle>
              </CardHeader>
              <CardContent>
                <TestimonialsEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <FAQEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations">
            <Card>
              <CardHeader>
                <CardTitle>Store Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <LocationsEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactEditor />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
