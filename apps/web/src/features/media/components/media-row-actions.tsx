import type { Row } from '@tanstack/react-table'
import type { Media } from '@/@types/media'
import {
  Clock,
  Copy,
  Download,
  FileText,
  FolderOpen,
  FolderOutputIcon,
  Info,
  MoreVertical,
  Pen,
  Share2,
  Star,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  // DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMedia } from './media-provider'
import { useMutation } from '@tanstack/react-query'
import { medias } from '@/lib/queries/media'

type MediaRowActionsProps = {
  row?: Row<Media>
  item?: Media
}

export function MediaRowActions({ row, item }: MediaRowActionsProps) {
  const { setOpen, setCurrentRow } = useMedia()
  const { mutate: download } = useMutation(medias().download.mutationOptions())
  const media = row?.original ?? item

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Button
          aria-label='Open item actions'
          variant='ghost'
          size='icon-sm'
          onClick={(event) => event.stopPropagation()}
        >
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        onClick={(event) => event.stopPropagation()}
      >
        <DropdownMenuItem>
          <Share2 />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Pen />
          Change name
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy />
          Create copy
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            if (!media) return
            download(media?.id!)
          }}
        >
          <Download />
          Download
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Info />
            About
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <FileText />
              Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Clock />
              Activity
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <FolderOpen />
            Organize
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <Star />
              Add star
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FolderOutputIcon />
              Move
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            if (!media) return
            setCurrentRow(media)
            setOpen('delete')
          }}
        >
          <Trash2 />
          Move to trash
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
