"use client";

// IMPORTS -
import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ExtendedUser } from "@/next.auth";

export default function ClientPage() {
  const user = useCurrentUser();

  return <UserInfo user={user as ExtendedUser} label="Client Component" />;
}
