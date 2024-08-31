import { HeaderComponent } from '@/components/component/header-component'
import FooterComponent from '@/components/ui/footer'
import { SignIn } from '@clerk/nextjs'
import React from 'react'

function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderComponent />
      <main className="flex-grow flex justify-center items-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="text-center text-gray-500">
              Get started with your AI journey.
            </p>
          </div>
          <SignIn 
            routing="hash"
            appearance={{
              variables: {
                colorPrimary: '#6366F1',
              },
              elements: {
                rootBox: 'p-4 bg-white shadow-md rounded-lg',
                card: 'space-y-4',
                headerTitle: 'text-2xl font-bold text-gray-900',
                headerSubtitle: 'text-gray-500',
                formFieldInput: 'w-full rounded-md',
                formButtonPrimary: 'w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                footer: 'text-center text-gray-500',
              },
            }}
          />
        </div>
      </main>
      <FooterComponent />
    </div>
  )
}

export default LoginPage

