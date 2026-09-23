import type { ComponentType, ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ForgotPassword } from '@/features/auth/forgot-password'
import { Otp } from '@/features/auth/otp'
import { SignIn } from '@/features/auth/sign-in'
import { SignUp } from '@/features/auth/sign-up'
import { ForbiddenError } from '@/features/errors/forbidden'
import { GeneralError } from '@/features/errors/general-error'
import { MaintenanceError } from '@/features/errors/maintenance-error'
import { NotFoundError } from '@/features/errors/not-found-error'
import { UnauthorisedError } from '@/features/errors/unauthorized-error'

const routerMocks = vi.hoisted(() => ({
  go: vi.fn(),
  navigate: vi.fn(),
}))

const toastMocks = vi.hoisted(() => ({
  add: vi.fn(),
  close: vi.fn(),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => routerMocks.navigate,
  useRouter: () => ({ history: { go: routerMocks.go } }),
}))

vi.mock('@/components/ui/toast', () => ({
  toast: toastMocks,
}))

vi.mock('@/features/auth/sign-in/components/sign-in-form', () => ({
  SignInForm: () => <div data-testid='sign-in-form' />,
}))

vi.mock('@/features/auth/sign-up/components/sign-up-form', () => ({
  SignUpForm: () => <div data-testid='sign-up-form' />,
}))

vi.mock(
  '@/features/auth/forgot-password/components/forgot-password-form',
  () => ({
    ForgotPasswordForm: () => <div data-testid='forgot-password-form' />,
  })
)

vi.mock('@/features/auth/otp/components/otp-form', () => ({
  OtpForm: () => <div data-testid='otp-form' />,
}))

beforeEach(() => {
  routerMocks.go.mockReset()
  routerMocks.navigate.mockReset()
  toastMocks.add.mockReset()
  toastMocks.close.mockReset()
})

describe.each([
  [SignIn, 'Sign in', 'sign-in-form'],
  [SignUp, 'Create an account', 'sign-up-form'],
  [ForgotPassword, 'Forgot Password', 'forgot-password-form'],
  [Otp, 'Two-factor Authentication', 'otp-form'],
] as const)(
  'authentication pages',
  (Page: ComponentType, heading: string, formTestId: string) => {
    it(`renders the ${heading} page`, () => {
      render(<Page />)

      expect(
        screen.getByText(heading, { selector: '[data-slot="card-title"]' })
      ).toBeInTheDocument()
      expect(screen.getByTestId(formTestId)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: 'REM Admin' })
      ).toBeInTheDocument()
    })
  }
)

describe.each([
  [UnauthorisedError, '401', 'Unauthorized Access'],
  [ForbiddenError, '403', 'Access Forbidden'],
  [NotFoundError, '404', 'Oops! Page Not Found!'],
  [GeneralError, '500', "Oops! Something went wrong :')"],
  [MaintenanceError, '503', 'Website is under maintenance!'],
] as const)(
  'HTTP error pages',
  (Page: ComponentType, status: string, message: string) => {
    it(`renders the ${status} page`, () => {
      render(<Page />)

      expect(screen.getByRole('heading', { name: status })).toBeInTheDocument()
      expect(screen.getByText(message)).toBeInTheDocument()
    })
  }
)

it('supports navigating away from an error page', async () => {
  const user = userEvent.setup()
  render(<NotFoundError />)

  await user.click(screen.getByRole('button', { name: 'Go Back' }))
  await user.click(screen.getByRole('button', { name: 'Back to Home' }))

  expect(routerMocks.go).toHaveBeenCalledWith(-1)
  expect(routerMocks.navigate).toHaveBeenCalledWith({ to: '/' })
})

it('shows and removes the sign-in credentials notice', () => {
  const { unmount } = render(<SignIn />)

  expect(toastMocks.add).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'login-credentials',
      title: 'Login credentials',
    })
  )

  unmount()
  expect(toastMocks.close).toHaveBeenCalledWith('login-credentials')
})
