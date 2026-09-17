import type { Row } from '@tanstack/react-table'
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
import { useStorage } from './storage-provider'
import type { StorageItem } from './storage-types'

type StorageRowActionsProps = {
  row?: Row<StorageItem>
  item?: StorageItem
}

export function StorageRowActions({ row, item }: StorageRowActionsProps) {
  const { setOpen, setCurrentRow } = useStorage()
  const storageItem = row?.original ?? item

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
        <DropdownMenuItem>
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
            if (!storageItem) return
            setCurrentRow(storageItem)
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
