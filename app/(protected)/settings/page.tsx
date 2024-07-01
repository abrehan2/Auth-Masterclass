"use client";

// IMPORTS -
import { useCurrentUser } from "@/hooks/use-current-user";
import { signOut } from "next-auth/react";

export default function Settings() {
  const user = useCurrentUser();
  console.log(user);

  return (
    <div className="bg-white p-10 rounded-xl">
      <button type="submit" onClick={() => signOut()}>
        Sign out
      </button>
    </div>
  );
}
