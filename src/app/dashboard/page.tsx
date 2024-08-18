"use client";

import { useState, useCallback } from "react";
import { ChatComponent } from "@/components/component/chat-component";
import { SidebarComponent } from "@/components/component/SidebarComponent";
import DashboardScreen from "@/components/component/DashboardScreen";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="   h-screen flex">
      <SidebarComponent />
      <div className="w-full h-[90vh] ">

      <DashboardScreen/>
      </div>
    </div>
  );
}
