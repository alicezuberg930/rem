import { describe, expect, it } from 'vitest'
import { highlightCodeElement } from '@/lib/utils'

describe('highlightCodeElement', () => {
  it('adds syntax highlighting while preserving the source text', () => {
    const code = document.createElement('code')
    const source = 'const answer: number = 42'

    highlightCodeElement(code, source)

    expect(code).toHaveClass('hljs')
    expect(code.querySelector('.hljs-keyword')).toHaveTextContent('const')
    expect(code).toHaveTextContent(source)
  })

  it('replaces previously highlighted content', () => {
    const code = document.createElement('code')

    highlightCodeElement(code, 'const oldValue = 1')
    highlightCodeElement(code, 'return "new value"')

    expect(code).toHaveTextContent('return "new value"')
    expect(code).not.toHaveTextContent('oldValue')
  })
})
