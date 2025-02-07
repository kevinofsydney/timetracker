import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { SignUpForm } from '@/app/components/auth/sign-up-form'

export default async function SignUpPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/')
  }

  return (
    <main className="container mx-auto flex min-h-screen items-center justify-center py-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign up to start tracking your time
          </p>
        </div>
        <SignUpForm />
      </div>
    </main>
  )
} 