import LazyLoadImage from '@/components/lazy-load-image/LazyLoadImage'
import { type CustomFile } from '../types'

type Props = {
  file: CustomFile | string | null
}

export default function AvatarPreview({ file }: Readonly<Props>) {
  if (!file) return null
  const imgUrl = typeof file === 'string' ? file : file.preview

  return (
    <LazyLoadImage
      alt='avatar'
      src={imgUrl}
      className='absolute z-10 h-[calc(100%-16px)] w-[calc(100%-16px)] overflow-hidden rounded-full'
      effect='blur'
    />
  )
}
