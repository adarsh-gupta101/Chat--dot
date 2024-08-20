"use client";

import { useState, useCallback } from "react";
import { ChatComponent } from "@/components/component/chat-component";
import { SidebarComponent } from "@/components/component/SidebarComponent";
import DashboardScreen from "@/components/component/DashboardScreen";
import { cn } from "@/libs/utils/utils";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1  mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-[100vh]" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      {" "}
      <SidebarComponent />
      <div className="w-full h-[90vh] ">
        <DashboardScreen />
      </div>
    </div>
  );
}
