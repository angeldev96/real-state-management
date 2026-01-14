"use client";

import { useRouter } from "next/navigation";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
      <Card className="max-w-md w-full border-red-200 shadow-lg">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-900">Access Denied</CardTitle>
          <CardDescription className="text-base">
            You don&apos;t have permission to access this resource
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">
              <strong>Administrator Access Required</strong>
            </p>
            <p className="text-sm text-red-700 mt-2">
              This page is restricted to administrators only. If you believe you should have
              access, please contact your system administrator.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button onClick={() => router.push("/")} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Button>
            <Button onClick={() => router.back()} variant="outline" className="w-full">
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
