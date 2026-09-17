import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { FileUp, FolderPlus, FolderUp } from 'lucide-react'

export function StorageContextMenu({ children }: { children: React.ReactNode }) {
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuGroup>
                    <ContextMenuItem>
                        <FolderPlus />
                        Create new folder
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem>
                        <FileUp />
                        Upload file
                    </ContextMenuItem>
                    <ContextMenuItem>
                        <FolderUp />
                        Upload folder
                    </ContextMenuItem>
                </ContextMenuGroup>
            </ContextMenuContent>
        </ContextMenu>
    )
}