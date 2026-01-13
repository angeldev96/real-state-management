import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Eretz Realty Admin",
  description: "Sign in to access the admin dashboard",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
