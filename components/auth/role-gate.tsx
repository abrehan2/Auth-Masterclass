"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
// IMPORTS -
import { UserRole } from "@prisma/client";
import FormError from "../form-error";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export const RoleGate: React.FC<RoleGateProps> = ({
  allowedRole,
  children,
}) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return <FormError message="You do not have permission to view this" />;
  }

  return <>{children}</>;
};
