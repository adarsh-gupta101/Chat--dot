import { HeaderComponent } from '@/components/component/header-component'
import { SignIn } from '@clerk/nextjs'
import React from 'react'

function LoginPage() {
  return (
    <div className=''>
        <HeaderComponent/>
        <div className="flex justify-center items-center h-[100%] mt-16">

        <SignIn/>
        </div>
      
    </div>
  )
}

export default LoginPage

