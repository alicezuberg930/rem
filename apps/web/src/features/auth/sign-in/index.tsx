import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import { AuthLayout } from '../auth-layout'
import { SignInForm } from './components/sign-in-form'

const LOGIN_CREDENTIALS_TOAST_ID = 'login-credentials'

export function SignIn() {
  useEffect(() => {
    toast.add({
      id: LOGIN_CREDENTIALS_TOAST_ID,
      type: 'info',
      title: 'Login credentials',
      description: (
        <div className='grid gap-1.5 text-xs'>
          <p>
            <span className='text-muted-foreground'>Username: </span>
            <code className='break-all'>alice.nguyen@example.com</code>
          </p>
          <p>
            <span className='text-muted-foreground'>Password: </span>
            <code>123456789</code>
          </p>
        </div>
      ),
      timeout: 0,
    })

    return () => toast.close(LOGIN_CREDENTIALS_TOAST_ID)
  }, [])

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Sign in</CardTitle>
          <CardDescription>
            Enter your email and password below to log into your account <br />
            Don't have an account?{' '}
            <Link
              to='/sign-up'
              className='underline underline-offset-4 hover:text-primary'
            >
              Sign up
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm redirectTo={'businesses'} />
        </CardContent>
        <CardFooter>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            By clicking sign in, you agree to our{' '}
            <a
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
