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
    <nav className="w-[100vw] absolute flex justify-between pt-4 pl-4 pr-4">
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
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuItem>
              <Link href="/">Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/about">About us</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/contact">Contact</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/events">Events</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/login">Login</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/sign-up">Sign Up</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList className="w-[90vw] flex flex-row justify-around pl-[35vw] pr-[10vw]">
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/about">About</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/events">Events</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/Contact">Contact</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
              SignIn
            </NavigationMenuTrigger>
            <NavigationMenuContent className="w-35 p-3">
              <ul className="grid w-[150px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="/login">Login</Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="/sign-up">Sign Up</Link>
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
