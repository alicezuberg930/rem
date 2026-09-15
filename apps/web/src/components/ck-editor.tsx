import { useState, useEffect, useRef, useMemo } from 'react'
import '@/styles/ck-editor.css'
import ckEditorStyles from '@/styles/ck-editor.css?inline'
import { CKEditor as CustomCKEditor } from '@ckeditor/ckeditor5-react'
import {
    DecoupledEditor,
    Alignment,
    Autoformat,
    AutoImage,
    AutoLink,
    Autosave,
    BalloonToolbar,
    BlockQuote,
    Bold,
    CloudServices,
    Code,
    CodeBlock,
    Emoji,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    GeneralHtmlSupport,
    Heading,
    Highlight,
    HorizontalLine,
    ImageBlock,
    ImageEditing,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    ImageUtils,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    MediaEmbed,
    Mention,
    PageBreak,
    Paragraph,
    PasteFromMarkdownExperimental,
    PasteFromOffice,
    RemoveFormat,
    SimpleUploadAdapter,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Style,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    TodoList,
    Underline,
    type EditorConfig,
} from 'ckeditor5'
import 'ckeditor5/ckeditor5.css'
import juice from 'juice'

/**
 * Create a free account with a trial: https://portal.ckeditor.com/checkout?plan=free
 */
const LICENSE_KEY = 'GPL' // or <YOUR_LICENSE_KEY>.

type CKEditorProps = {
    initialData?: string
    onChange?: (data: string) => void
}

const getStyledEditorData = (data: string) => {
    if (!data.trim()) return ''

    const container = document.createElement('div')
    container.innerHTML = data
    const contentRoot =
        container.children.length === 1 &&
            container.firstElementChild?.classList.contains('ck-content')
            ? container.firstElementChild.outerHTML
            : `<div class="ck-content">${data}</div>`

    return juice.inlineContent(contentRoot, ckEditorStyles, {
        inlinePseudoElements: true,
        removeStyleTags: true,
        applyStyleTags: true,
    })
}

