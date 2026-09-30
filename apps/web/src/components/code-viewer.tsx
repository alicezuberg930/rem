import { highlightCodeElement } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

export const CodeViewer = ({ markdownUrl }: { markdownUrl: string }) => {
    // Stores fetched markdown together with the URL that produced it.
    const [markdown, setMarkdown] = useState('')
    const codeRef = useRef<HTMLElement>(null)

    // Fetches text content and ignores stale responses when the item changes.
    useEffect(() => {
        const controller = new AbortController()

        if (markdownUrl) {
            fetch(markdownUrl, { signal: controller.signal })
                .then((response) => response.text())
                .then((content) => setMarkdown(content))
                .catch((error: unknown) => {
                    if (error instanceof DOMException && error.name === 'AbortError') return
                    setMarkdown('Unable to load this file.')
                })
        }

        return () => controller.abort()
    }, [markdownUrl])

    useEffect(() => {
        if (codeRef.current) {
            highlightCodeElement(codeRef.current, markdown)
        }
    }, [markdown])

    return (
        <pre className="h-full w-full rounded-md bg-white text-wrap">
            <code ref={codeRef}>{(markdown)}</code>
        </pre>
    )
}