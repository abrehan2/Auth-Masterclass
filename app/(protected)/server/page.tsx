// IMPORTS -
import { UserInfo } from "@/components/user-info";
import { CurrentUser } from "@/lib/current-user";
import { ExtendedUser } from "@/next.auth";

export default async function ServerPage() {
  const user = await CurrentUser();

  return <UserInfo user={user as ExtendedUser} label="Server Component" />;
}
