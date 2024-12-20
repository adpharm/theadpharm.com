import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { tableUsers } from "@/db/schema";
import { logout } from "@/lib/client/logout";
import { User2 } from "lucide-react";

export function UserDropdownMenu({
  user,
}: {
  user: typeof tableUsers.$inferSelect | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <User2 className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {user ? (
            <>Welcome, {user.username}</>
          ) : (
            <>Sign in or create an account to save your progress.</>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user ? (
          <>
            <DropdownMenuItem onClick={logout}>End session</DropdownMenuItem>
          </>
        ) : (
          <>
            {/* "Logging in" or "Registering" is just connecting an account to an existing one, as guest accounts are required */}
            <DropdownMenuItem>Login</DropdownMenuItem>
            <DropdownMenuItem>Register</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
