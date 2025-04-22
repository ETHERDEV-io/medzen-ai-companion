import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Home, 
  Activity, 
  Thermometer, 
  Pill, 
  Target, 
  Search, 
  Bot,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const NavItem = ({ to, label, icon, isActive }: NavItemProps) => (
  <Link to={to}>
    <Button
      variant={isActive ? "default" : "ghost"}
      className={cn(
        "w-full justify-start gap-2",
        isActive ? "bg-primary text-primary-foreground" : ""
      )}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </Button>
  </Link>
);

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    // { path: "/symptom-tracker", label: "Symptom Tracker", icon: <Activity size={20} /> },
    { path: "/medications", label: "Medications", icon: <Pill size={20} /> },
    { path: "/health-goals", label: "Health Goals", icon: <Target size={20} /> },
    { path: "/symptom-checker", label: "Symptom Checker", icon: <Thermometer size={20} /> },
    { path: "/ai-assistant", label: "AI Assistant", icon: <Bot size={20} /> },
    { path: "/legal", label: "Legal", icon: <Shield size={20} /> },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between w-full px-2 sm:px-4">
          <div className="flex items-center gap-2">
            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <Link to="/" className="flex items-center gap-2 py-4">
                  <span className="font-bold text-xl">MedZen</span>
                </Link>
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <NavItem
                      key={item.path}
                      to={item.path}
                      label={item.label}
                      icon={item.icon}
                      isActive={location.pathname === item.path}
                    />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link to="/" className="font-bold text-xl flex items-center gap-2">
              MedZen
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-2">
              {navItems.map((item) => (
                <NavItem
                  key={item.path}
                  to={item.path}
                  label={item.label}
                  icon={item.icon}
                  isActive={location.pathname === item.path}
                />
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" asChild className="hidden md:flex">
              <Link to="/">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 min-h-[80vh]">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MedZen. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:underline flex items-center gap-1">
              <Shield size={15} /> Privacy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:underline flex items-center gap-1">
              <ShieldOff size={15} /> Terms
            </Link>
            <Link to="/legal" className="text-sm text-muted-foreground hover:underline flex items-center gap-1">
              <Shield size={15} /> Legal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
import { Shield, ShieldOff } from "lucide-react";
