import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { parseCsv } from '@/lib/csv'
import { CsvViewer } from '@/components/csv-viewer'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('parseCsv', () => {
  it('parses quoted delimiters, escaped quotes, and new lines', () => {
    expect(
      parseCsv('name,notes\nAlice,"Hello, world"\nBob,"Said ""hello"""')
    ).toEqual([
      ['name', 'notes'],
      ['Alice', 'Hello, world'],
      ['Bob', 'Said "hello"'],
    ])
  })

  it('detects semicolon-delimited CSV files', () => {
    expect(parseCsv('name;amount\nCoffee;12.50')).toEqual([
      ['name', 'amount'],
      ['Coffee', '12.50'],
    ])
  })
})

describe('CsvViewer', () => {
  it('fetches and renders a CSV as a table', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response('name,total\nAlice,42\nBob,17', { status: 200 })
        )
    )

    render(
      <CsvViewer
        url='https://storage.example.com/report.csv?signature=test'
        title='Report preview'
      />
    )

    expect(
      await screen.findByRole('columnheader', { name: 'name' })
    ).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'total' })).toBeVisible()
    expect(screen.getByRole('cell', { name: 'Alice' })).toBeVisible()
    expect(screen.getByRole('cell', { name: '42' })).toBeVisible()
  })

  it('shows a useful error when the signed URL cannot be fetched', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('', { status: 403 }))
    )

    render(<CsvViewer url='https://storage.example.com/report.csv' />)

    await waitFor(() => {
      expect(screen.getByText('Unable to load CSV (403)')).toBeVisible()
    })
  })
})
