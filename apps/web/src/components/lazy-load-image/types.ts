export type LazyLoadImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  placeholderSrc?: string
  effect?: 'blur' | 'opacity' | 'black-and-white'
  wrapperClassName?: string
  responsiveSizes?: string
  widths?: {
    screenWidth: number
    imageWidth: number
  }[]
}
