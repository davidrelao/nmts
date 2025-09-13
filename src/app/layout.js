import './globals.css'
import ConditionalHeader from '@/components/ConditionalHeader'
import { Toaster, ToastProvider } from '@/components/Toaster'

export const metadata = {
  title: 'Museum Reservation System',
  description: 'Reserve tickets for world-class museums and cultural experiences',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <ConditionalHeader />
          <main>{children}</main>
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  )
}
