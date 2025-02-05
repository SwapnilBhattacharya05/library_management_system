import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const Header = () => {
  // const pathname = usePathname();
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        {/* <li>
          <Link
            href="/library"
            className={cn(
              "cursor-pointer text-base capitalize",
              pathname === "/library" ? "text-primary" : "text-light-100"
            )}
          >
            Library
          </Link>
        </li> */}

        <li>
          <form
            action={async () => {
              // THIS WILL BE CALLED DIRECTLY ON THE SERVER EVEN THOUGH IT'S A CLICK
              "use server";
              await signOut();
            }}
            className="mb-10"
          >
            <Button>Logout</Button>
          </form>

          {/* <Link href="/my-profile">
            <Avatar>
              <AvatarFallback className="bg-amber-100">
                {getInitials(session?.user?.name || "BW")}
              </AvatarFallback>
            </Avatar>
          </Link> */}
        </li>
      </ul>
    </header>
  );
};

export default Header;
