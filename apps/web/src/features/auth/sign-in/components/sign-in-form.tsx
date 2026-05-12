import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import { cn } from '@/lib/utils'
import { AuthValidators } from '@/lib/validators/auth'
import { useAuth } from '@/context/auth-provider'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup } from '@/components/ui/field'
import {
  FormProvider,
  RHFPasswordField,
  RHFTextField,
} from '@/components/hook-form'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  redirectTo?: string
}

export function SignInForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const { signIn } = useAuth()

  const form = useForm<AuthValidators.SignIn>({
    resolver: zodResolver(AuthValidators.signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: AuthValidators.SignIn) => await signIn(data)

  return (
    <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)}>
      <div className={cn('grid gap-3', className)} {...props}>
        <FieldGroup>
          <RHFTextField
            name='email'
            type='email'
            fieldLabel='Email'
            placeholder='name@example.com'
          />
          <RHFPasswordField
            name='password'
            fieldLabel='Password'
            placeholder='********'
          />
        </FieldGroup>

        <Field orientation={'horizontal'}>
          <Link
            to='/forgot-password'
            className='text-sm font-medium text-muted-foreground hover:opacity-75'
          >
            Forgot password?
          </Link>
        </Field>

        <Button disabled={isSubmitting} type='submit'>
          {isSubmitting ? <Loader2 className='animate-spin' /> : <LogIn />}
          Sign in
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>
              Or continue with
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button variant='outline' type='button' disabled={isSubmitting}>
            <IconGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button variant='outline' type='button' disabled={isSubmitting}>
            <IconFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </div>
    </FormProvider>
  )
}
