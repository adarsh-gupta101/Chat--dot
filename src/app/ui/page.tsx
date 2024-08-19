import { SidebarComponent } from '@/components/component/SidebarComponent'
import UIComponent from '@/components/component/ui-component'
import React from 'react'

function page() {
  return (
    <div className='h-screen flex '>
      <SidebarComponent />
      <UIComponent/>
    </div>
  )
}

export default page
