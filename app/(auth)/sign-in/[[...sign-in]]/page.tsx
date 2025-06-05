import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-slate-900 hover:bg-slate-800 text-sm',
            card: 'shadow-xl'
          }
        }}
      />
    </div>
  )
}