export const CKEditor = ({ onChange, initialData }: CKEditorProps) => {
    const editorContainerRef = useRef<HTMLDivElement | null>(null)
    const editorMenuBarRef = useRef<HTMLDivElement | null>(null)
    const editorToolbarRef = useRef<HTMLDivElement | null>(null)
    const editorRef = useRef<HTMLDivElement | null>(null)
    const [isLayoutReady, setIsLayoutReady] = useState(false)

    useEffect(() => {
        setIsLayoutReady(true)
        return () => setIsLayoutReady(false)
    }, [])

    const editorConfig = useMemo<EditorConfig | undefined>(() => {
        if (!isLayoutReady) return undefined

        return {
            toolbar: {
                items: [
                    'heading',
                    'style',
                    '|',
                    'fontSize',
                    'fontFamily',
                    'fontColor',
                    'fontBackgroundColor',
                    '|',
                    'bold',
                    'italic',
                    'underline',
                    '|',
                    'link',
                    'insertImage',
                    'insertTable',
                    'highlight',
                    'blockQuote',
                    'codeBlock',
                    '|',
                    'alignment',
                    '|',
                    'bulletedList',
                    'numberedList',
                    'todoList',
                    'outdent',
                    'indent',
                ],
                shouldNotGroupWhenFull: false,
            },
            plugins: [
                Alignment,
                Autoformat,
                AutoImage,
                AutoLink,
                Autosave,
                BalloonToolbar,
                BlockQuote,
                Bold,
                CloudServices,
                Code,
                CodeBlock,
                Emoji,
                Essentials,
                FindAndReplace,
                FontBackgroundColor,
                FontColor,
                FontFamily,
                FontSize,
                GeneralHtmlSupport,
                Heading,
                Highlight,
                HorizontalLine,
                ImageBlock,
                ImageEditing,
                ImageInsert,
                ImageInsertViaUrl,
                ImageResize,
                ImageStyle,
                ImageTextAlternative,
                ImageToolbar,
                ImageUpload,
                ImageUtils,
                Indent,
                IndentBlock,
                Italic,
                Link,
                LinkImage,
                List,
                ListProperties,
                MediaEmbed,
                Mention,
                PageBreak,
                Paragraph,
                PasteFromMarkdownExperimental,
                PasteFromOffice,
                RemoveFormat,
                SimpleUploadAdapter,
                SpecialCharacters,
                SpecialCharactersArrows,
                SpecialCharactersCurrency,
                SpecialCharactersEssentials,
                SpecialCharactersLatin,
                SpecialCharactersMathematical,
                SpecialCharactersText,
                Strikethrough,
                Style,
                Subscript,
                Superscript,
                Table,
                TableCaption,
                TableCellProperties,
                TableColumnResize,
                TableProperties,
                TableToolbar,
                TextTransformation,
                TodoList,
                Underline,
            ],
            balloonToolbar: [
                'bold',
                'italic',
                '|',
                'link',
                'insertImage',
                '|',
                'bulletedList',
                'numberedList',
            ],
            fontFamily: {
                supportAllValues: true,
            },
            fontSize: {
                options: [10, 12, 14, 'default', 18, 20, 22],
                supportAllValues: true,
            },
            heading: {
                options: [
                    {
                        model: 'paragraph',
                        title: 'Paragraph',
                        class: 'ck-heading_paragraph',
                    },
                    {
                        model: 'heading1',
                        view: 'h1',
                        title: 'Heading 1',
                        class: 'ck-heading_heading1',
                    },
                    {
                        model: 'heading2',
                        view: 'h2',
                        title: 'Heading 2',
                        class: 'ck-heading_heading2',
                    },
                    {
                        model: 'heading3',
                        view: 'h3',
                        title: 'Heading 3',
                        class: 'ck-heading_heading3',
                    },
                    {
                        model: 'heading4',
                        view: 'h4',
                        title: 'Heading 4',
                        class: 'ck-heading_heading4',
                    },
                    {
                        model: 'heading5',
                        view: 'h5',
                        title: 'Heading 5',
                        class: 'ck-heading_heading5',
                    },
                    {
                        model: 'heading6',
                        view: 'h6',
                        title: 'Heading 6',
                        class: 'ck-heading_heading6',
                    },
                ],
            },
            htmlSupport: {
                allow: [
                    {
                        name: /^.*$/,
                        styles: true,
                        attributes: true,
                        classes: true,
                    },
                ],
            },
            image: {
                toolbar: [
                    'imageTextAlternative',
                    '|',
                    'imageStyle:alignBlockLeft',
                    'imageStyle:block',
                    'imageStyle:alignBlockRight',
                    '|',
                    'resizeImage',
                ],
                styles: {
                    options: ['alignBlockLeft', 'block', 'alignBlockRight'],
                },
            },
            initialData: initialData ?? '',
            // initialData: '<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n\tYou\'ve successfully created a CKEditor 5 project. This powerful text editor\n\twill enhance your application, enabling rich text editing capabilities that\n\tare customizable and easy to use.\n</p>\n<h3>What\'s next?</h3>\n<ol>\n\t<li>\n\t\t<strong>Integrate into your app</strong>: time to bring the editing into\n\t\tyour application. Take the code you created and add to your application.\n\t</li>\n\t<li>\n\t\t<strong>Explore features:</strong> Experiment with different plugins and\n\t\ttoolbar options to discover what works best for your needs.\n\t</li>\n\t<li>\n\t\t<strong>Customize your editor:</strong> Tailor the editor\'s\n\t\tconfiguration to match your application\'s style and requirements. Or\n\t\teven write your plugin!\n\t</li>\n</ol>\n<p>\n\tKeep experimenting, and don\'t hesitate to push the boundaries of what you\n\tcan achieve with CKEditor 5. Your feedback is invaluable to us as we strive\n\tto improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<ul>\n\t<li>📝 <a href="https://portal.ckeditor.com/checkout?plan=free">Trial sign up</a>,</li>\n\t<li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li>\n\t<li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li>\n\t<li>🏠 <a href="https://ckeditor.com">CKEditor Homepage</a>,</li>\n\t<li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n\tSee this text, but the editor is not starting up? Check the browser\'s\n\tconsole for clues and guidance. It may be related to an incorrect license\n\tkey if you use premium features or another feature-related requirement. If\n\tyou cannot make it work, file a GitHub issue, and we will help as soon as\n\tpossible!\n</p>\n',
            licenseKey: LICENSE_KEY,
            link: {
                addTargetToExternalLinks: true,
                defaultProtocol: 'https://',
                decorators: {
                    toggleDownloadable: {
                        mode: 'manual',
                        label: 'Downloadable',
                        attributes: {
                            download: 'file',
                        },
                    },
                },
            },
            list: {
                properties: {
                    styles: true,
                    startIndex: true,
                    reversed: true,
                },
            },
            mention: {
                feeds: [
                    {
                        marker: '@',
                        feed: [
                            /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
                        ],
                    },
                ],
            },
            menuBar: {
                isVisible: true,
            },
            placeholder: 'Nhập nội dung của bạn vào đây',
            style: {
                definitions: [
                    {
                        name: 'Article category',
                        element: 'h3',
                        classes: ['category'],
                    },
                    {
                        name: 'Title',
                        element: 'h2',
                        classes: ['document-title'],
                    },
                    {
                        name: 'Subtitle',
                        element: 'h3',
                        classes: ['document-subtitle'],
                    },
                    {
                        name: 'Info box',
                        element: 'p',
                        classes: ['info-box'],
                    },
                    {
                        name: 'Side quote',
                        element: 'blockquote',
                        classes: ['side-quote'],
                    },
                    {
                        name: 'Marker',
                        element: 'span',
                        classes: ['marker'],
                    },
                    {
                        name: 'Spoiler',
                        element: 'span',
                        classes: ['spoiler'],
                    },
                    {
                        name: 'Code (dark)',
                        element: 'pre',
                        classes: ['fancy-code', 'fancy-code-dark'],
                    },
                    {
                        name: 'Code (bright)',
                        element: 'pre',
                        classes: ['fancy-code', 'fancy-code-bright'],
                    },
                ],
            },
            table: {
                contentToolbar: [
                    'tableColumn',
                    'tableRow',
                    'mergeTableCells',
                    'tableProperties',
                    'tableCellProperties',
                ],
            },
        }
    }, [initialData, isLayoutReady])

    return (
        <div className='main-container'>
            <div
                className='editor-container editor-container_document-editor editor-container_include-style'
                ref={editorContainerRef}
            >
                <div
                    className='editor-container__menu-bar'
                    ref={editorMenuBarRef}
                ></div>
                <div className='editor-container__toolbar' ref={editorToolbarRef}></div>
                <div className='editor-container__editor-wrapper'>
                    <div className='editor-container__editor'>
                        <div ref={editorRef}>
                            {editorConfig && (
                                <CustomCKEditor
                                    onChange={(_event, editor) => onChange?.(getStyledEditorData(editor.getData()))}
                                    onReady={(editor) => {
                                        editorToolbarRef.current?.appendChild(
                                            editor.ui.view.toolbar.element
                                        )
                                        editorMenuBarRef.current?.appendChild(
                                            editor.ui.view.menuBarView.element
                                        )
                                    }}
                                    onAfterDestroy={() => {
                                        Array.from(
                                            editorToolbarRef.current?.children ?? []
                                        ).forEach((child) => child.remove())
                                        Array.from(
                                            editorMenuBarRef.current?.children ?? []
                                        ).forEach((child) => child.remove())
                                    }}
                                    editor={DecoupledEditor}
                                    config={editorConfig}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
