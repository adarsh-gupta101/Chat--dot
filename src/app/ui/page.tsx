import { SidebarComponent } from '@/components/component/SidebarComponent'
import UIComponent from '@/components/component/ui-component'
import { cn } from '@/libs/utils/utils'
import React from 'react'

function page() {
  return (
<div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-[100vh]" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >        <SidebarComponent />
      <UIComponent/>
    </div>
  )
}

export default page
