import { HeaderComponent } from '@/components/component/header-component'
import FooterComponent from '@/components/ui/footer'
import { SignIn } from '@clerk/nextjs'
import React from 'react'

function LoginPage() {
  return (
    <div className=''>
        <HeaderComponent/>
        <div className="flex justify-center items-center h-[100%] mt-16">

        <SignIn routing='hash'/>
        </div>

        <FooterComponent/>

      
    </div>
  )
}

export default LoginPage

