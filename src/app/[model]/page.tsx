import { SidebarComponent } from '@/components/component/SidebarComponent'
import SingleChatComponent from '@/components/component/single-chat-component'
import { Sidebar } from '@/components/ui/sidebar'
import React from 'react'
import { notFound } from 'next/navigation';
import { cn } from '@/libs/utils/utils';

 
const VALID_MODELS = ['openai', 'claude', 'google'];

function page({ params }: { params: { model: string } }) {
  if (!VALID_MODELS.includes(params.model)) {
    notFound();
  }
  return (
<div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-[100vh]" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >        <SidebarComponent />
      <SingleChatComponent model={params.model}/>
    </div>
  )
}

export default page
