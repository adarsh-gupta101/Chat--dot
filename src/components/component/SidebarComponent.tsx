"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconBrandGoogleFilled,
  IconBrandOpenai,
  IconAi,
  IconDashboard,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/libs/utils/utils";
import DashboardScreen from "./DashboardScreen";
import { useUser } from "@clerk/nextjs";
import { getUserCredits } from "@/libs/user";

export function SidebarComponent() {
  const [credits, setCredits] = useState(0);
  let { user } = useUser();
  // fetch credits remaining

  useEffect(()=>{
   fetch("/api/user/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setCredits(data.credits);
      })
      .catch((err) => {
        console.log(err);
      });
  },[])


  const links = [
    {
      label: "AI Board",
      href: "/dashboard",
      icon: (
        <IconDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Claude",
      href: "/claude",
      icon: (
        <IconAi className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "OpenAI",
      href: "/openai",
      icon: (
        <IconBrandOpenai className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Google AI",
      href: "/google",
      icon: (
        <IconBrandGoogleFilled className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "UI Generator",
      href: "/ui",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <Sidebar open={open} setOpen={() => setOpen(!open)} animate={true}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <>
            <Logo />
          </>
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: user?.fullName as string,
              href: "/profile",
              icon: (
                <Image
                  src={user?.imageUrl as string}
                  alt="user logo"
                  className="h-7 w-7 flex-shrink-0 rounded-full"
                  width={50}
                  height={50}
                />
              ),
            }}
          />
          <SidebarLink
            link={{
              label: `Credits: ${credits ?? 'Loading...'}`,
              href: "/profile",
              icon:null
             
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6  dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0">
        <Image src={"/logo.png"} width={64} height={64} alt="loho" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Chat-dot
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
