// import { m, AnimatePresence } from 'framer-motion'
// utils
import { CircleX } from 'lucide-react'
import { fData } from '@/lib/format-number'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
//
// import { varFade } from '@/components/animate'
import FileThumbnail, { fileData } from '@/components/file-thumbnail'
//
import { type UploadProps } from '../types'

export default function MultiFilePreview({
  thumbnail,
  files,
  onRemove,
}: UploadProps) {
  if (!files?.length) return null

  return (
    <div>
      {files.map((file) => {
        const { key, name = '', size = 0 } = fileData(file)
        const isNotFormatFile = typeof file === 'string'

        if (thumbnail) {
          return (
            <div
              key={key}
              className='relative m-1 inline-flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-border'
            // variants={varFade().inUp}
            >
              <FileThumbnail
                tooltip
                imageView
                file={file}
                imageProps={{ className: 'absolute' }}
                fileProps={{ className: 'absolute' }}
              />

              {onRemove && (
                <Button
                  size={'icon-sm'}
                  variant='ghost'
                  className='absolute top-1 right-1 rounded-full bg-gray-900/60 hover:bg-gray-900/70'
                  onClick={() => onRemove(file)}
                >
                  <CircleX className='size-5 stroke-white' />
                </Button>
              )}
            </div>
          )
        }

        return (
          <div
            key={key}
            className='my-2 inline-flex items-center rounded-lg border border-border px-2 py-1.5'
          // variants={varFade().inUp}
          >
            <FileThumbnail file={file} />

            <div className='min-w-0 grow'>
              <Typography
                variant='caption'
                className='line-clamp-1 overflow-hidden font-semibold text-ellipsis'
              >
                {isNotFormatFile ? file : name}
              </Typography>

              <Typography variant='caption' className='text-gray-600'>
                {isNotFormatFile ? '' : fData(size)}
              </Typography>
            </div>

            {onRemove && (
              <Button
                size={'icon-sm'}
                variant='ghost'
                className='absolute top-1 right-1 h-8 w-8 rounded-full bg-gray-900/60 hover:bg-gray-900/70'
                onClick={() => onRemove(file)}
              >
                <CircleX className='size-4 stroke-white' />
              </Button>
            )}
          </div>
        )
      })}
    </div>
  )
}
