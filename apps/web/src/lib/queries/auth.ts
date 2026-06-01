import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { ApiResponse, Profile, Role } from '@/@types'
import { httpClient } from '../repository/http-client'
import { AuthValidators } from '../validators/auth'

const keys = {
  profile: () => ['auth', 'profile'],
  role: () => ['auth', 'role'],
  signIn: () => ['auth', 'sign-in'],
  signUp: () => ['auth', 'sign-up'],
  signOut: () => ['auth', 'sign-out'],
  refresh: () => ['auth', 'refresh']
}

export const auth = () => ({
  signIn: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.signIn(),
        mutationFn: async (input: AuthValidators.SignIn) => {
          return await httpClient.post<
            ApiResponse<{
              user: Profile
              accessToken: string
              accessTokenExpiration: string
            }>
          >('/auth/sign-in', { ...input })
        },
      }),
  },

  signUp: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.signUp(),
        mutationFn: async (input: AuthValidators.SignUp) => {
          return await httpClient.post<ApiResponse<Profile>>('/auth/sign-up', {
            ...input,
          })
        },
      }),
  },

  signOut: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.signOut(),
        mutationFn: async () => {
          return await httpClient.get<ApiResponse<null>>('/auth/sign-out')
        },
      }),
  },

  profile: {
    queryKey: keys.profile,
    queryOptions: () =>
      queryOptions({
        queryKey: keys.profile(),
        queryFn: async () => {
          return await httpClient.get<ApiResponse<Profile>>('/auth/me')
        },
      }),
  },

  role: {
    queryKey: keys.role,
    queryOptions: () =>
      queryOptions({
        queryKey: keys.role(),
        queryFn: async () => {
          return await httpClient.get<ApiResponse<Role>>('/auth/role')
        },
      }),
  },

  refresh: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.refresh(),
        mutationFn: async () => {
          return await httpClient.post<ApiResponse<{ accessToken: string; accessTokenExpiration: string }>>('/auth/refresh')
        },
      }),
  }
})
