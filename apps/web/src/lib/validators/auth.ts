import * as z from 'zod'

export namespace AuthValidators {
  export const signUpSchema = z
    .object({
      fullname: z
        .string('Fullname is required')
        .min(10, { message: 'Fullname is too short' })
        .max(40, { message: 'Fullname is too long' }),
      phone: z
        .string()
        .min(10, { message: 'Phone number is too short' })
        .max(13, { message: 'Phone number is too long' })
        .regex(
          /(^(\+84|0|0084){1})(3|5|7|8|9)([0-9]{8})$/,
          'Invalid phone number'
        ),
      email: z.email({ error: 'Invalid Email' }),
      password: z
        .string()
        .min(1, 'Please enter your password')
        .min(7, 'Password must be at least 7 characters long'),
      confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match.",
      path: ['confirmPassword'],
    })

  export const signInSchema = z.object({
    email: z.email({ error: 'Invalid Email' }),
    password: z
      .string()
      .min(1, 'Please enter your password')
      .min(6, 'Password must be at least 6 characters long'),
  })

  export type SignIn = z.infer<typeof signInSchema>
  export type SignUp = z.infer<typeof signUpSchema>
}
