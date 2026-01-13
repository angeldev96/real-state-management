import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/layout/sidebar";
import { Providers } from "@/components/providers/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eretz Realty Admin",
  description: "Listing Management & Drip Campaign Automation System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <div className="min-h-screen">
            <Sidebar />
            <main className="lg:pl-72">
              <div className="min-h-screen pattern-bg">
                <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                  {children}
                </div>
              </div>
            </main>
          </div>
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
