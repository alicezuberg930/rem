import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import DownloadButton from './DownloadButton'
import { fileData, fileFormat, fileThumb } from './utils'

type FileIconProps = {
  file: File | string
  tooltip?: boolean
  imageView?: boolean
  onDownload?: VoidFunction
  imageProps?: React.ImgHTMLAttributes<HTMLImageElement>
  fileProps?: React.ImgHTMLAttributes<HTMLImageElement>
}

export default function FileThumbnail({
  file,
  tooltip,
  imageView,
  onDownload,
  imageProps,
  fileProps,
}: Readonly<FileIconProps>) {
  const { name = '', path = '', preview = '' } = fileData(file)

  const format = fileFormat(path || preview)

  const renderContent =
    format === 'image' && imageView ? (
      <img
        src={preview}
        {...imageProps}
        className={cn(
          'h-full w-full shrink-0 object-cover',
          imageProps?.className
        )}
      />
    ) : (
      <img
        src={fileThumb(format)}
        {...fileProps}
        className={cn('h-8 w-8 shrink-0', fileProps?.className)}
      />
    )

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <div className='flex w-fit shrink-0 flex-col items-center justify-center'>
            {renderContent}
            {onDownload && <DownloadButton onDownload={onDownload} />}
          </div>
        </TooltipTrigger>
        <TooltipContent>{name}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <>
      {renderContent}
      {onDownload && <DownloadButton onDownload={onDownload} />}
    </>
  )
}
