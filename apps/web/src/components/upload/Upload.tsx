//
import { CircleX } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
// import { useLocales } from '@/lib/locales'
// assets
import { UploadIllustration } from '@/lib/illustrations'
//
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { Typography } from '../ui/typography'
// components
import RejectionFiles from './errors/RejectionFiles'
import MultiFilePreview from './preview/MultiFilePreview'
import SingleFilePreview from './preview/SingleFilePreview'
import { type UploadProps } from './types'

export default function Upload({
  disabled,
  multiple = false,
  error,
  helperText,
  //
  file,
  onDelete,
  //
  files,
  thumbnail,
  onUpload,
  onRemove,
  onRemoveAll,
  ...other
}: Readonly<UploadProps>) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({ multiple, disabled, ...other })

  const hasFile = !!file && !multiple

  const hasFiles = files && multiple && files.length > 0

  const isError = isDragReject || !!error

  return (
    <div className='relative w-full'>
      <div
        {...getRootProps()}
        className={cn(
          'relative cursor-pointer rounded-lg border border-dashed border-gray-400 bg-gray-100 p-10 transition-all hover:opacity-70',
          isDragActive && 'opacity-70',
          isError && 'border-red-300 bg-red-50 text-red-600',
          disabled && 'pointer-events-none opacity-50',
          hasFile && 'aspect-4/3'
        )}
      >
        <input {...getInputProps()} />

        <Placeholder className={cn(hasFile && 'opacity-0')} />

        {hasFile && <SingleFilePreview file={file} />}
      </div>

      {helperText}

      <RejectionFiles fileRejections={fileRejections} />

      {hasFile && onDelete && (
        <Button
          size='sm'
          onClick={onDelete}
          className='absolute top-4 right-4 z-10 bg-gray-900/70 text-white/80 hover:bg-gray-900/50'
        >
          <CircleX width={18} />
        </Button>
      )}

      {hasFiles && (
        <>
          <div className='my-3'>
            <MultiFilePreview
              files={files}
              thumbnail={thumbnail}
              onRemove={onRemove}
            />
          </div>

          <div className='flex justify-end gap-1.5'>
            {onRemoveAll && (
              <Button variant='outline' size='sm' onClick={onRemoveAll}>
                Remove all
              </Button>
            )}

            {onUpload && (
              <Button size='sm' onClick={onUpload}>
                Upload files
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function Placeholder({
  className,
  ...other
}: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  // const { translate } = useLocales()
  const translate = (key: string) => key

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center gap-5 text-center md:flex-row md:text-left',
        className
      )}
      {...other}
    >
      <UploadIllustration style={{ width: 220 }} />
      <div>
        <Typography variant='h5'>{translate('drop_or_select_file')}</Typography>
        <Typography variant='p' className='text-sm text-gray-700'>
          {translate('drop_files_here_or_click')}
          <Typography
            variant='span'
            className='text-main-500 mx-1 inline-block underline lg:text-sm'
          >
            {translate('browse')}
          </Typography>
          {translate('thorough_your_machine')}
        </Typography>
      </div>
    </div>
  )
}
