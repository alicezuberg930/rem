import { useCallback, useMemo, useRef } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import '@/styles/custom-quill.css'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { files } from '@/lib/queries/file'
import { cn } from '@/lib/utils'
import { Field, FieldError, FieldLabel } from '../ui/field'

type RHFRichTextEditorProps = React.ComponentProps<typeof ReactQuill> & {
  name: string
  fieldLabel: string
}

export const RHFRichTextEditor = ({
  name,
  fieldLabel,
  ...other
}: RHFRichTextEditorProps) => {
  const { control } = useFormContext()
  const quillRef = useRef<ReactQuill | null>(null)
  const { mutateAsync: uploadFile } = useMutation(
    files().upload.mutationOptions()
  )

  const imageHandler = useCallback(async () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const imageUrl = await uploadFile({
        file,
        subFolder: '/templates',
      })
      // Insert the URL into the editor at cursor position
      const editor = quillRef.current?.getEditor()
      const range = editor?.getSelection(true)
      if (editor && range) {
        editor.insertEmbed(range.index, 'image', imageUrl.data)
        // move cursor after image
        editor.setSelection(range.index + 1, 0)
      }
    }
  }, [uploadFile])

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
          [{ align: ['', 'center', 'right', 'justify'] }],
          [
            {
              color: [
                '#000000',
                '#e60000',
                '#ff9900',
                '#ffff00',
                '#008a00',
                '#0066cc',
                '#9933ff',
                '#ffffff',
              ],
            },
          ],
          ['image'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler]
  )

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'link',
    'image',
    'color',
    'align',
  ]

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <Field data-invalid={invalid}>
          <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel>
          <div className='quill-wrapper'>
            <ReactQuill
              {...other}
              ref={quillRef}
              theme='snow'
              value={field.value}
              onChange={(_value, _delta, _source, editor) =>
                field.onChange(editor.getHTML())
              }
              modules={modules}
              formats={formats}
              className={cn(invalid && 'quill-error')}
            />
          </div>
          {invalid && <FieldError errors={[error]} />}
        </Field>
      )}
    />
  )
}
