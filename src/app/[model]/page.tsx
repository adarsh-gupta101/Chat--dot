import { SidebarComponent } from '@/components/component/SidebarComponent'
import SingleChatComponent from '@/components/component/single-chat-component'
import { Sidebar } from '@/components/ui/sidebar'
import React from 'react'
import { notFound } from 'next/navigation';


const VALID_MODELS = ['openai', 'claude', 'google'];

function page({ params }: { params: { model: string } }) {
  if (!VALID_MODELS.includes(params.model)) {
    notFound();
  }
  return (
    <div className='h-screen flex'>
      <SidebarComponent />
      <SingleChatComponent model={params.model}/>
    </div>
  )
}

export default page
