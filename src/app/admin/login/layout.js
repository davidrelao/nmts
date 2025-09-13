import { Toaster, ToastProvider } from '@/components/Toaster'

export default function LoginLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ToastProvider>
        {children}
        <Toaster />
      </ToastProvider>
    </div>
  )
}
