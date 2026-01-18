"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  Menu,
  X,
  LogOut,
  User,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigation = [
  {
    name: "Cycle Manager",
    href: "/",
    icon: LayoutDashboard,
    description: "Weekly email campaigns",
  },
  {
    name: "All Listings",
    href: "/listings",
    icon: Building2,
    description: "Manage properties",
  },
  {
    name: "Schedule",
    href: "/settings",
    icon: Calendar,
    description: "Configure send dates",
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
    description: "Manage admin accounts",
  },
];

interface UserSession {
  userId: number;
  email: string;
  name: string;
  role: string;
}

interface SidebarProps {
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

export function Sidebar({ isCollapsed = false, toggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch user session
  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      }
    }
    fetchSession();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar/50">
      {/* Logo & Toggle */}
      <div 
        className={cn(
          "h-20 flex items-center border-b border-sidebar-border/50",
          isCollapsed ? "justify-center px-2" : "px-6 justify-between"
        )}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex-shrink-0 w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-sidebar-border p-1">
              <Image 
                src="https://www.eretzltd.com/wp-content/themes/eretz/images/logo.png" 
                alt="Eretz Realty Logo" 
                fill
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="font-serif text-lg font-semibold tracking-tight truncate">
                Eretz Realty
              </h1>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                Admin System
              </p>
            </div>
          </div>
        )}
        
        {isCollapsed && (
             <div className="relative w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-sidebar-border p-1">
              <Image 
                src="https://www.eretzltd.com/wp-content/themes/eretz/images/logo.png" 
                alt="Eretz Realty Logo" 
                fill
                className="object-contain"
              />
            </div>
        )}

        {toggleCollapse && !mobileOpen && (
          <Button
             variant="ghost"
             size="icon"
             onClick={toggleCollapse}
             className={cn(
                "hidden lg:flex h-8 w-8 text-sidebar-foreground/50 hover:text-sidebar-foreground",
                isCollapsed && "absolute -right-3 top-24 bg-card border shadow-sm rounded-full z-50 h-6 w-6" 
             )}
          >
             {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={16} />}
          </Button>
        )}
      </div>

       {/* Collapse Toggle Button (Standard Position when expanded) */}
       {toggleCollapse && !mobileOpen && !isCollapsed && (
          <div className="hidden lg:flex justify-end px-4 py-2">
             <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleCollapse}
                className="h-6 w-6 p-0 text-sidebar-foreground/40 hover:text-sidebar-foreground"
             >
                <ChevronLeft size={16} />
             </Button>
          </div>
       )}


      {/* Navigation */}
      <nav className={cn("flex-1 py-6 space-y-2", isCollapsed ? "px-2" : "px-4")}>
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          if (isCollapsed) {
            return (
              <TooltipProvider key={item.name} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex justify-center items-center h-12 rounded-lg transition-all duration-200 group relative",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                          : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5 transition-transform group-hover:scale-110",
                          isActive && "text-sidebar-primary-foreground"
                        )}
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium bg-secondary text-secondary-foreground border-border">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-transform group-hover:scale-110",
                  isActive && "text-sidebar-primary-foreground"
                )}
              />
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p
                  className={cn(
                    "text-xs truncate",
                    isActive
                      ? "text-sidebar-primary-foreground/70"
                      : "text-sidebar-foreground/50"
                  )}
                >
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Section & Logout */}
      <div className={cn("border-t border-sidebar-border space-y-3", isCollapsed ? "p-3" : "p-4")}>
        {/* User Info */}
        {user && (
          <div 
             className={cn(
              "flex items-center gap-3 rounded-lg bg-sidebar-accent/30",
              isCollapsed ? "justify-center p-2" : "px-4 py-3"
             )}
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-sidebar-primary" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/50 truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Logout Button */}
        {isCollapsed ? (
             <TooltipProvider delayDuration={0}>
             <Tooltip>
               <TooltipTrigger asChild>
                 <Button
                   variant="ghost"
                   size="icon"
                   className="w-full justify-center h-10 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
                   onClick={handleLogout}
                   disabled={isLoggingOut}
                 >
                   <LogOut className="w-5 h-5" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent side="right">Sign Out</TooltipContent>
             </Tooltip>
           </TooltipProvider>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-4 py-3 h-auto text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="w-5 h-5" />
            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-sidebar text-sidebar-foreground transform transition-all duration-300 ease-in-out lg:translate-x-0 border-r border-sidebar-border bg-card",
          mobileOpen ? "translate-x-0 w-72" : "-translate-x-full",
          isCollapsed ? "lg:w-[80px]" : "lg:w-72"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
