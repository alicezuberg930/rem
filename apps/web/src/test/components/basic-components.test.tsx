import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ComingSoon } from '@/components/coming-soon'
import LazyLoadImage from '@/components/lazy-load-image/lazy-load-image'
import { PasswordInput } from '@/components/password-input'
import { SkipToMain } from '@/components/skip-to-main'

describe('basic application components', () => {
  it('renders the coming-soon empty state', () => {
    render(<ComingSoon />)

    expect(screen.getByRole('heading', { name: 'Coming Soon!' })).toBeVisible()
    expect(screen.getByText(/stay tuned/i)).toBeVisible()
  })

  it('renders an accessible skip link to the main content', () => {
    render(<SkipToMain />)

    expect(screen.getByRole('link', { name: 'Skip to Main' })).toHaveAttribute(
      'href',
      '#content'
    )
  })

  it('toggles password visibility and respects disabled state', () => {
    const { rerender } = render(
      <PasswordInput placeholder='Password' defaultValue='secret' />
    )
    const input = screen.getByPlaceholderText('Password')
    const button = screen.getByRole('button')

    expect(input).toHaveAttribute('type', 'password')
    fireEvent.click(button)
    expect(input).toHaveAttribute('type', 'text')

    rerender(<PasswordInput placeholder='Password' disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders a placeholder until a lazy image enters the viewport', () => {
    render(
      <LazyLoadImage
        src='/photo.jpg'
        alt='Profile'
        placeholderSrc='/placeholder.jpg'
      />
    )

    expect(screen.getByAltText('placeholder')).toHaveAttribute(
      'src',
      '/placeholder.jpg'
    )
    expect(screen.queryByAltText('Profile')).toBeNull()
  })
})

describe('UI primitives', () => {
  it('forwards button interactions and state', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders badge, input, and textarea attributes', () => {
    render(
      <>
        <Badge variant='secondary'>Active</Badge>
        <Input aria-label='Name' defaultValue='Ada' />
        <Textarea aria-label='Notes' defaultValue='Hello' />
      </>
    )

    expect(screen.getByText('Active')).toBeVisible()
    expect(screen.getByLabelText('Name')).toHaveValue('Ada')
    expect(screen.getByLabelText('Notes')).toHaveValue('Hello')
  })
})
