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
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

export function Sidebar() {
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
          "fixed inset-y-0 left-0 z-40 w-72 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-sidebar-border p-1">
                <Image 
                  src="https://www.eretzltd.com/wp-content/themes/eretz/images/logo.png" 
                  alt="Eretz Realty Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="font-serif text-lg font-semibold tracking-tight">
                  Eretz Realty
                </h1>
                <p className="text-xs text-sidebar-foreground/60">
                  Admin System
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-transform group-hover:scale-110",
                      isActive && "text-sidebar-primary-foreground"
                    )}
                  />
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p
                      className={cn(
                        "text-xs",
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
          <div className="p-4 border-t border-sidebar-border space-y-3">
            {/* User Info */}
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent/30">
                <div className="w-9 h-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-sidebar-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-sidebar-foreground/50 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-4 py-3 h-auto text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="w-5 h-5" />
              <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
