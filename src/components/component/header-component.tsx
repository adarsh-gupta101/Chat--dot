"use client"
import Link from "next/link"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import logo from "../../../public/logo.png";
import Image from "next/image";
import { ModeToggle } from "../theme-toggle";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";


export function HeaderComponent() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <header className="flex items-center justify-between h-16 px-4  top-0 w-full border-b md:px-6  dark:border-gray-800 z-[1000]">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Image alt="logo" src={logo} width={60} height={60} className="w-10 h-10"/>
          <span className="font-bold text-lg">chat-dot.com</span>
        </Link>
      </div>
      <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
        <Link href="/pricing" className="px-4 py-2 rounded-md hover:bg-muted hover:text-foreground" prefetch={false}>
          Pricing
        </Link>
        <Link href="/dashboard" className="px-4 py-2 rounded-md hover:bg-muted hover:text-foreground" prefetch={false}>
          Dashboard
        </Link>
        <SignedOut>

        <Link
          href="/login"
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          prefetch={false}
        >
          Login
        </Link>
        </SignedOut>

        <SignedIn>
        
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src={user?.imageUrl} alt={user?.fullName as string ||""} />
                    <AvatarFallback>{user?.fullName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>{user?.fullName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center text-destructive focus:text-destructive"
                    onSelect={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
         
        </SignedIn>

        <ModeToggle/>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <MenuIcon className="w-6 h-6" />
            {/* <span className="">Toggle navigation menu</span> */}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="md:hidden">
          <nav className="grid gap-4 p-4">
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted hover:text-foreground"
              prefetch={false}
            >
              <DollarSignIcon className="w-4 h-4" />
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted hover:text-foreground"
              prefetch={false}
            >
              <LayoutGridIcon className="w-4 h-4" />
              Dashboard
            </Link>
            <SignedOut>

            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              prefetch={false}
            >
              <UserIcon className="w-4 h-4" />
              Login
            </Link>
            </SignedOut>
            <SignedIn>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Link href="/profile">
                  
                  <Avatar>
                    <AvatarImage src={user?.imageUrl} alt={user?.fullName as string ||""} />
                    <AvatarFallback>{user?.fullName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  </Link>
                </DropdownMenuTrigger>
              </DropdownMenu>
            </SignedIn>

            <ModeToggle/>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}

function DollarSignIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}


function LayoutGridIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  )
}


function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}


