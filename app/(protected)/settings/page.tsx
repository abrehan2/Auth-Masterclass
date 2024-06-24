// IMPORTS -
import { auth, signOut } from "@/auth";
import { authRoutes } from "@/routes";

/**
           * YOU CAN ALSO USE THIS IN CLIENT COMPONENTS BUT NOT BY IMPORTING IT FROM HERE (auth.ts), 
             THIS IS EXCLUSIVELY FOR SERVER COMPONENTS OR SERVER ACTIONS.
           */

export default async function Settings() {
  const session = await auth();

  return (
    <div>
      {JSON.stringify(session)}
      <form
        action={async () => {
          "use server";
          await signOut({
            redirectTo: authRoutes[0],
          });
        }}
      >
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
}
