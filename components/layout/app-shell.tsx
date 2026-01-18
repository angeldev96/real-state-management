"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Recover state from local storage if desired, keeping simple for now
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
  };

  // Don't show sidebar on login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Prevent hydration flicker
  if (!mounted) {
    return (
      <div className="min-h-screen">
        <div className="lg:pl-72">
           <div className="min-h-screen pattern-bg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      <main 
        className={cn(
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:pl-[80px]" : "lg:pl-72"
        )}
      >
        <div className="min-h-screen pattern-bg">
          <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
