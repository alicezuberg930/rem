import React from "react";

type MarkdownProps = {
    string: string;
    className?: string;
};

export function Markdown({ string, className }: MarkdownProps) {
    const lines = string.replace(/\r\n/g, "\n").split("\n");

    return (
        <div className={className}>
            {parseBlocks(lines)}
        </div>
    );
}

function parseBlocks(lines: string[]): React.ReactNode[] {
    const result: React.ReactNode[] = [];

    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Empty line
        if (!line.trim()) {
            i++;
            continue;
        }

        // Fenced code block
        if (line.startsWith("```")) {
            const language = line.slice(3).trim();
            const codeLines: string[] = [];

            i++;

            while (i < lines.length && !lines[i].startsWith("```")) {
                codeLines.push(lines[i]);
                i++;
            }

            i++; // closing ```

            result.push(
                <pre key={i} className="markdown-code">
                    <code data-language={language || undefined}>
                        {codeLines.join("\n")}
                    </code>
                </pre>
            );

            continue;
        }

        // Heading
        const heading = line.match(/^(#{1,6})\s+(.+)$/);

        if (heading) {
            const level = heading[1].length;
            const content = parseInline(heading[2]);

            const Heading = `h${level}` as keyof React.JSX.IntrinsicElements;

            result.push(
                <Heading key={i}>
                    {content}
                </Heading>
            );

            i++;
            continue;
        }

        // Horizontal rule
        if (/^(\*\s*){3,}$|^(-\s*){3,}$|^(_\s*){3,}$/.test(line)) {
            result.push(<hr key={i} />);
            i++;
            continue;
        }

        // Unordered list
        if (/^\s*[-*+]\s+/.test(line)) {
            const items: React.ReactNode[] = [];

            while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
                const item = lines[i].replace(/^\s*[-*+]\s+/, "");

                items.push(
                    <li key={i}>
                        {parseInline(item)}
                    </li>
                );

                i++;
            }

            result.push(<ul key={`ul-${i}`}>{items}</ul>);
            continue;
        }

        // Ordered list
        if (/^\s*\d+\.\s+/.test(line)) {
            const items: React.ReactNode[] = [];

            while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
                const item = lines[i].replace(/^\s*\d+\.\s+/, "");

                items.push(
                    <li key={i}>
                        {parseInline(item)}
                    </li>
                );

                i++;
            }

            result.push(<ol key={`ol-${i}`}>{items}</ol>);
            continue;
        }

        // Blockquote
        if (/^\s*>\s?/.test(line)) {
            const quoteLines: string[] = [];

            while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
                quoteLines.push(
                    lines[i].replace(/^\s*>\s?/, "")
                );

                i++;
            }

            result.push(
                <blockquote key={i}>
                    {quoteLines.map((quoteLine, index) => (
                        <React.Fragment key={index}>
                            {parseInline(quoteLine)}
                            {index < quoteLines.length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </blockquote>
            );

            continue;
        }

        // Paragraph
        const paragraphLines = [line];
        i++;

        while (
            i < lines.length &&
            lines[i].trim() &&
            !isBlockStart(lines[i])
        ) {
            paragraphLines.push(lines[i]);
            i++;
        }

        result.push(
            <p key={i}>
                {paragraphLines.map((paragraphLine, index) => (
                    <React.Fragment key={index}>
                        {parseInline(paragraphLine)}
                        {index < paragraphLines.length - 1 && <br />}
                    </React.Fragment>
                ))}
            </p>
        );
    }

    return result;
}

function isBlockStart(line: string): boolean {
    return (
        /^#{1,6}\s+/.test(line) ||
        /^```/.test(line) ||
        /^\s*[-*+]\s+/.test(line) ||
        /^\s*\d+\.\s+/.test(line) ||
        /^\s*>\s?/.test(line) ||
        /^(\*\s*){3,}$/.test(line) ||
        /^(-\s*){3,}$/.test(line) ||
        /^(_\s*){3,}$/.test(line)
    );
}

function parseInline(text: string): React.ReactNode[] {
    const tokens: React.ReactNode[] = [];

    /*
     * Order matters.
     *
     * We find the earliest Markdown construct in the string,
     * render it, then continue parsing the remaining text.
     */

    while (text.length > 0) {
        const match = findNextInlineToken(text);

        if (!match) {
            tokens.push(text);
            break;
        }

        if (match.index > 0) {
            tokens.push(text.slice(0, match.index));
        }

        const value = match.value;

        switch (match.type) {
            case "bold":
                tokens.push(
                    <strong key={tokens.length}>
                        {parseInline(value)}
                    </strong>
                );
                break;

            case "italic":
                tokens.push(
                    <em key={tokens.length}>
                        {parseInline(value)}
                    </em>
                );
                break;

            case "strikethrough":
                tokens.push(
                    <del key={tokens.length}>
                        {parseInline(value)}
                    </del>
                );
                break;

            case "code":
                tokens.push(
                    <code key={tokens.length} className="markdown-inline-code">
                        {value}
                    </code>
                );
                break;

            case "link":
                tokens.push(
                    <a
                        key={tokens.length}
                        href={match.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {parseInline(value)}
                    </a>
                );
                break;

            case "image":
                tokens.push(
                    <img
                        key={tokens.length}
                        src={match.url}
                        alt={value}
                    />
                );
                break;
        }

        text = text.slice(match.end);
    }

    return tokens;
}

type InlineMatch =
    | {
        type: "bold" | "italic" | "strikethrough" | "code";
        index: number;
        end: number;
        value: string;
    }
    | {
        type: "link" | "image";
        index: number;
        end: number;
        value: string;
        url: string;
    };

function findNextInlineToken(text: string): InlineMatch | null {
    const matches: InlineMatch[] = [];

    // Image: ![alt](url)
    const image = text.match(/!\[([^\]]*)\]\(([^)\s]+)\)/);

    if (image && image.index !== undefined) {
        matches.push({
            type: "image",
            index: image.index,
            end: image.index + image[0].length,
            value: image[1],
            url: image[2],
        });
    }

    // Link: [text](url)
    const link = text.match(/\[([^\]]+)\]\(([^)\s]+)\)/);

    if (link && link.index !== undefined) {
        matches.push({
            type: "link",
            index: link.index,
            end: link.index + link[0].length,
            value: link[1],
            url: link[2],
        });
    }

    // Bold: **text** or __text__
    const bold = text.match(/\*\*(.+?)\*\*|__(.+?)__/);

    if (bold && bold.index !== undefined) {
        matches.push({
            type: "bold",
            index: bold.index,
            end: bold.index + bold[0].length,
            value: bold[1] ?? bold[2],
        });
    }

    // Strikethrough: ~~text~~
    const strike = text.match(/~~(.+?)~~/);

    if (strike && strike.index !== undefined) {
        matches.push({
            type: "strikethrough",
            index: strike.index,
            end: strike.index + strike[0].length,
            value: strike[1],
        });
    }

    // Inline code: `code`
    const code = text.match(/`([^`]+)`/);

    if (code && code.index !== undefined) {
        matches.push({
            type: "code",
            index: code.index,
            end: code.index + code[0].length,
            value: code[1],
        });
    }

    // Italic: *text* or _text_
    const italic = text.match(/\*(?!\s)(.+?)(?<!\s)\*|_(?!\s)(.+?)(?<!\s)_/);

    if (italic && italic.index !== undefined) {
        matches.push({
            type: "italic",
            index: italic.index,
            end: italic.index + italic[0].length,
            value: italic[1] ?? italic[2],
        });
    }

    if (matches.length === 0) {
        return null;
    }

    return matches.sort((a, b) => a.index - b.index)[0];
}