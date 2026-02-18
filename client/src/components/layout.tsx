import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Search, 
  PlusCircle, 
  Settings, 
  Bell, 
  User, 
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/research/dashboard" },
    { label: "New Search", icon: PlusCircle, href: "/smart-search/new" },
    { label: "Discovery", icon: Search, href: "/research/search" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold tracking-tight text-sidebar-primary flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary border border-sidebar-primary/50">
            <Search className="w-5 h-5" />
          </div>
          DeepResearch
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-sidebar-accent/30 border border-sidebar-border/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Analyst</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">Pro Plan</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Nav */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 bg-sidebar border-sidebar-border">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="opacity-50">Research Mode</span>
            <span>/</span>
            <span className="text-foreground font-medium">
              {navItems.find(i => i.href === location)?.label || "Overview"}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
