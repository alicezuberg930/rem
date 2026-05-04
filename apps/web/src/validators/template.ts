import * as z from 'zod'

export namespace TemplateValidators {
    export const formSchema = z
        .object({
            id: z.string().optional(),
            name: z.string().min(1, 'Name is required.'),
            header: z.string().min(1, 'Header is required.'),
            body: z.string().min(1, 'Body is required.'),
            footer: z.string().min(1, 'Footer is required.'),
            contactPhone: z.string().nullable(),
            websiteUrl: z.string().nullable(),
            isEdit: z.boolean(),
        })
        .refine(
            ({ isEdit, header }) => {
                if (isEdit && !header) return true
                return header.length >= 8
            },
            {
                message: 'Header must be at least 8 characters long.',
                path: ['header'],
            }
        )
        .refine(
            ({ isEdit, body }) => {
                if (isEdit && !body) return true
                return body.length >= 8
            },
            {
                message: 'Body must be at least 8 characters long.',
                path: ['body'],
            }
        )
        .refine(
            ({ isEdit, footer }) => {
                if (isEdit && !footer) return true
                return footer.length >= 8
            },
            {
                message: 'Footer must be at least 8 characters long.',
                path: ['footer'],
            }
        )

    export type TemplateForm = z.infer<typeof formSchema>
}