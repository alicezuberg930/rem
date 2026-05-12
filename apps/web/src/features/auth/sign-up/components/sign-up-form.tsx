import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import { cn } from '@/lib/utils'
import { AuthValidators } from '@/lib/validators/auth'
import { useAuth } from '@/context/auth-provider'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import {
  FormProvider,
  RHFPasswordField,
  RHFTextField,
} from '@/components/hook-form'

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { signUp } = useAuth()

  const form = useForm<AuthValidators.SignUp>({
    resolver: zodResolver(AuthValidators.signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: AuthValidators.SignUp) => await signUp(data)

  return (
    <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)}>
      <div className={cn('grid gap-3', className)} {...props}>
        <FieldGroup>
          <RHFTextField
            name='fullname'
            type='text'
            fieldLabel='Full name'
            placeholder='Hatsune Miku'
          />
          <RHFTextField
            name='phone'
            type='text'
            fieldLabel='Phone'
            placeholder='09333348882'
          />
          <RHFTextField
            name='email'
            fieldLabel='Email'
            placeholder='name@example.com'
          />
          <RHFPasswordField
            name='password'
            fieldLabel='Password'
            placeholder='********'
          />
          <RHFPasswordField
            name='confirmPassword'
            fieldLabel='Confirm Password'
            placeholder='********'
          />
        </FieldGroup>

        <Button className='mt-2' disabled={isSubmitting} type='submit'>
          Create Account
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
          <Button
            variant='outline'
            className='w-full'
            type='button'
            disabled={isSubmitting}
          >
            <IconGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button
            variant='outline'
            className='w-full'
            type='button'
            disabled={isSubmitting}
          >
            <IconFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </div>
    </FormProvider>
  )
}
