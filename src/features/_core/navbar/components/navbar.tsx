import { UserButton } from "@clerk/nextjs";
import { NavbarLogo } from "./navbar-logo";
import { Card } from "@/shared/ui/card";

export function Navbar() {
  return (
    <div className="container py-4">
      <Card className="sticky top-0 rounded-md px-4 py-2 border">
        <div className="flex justify-between items-center">
          <NavbarLogo />
          <UserButton afterSignOutUrl="/" />
        </div>
      </Card>
    </div>
  );
}
