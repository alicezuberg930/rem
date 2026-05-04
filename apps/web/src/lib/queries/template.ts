import { ApiResponse, PaginatedApiResponse, QueryTemplate, Template } from '@/@types'
import { TemplateValidators } from '@/validators'
import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { httpClient } from '../repository/httpClient'
import { getQueryClient } from '@/context/query-provider'

const queryClient = getQueryClient()

const keys = {
    all: (opts: QueryTemplate) => ['templates', opts],
    one: (id: string) => ['templates', id],
    create: () => ['templates', 'create'],
    update: () => ['templates', 'update'],
    delete: () => ['templates', 'delete'],
}

export const templates = () => ({
    all: {
        queryKey: keys.all,
        queryOptions: (opts: QueryTemplate = {}) =>
            queryOptions({
                queryKey: keys.all(opts),
                queryFn: async () => {
                    const { data } = await httpClient.get<PaginatedApiResponse<Template[]>>('/templates', opts as Record<string, unknown>)
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
                    const { data } = await httpClient.get<ApiResponse<Template[]>>(`/templates/${id}`)
                    return data
                },
            }),
    },

    create: {
        mutationKey: keys.create,
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.create(),
                mutationFn: async (input: TemplateValidators.TemplateForm) => {
                    return await httpClient.post<ApiResponse<Template[]>>('/templates', input)
                },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: keys.all({}) })
                },
            }),
    },

    update: {
        mutationKey: keys.update,
        mutationOptions: () => mutationOptions({
            mutationKey: keys.update(),
            mutationFn: async ({ id, ...input }: TemplateValidators.TemplateForm) => {
                return await httpClient.put<ApiResponse<Template[]>>(`/templates/${id}`, input)
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: keys.all({}) })
            }
        }),
    },

    delete: {
        mutationKey: keys.delete,
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.delete(),
                mutationFn: async (id: string) => {
                    return await httpClient.delete<ApiResponse<Template[]>>(`/templates/${id}`)
                },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: keys.all({}) })
                }
            }),
    },
})