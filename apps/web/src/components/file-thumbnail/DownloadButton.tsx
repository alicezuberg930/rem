// utils
import { Download } from 'lucide-react'
import { bgBlur } from '@/lib/css-styles'
import { Button } from '@/components/ui/button'

type Props = {
  onDownload?: VoidFunction
}

export default function DownloadButton({ onDownload }: Readonly<Props>) {
  const blurStyles = bgBlur({
    opacity: 0.6,
    color: '#212121',
  }) as React.CSSProperties

  return (
    <Button
      onClick={onDownload}
      className='absolute top-0 right-0 z-10 h-full w-full justify-center rounded-none bg-gray-800 p-0 text-white opacity-0 transition-opacity hover:opacity-100'
      style={blurStyles}
    >
      <Download />
    </Button>
  )
}
