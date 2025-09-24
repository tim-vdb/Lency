import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";
import {
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";

export default function Navbar() {
  return (
    <nav className=" bg-gray-100 w-[100vw] h-[15vh] flex justify-between pt-4 pl-4 pr-4 shadow-md">
      <Link href="/" className="rounded-full">
        <Image
          src="/logo_crhom.jpg"
          alt="Home"
          width={100}
          height={100}
          className="rounded-full"
        />
      </Link>
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-gray-100">
              Open
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" bg-gray-100" align="start">
            <DropdownMenuItem className="bg-gray-100">
              <Link href="/about">A propos</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/Contact">Contact</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/events">Événements</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/login">Connexion</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/sign-up">Inscription</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList className="w-[80vw] flex flex-row justify-around pl-[35vw] pr-[1vw]">
          <NavigationMenuItem className={navigationMenuTriggerStyle()}>
            <NavigationMenuLink asChild>
              <Link href="/about">A propos</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem className={navigationMenuTriggerStyle()}>
            <NavigationMenuLink asChild>
              <Link href="/events">Événements</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem className={navigationMenuTriggerStyle()}>
            <NavigationMenuLink asChild>
              <Link href="/Contact">Contact</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem className={navigationMenuTriggerStyle()}>
            <NavigationMenuTrigger>Se connecter</NavigationMenuTrigger>
            <NavigationMenuContent className="w-35 p-3">
              <ul className="grid w-[150px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="/login" className="text-[0.7em]">
                      Connexion
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="/sign-up" className="text-[0.7em]">
                      Inscription
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
