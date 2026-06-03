import { mutationOptions, queryOptions } from '@tanstack/react-query'
import {
  ApiResponse,
  PaginatedApiResponse,
  QueryCampaign,
  Campaign,
} from '@/@types'
import { CampaignValidators } from '@/lib/validators'
import { queryClient } from '@/context/query-provider'
import { httpClient } from '../repository/http-client'

const keys = {
  all: (opts: QueryCampaign) => ['campaigns', opts],
  one: (id: string) => ['campaigns', id],
  create: () => ['campaigns', 'create'],
  update: () => ['campaigns', 'update'],
  delete: () => ['campaigns', 'delete'],
}

export const campaigns = () => ({
  all: {
    queryKey: keys.all,
    queryOptions: (opts: QueryCampaign = {}) =>
      queryOptions({
        queryKey: keys.all(opts),
        queryFn: async () => {
          const { data } = await httpClient.get<
            PaginatedApiResponse<Campaign[]>
          >('/campaigns', opts as Record<string, unknown>)
          return data
        },
      }),
  },

  one: {
    queryKey: keys.one,
    queryOptions: (id: string) =>
      queryOptions({
        queryKey: keys.one(id),
        queryFn: async () => {
          const { data } = await httpClient.get<ApiResponse<Campaign[]>>(
            `/campaigns/${id}`
          )
          return data
        },
      }),
  },

  create: {
    mutationKey: keys.create,
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.create(),
        mutationFn: async (input: CampaignValidators.CampaignForm) => {
          return await httpClient.post<ApiResponse<Campaign[]>>('/campaigns', {
            ...input,
          })
        },
        onSuccess: () => {
          queryClient().invalidateQueries({ queryKey: keys.all({}) })
        },
      }),
  },

  update: {
    mutationKey: keys.update,
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.update(),
        mutationFn: async ({
          id,
          ...input
        }: CampaignValidators.CampaignForm) => {
          return await httpClient.put<ApiResponse<Campaign[]>>(
            `/campaigns/${id}`,
            input
          )
        },
        onSuccess: () => {
          queryClient().invalidateQueries({ queryKey: keys.all({}) })
        },
      }),
  },

  delete: {
    mutationKey: keys.delete,
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.delete(),
        mutationFn: async (id: string) => {
          return await httpClient.delete<ApiResponse<Campaign[]>>(
            `/campaigns/${id}`
          )
        },
        onSuccess: () => {
          queryClient().invalidateQueries({ queryKey: keys.all({}) })
        },
      }),
  },
})
