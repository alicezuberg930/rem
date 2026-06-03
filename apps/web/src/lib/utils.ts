import { type ClassValue, clsx } from 'clsx'
import juice from 'juice'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Generates page numbers for pagination with ellipsis
 * @param currentPage - Current page number (1-based)
 * @param totalPages - Total number of pages
 * @returns Array of page numbers and ellipsis strings
 *
 * Examples:
 * - Small dataset (≤5 pages): [1, 2, 3, 4, 5]
 * - Near beginning: [1, 2, 3, 4, '...', 10]
 * - In middle: [1, '...', 4, 5, 6, '...', 10]
 * - Near end: [1, '...', 7, 8, 9, 10]
 */
export function getPageNumbers(currentPage: number, totalPages: number) {
  const maxVisiblePages = 5 // Maximum number of page buttons to show
  const rangeWithDots = []

  if (totalPages <= maxVisiblePages) {
    // If total pages is 5 or less, show all pages
    for (let i = 1; i <= totalPages; i++) {
      rangeWithDots.push(i)
    }
  } else {
    // Always show first page
    rangeWithDots.push(1)

    if (currentPage <= 3) {
      // Near the beginning: [1] [2] [3] [4] ... [10]
      for (let i = 2; i <= 4; i++) {
        rangeWithDots.push(i)
      }
      rangeWithDots.push('...', totalPages)
    } else if (currentPage >= totalPages - 2) {
      // Near the end: [1] ... [7] [8] [9] [10]
      rangeWithDots.push('...')
      for (let i = totalPages - 3; i <= totalPages; i++) {
        rangeWithDots.push(i)
      }
    } else {
      // In the middle: [1] ... [4] [5] [6] ... [10]
      rangeWithDots.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        rangeWithDots.push(i)
      }
      rangeWithDots.push('...', totalPages)
    }
  }

  return rangeWithDots
}

const quillCss = `
  .ql-align-center { text-align: center; }
  .ql-align-right { text-align: right; }
  .ql-align-left { text-align: left; }
  .ql-align-justify { text-align: justify; }

  .ql-indent-1 { padding-left: 3em; }
  .ql-indent-2 { padding-left: 6em; }
  .ql-indent-3 { padding-left: 9em; }

  h1 { font-size: 2em; font-weight: bold; }
  h2 { font-size: 1.5em; font-weight: bold; }
  h3 { font-size: 1.17em; font-weight: bold; }

  strong { font-weight: bold; }
  em { font-style: italic; }
  u { text-decoration: underline; }
  s { text-decoration: line-through; }

  a { color: #0066cc; text-decoration: underline; }

  blockquote {
    border-left: 4px solid #ccc;
    margin: 0;
    padding-left: 1em;
    color: #666;
  }

  pre {
    background-color: #f4f4f4;
    padding: 1em;
    font-family: monospace;
    white-space: pre-wrap;
  }

  li[data-list="ordered"] {
    counter-increment: list-0;
  }

  li {
    padding-left: 1.5em;
    list-style-type: none;
    position: relative;
  }

  .ql-ui {
    position: absolute;
  }

  li > .ql-ui::before {
    text-align: right;
    white-space: nowrap;
    width: 1.2em;
    margin-left: -1.5em;
    margin-right: .3em;
    display: inline-block;
  }

  li[data-list="bullet"] > .ql-ui::before {
    content: "•";
  }

  li[data-list="ordered"] > .ql-ui::before {
    content: counter(list-0, decimal) ". ";
  }

  ul { list-style-type: disc; }
  ol { list-style-type: decimal; }
`

export function inlineQuillStyles(html: string): string {
  const wrapped = `<div>${html}</div>`
  const inlined = juice.inlineContent(wrapped, quillCss, {
    inlinePseudoElements: true,
    removeStyleTags: true,
    applyStyleTags: true,
  })
  return inlined
}

export function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  if (import.meta.env.VITE_PRODUCTION_URL)
    return import.meta.env.VITE_PRODUCTION_URL
  return `http://localhost:5173`
}

export function slugify(str: string): string {
  if (!str) return ''
  return (
    str
      .trim()
      .normalize('NFD') // Normalize to decompose combined letters (e.g., ấ → a + ̂)
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
      .replace(/[^A-Za-z0-9\s-đ]/g, '') // Allow Vietnamese characters, numbers, spaces, and hyphens
      // .replace(/[^A-Za-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-')
  ) // Collapse multiple hyphens into one
}

export const alpha = (color: string, opacity: number): string => {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    const r = Number.parseInt(hex.substring(0, 2), 16)
    const g = Number.parseInt(hex.substring(2, 4), 16)
    const b = Number.parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  // Handle rgb/rgba colors
  if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g)
    if (match && match.length >= 3) {
      return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${opacity})`
    }
  }
  return `rgba(0, 0, 0, ${opacity})`
}

export const getCurrentLocation = (): Promise<{
  latitude: number
  longitude: number
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (e) => reject(new Error(e.message)),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  })
}
