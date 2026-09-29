import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
// markdown plugins
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import '@/lib/highlight'
import { cn } from '@/lib/utils'
//
import { LazyLoadImage } from '@/components/lazy-load-image'
import { Separator } from '../ui/separator'
import { Typography } from '../ui/typography'
import './styles.css'
//
import type { MarkdownProps } from './types'

// ----------------------------------------------------------------------

export default function Markdown({ className, ...other }: MarkdownProps) {
  return (
    <div className={cn('markdown', className)}>
      <ReactMarkdown
        rehypePlugins={[
          rehypeRaw,
          rehypeHighlight,
          [remarkGfm, { singleTilde: false }],
        ]}
        components={components}
        {...other}
      />
    </div>
  )
}

// ----------------------------------------------------------------------

const components = {
  h1: ({ ...props }) => <Typography variant='h1' {...props} />,
  h2: ({ ...props }) => <Typography variant='h2' {...props} />,
  h3: ({ ...props }) => <Typography variant='h3' {...props} />,
  h4: ({ ...props }) => <Typography variant='h4' {...props} />,
  h5: ({ ...props }) => <Typography variant='h5' {...props} />,
  h6: ({ ...props }) => <Typography variant='h6' {...props} />,
  p: ({ ...props }) => <Typography variant='p' {...props} />,
  hr: ({ ...props }) => <Separator className='my-6' {...props} />,
  img: ({ ...props }) => (
    <LazyLoadImage
      alt={props.alt}
      className='my-5 aspect-video rounded-md'
      {...props}
    />
  ),
  a: ({ ...props }) => {
    const isHttp = props.href?.startsWith('http')

    return isHttp ? (
      <a target='_blank' rel='noopener noreferrer' {...props} />
    ) : (
      <a href={props.href} {...props}>
        {props.children}
      </a>
    )
  },
}
