import { fileFormat, fileThumb } from '@/components/file-thumbnail'
import { type CustomFile } from '../types'

type Props = {
  file: CustomFile | string | null
}

export default function SingleFilePreview({ file }: Readonly<Props>) {
  if (!file) return null
  let format = ''
  let imgUrl = ''
  if (typeof file === 'string') {
    imgUrl = file
    format = 'image'
  } else {
    format = fileFormat(file.path)
    imgUrl = format === 'image' ? file.preview! : fileThumb(format)
  }
  console.log(imgUrl)
  return (
    <img
      alt='file preview'
      src={imgUrl}
      className={`absolute top-2 left-2 z-10 h-[calc(100%-16px)] w-[calc(100%-16px)] rounded-lg ${format !== 'image' ? 'object-contain p-8' : 'object-cover'}`}
    />
  )
}
