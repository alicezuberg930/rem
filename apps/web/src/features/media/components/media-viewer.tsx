import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export const MediaViewer = ({ url }: { url: string | undefined }) => {
    console.log(url)
    return (
        <Dialog open={!!url}>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent>
                <div>
                    <iframe
                        src={url}
                        className="w-full h-[800px]"
                    />
                </div>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}