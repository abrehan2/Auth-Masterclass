"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import FormSuccess from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// IMPORTS -
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

export default function AdminPage() {
  const role = useCurrentRole();

  const onApiRouteClick = () => {
    fetch("/api/admin").then((res) => {
      if (res.ok) {
        toast.success("You are allowed to see this content!");
      } else toast.error("You are not allowed to see this content!");
    });
  };

  const onServerClick = () => {
    admin().then((res) => {
      if (res.error) {
        toast.error(res.error);
      }
      if (res.success) {
        toast.success(res.success);
      }
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to see this content!" />
        </RoleGate>

        <div
          className="flex flex-row items-center 
        justify-between rounded-lg border p-3 shadow-md
        "
        >
          <p className="text-sm font-medium">Admin-only API Route</p>

          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>

        <div
          className="flex flex-row items-center 
        justify-between rounded-lg border p-3 shadow-md
        "
        >
          <p className="text-sm font-medium">Admin-only Server Action</p>

          <Button onClick={onServerClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
}
