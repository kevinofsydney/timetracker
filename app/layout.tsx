import { Inter } from 'next/font/google'
import { Toaster } from '@/app/components/ui/toaster'
import { Providers } from '@/app/components/providers'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Translator Time Tracking',
  description: 'Time tracking application for translators',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
} 