import Link from 'next/link'

import { Button } from '@/app/components/ui/button'

export default function AuthErrorPage() {
  return (
    <main className="container mx-auto flex min-h-screen items-center justify-center py-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Authentication Error</h1>
          <p className="text-muted-foreground">
            There was a problem signing you in. Please try again.
          </p>
        </div>
        <Button asChild>
          <Link href="/auth/signin">Back to Sign In</Link>
        </Button>
      </div>
    </main>
  )
} 