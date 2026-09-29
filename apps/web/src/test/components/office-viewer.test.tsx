import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OfficeViewer } from '@/components/office-viewer'

describe('OfficeViewer', () => {
  it('embeds an encoded public document URL in Microsoft Office Viewer', () => {
    const documentUrl =
      'https://storage.example.com/files/report.xlsx?X-Amz-Signature=a+b&response-content-disposition=inline'

    render(<OfficeViewer url={documentUrl} title='Quarterly report' />)

    const frame = screen.getByTitle('Quarterly report')
    const viewerUrl = new URL(frame.getAttribute('src') ?? '')

    expect(viewerUrl.origin).toBe('https://view.officeapps.live.com')
    expect(viewerUrl.pathname).toBe('/op/embed.aspx')
    expect(viewerUrl.searchParams.get('src')).toBe(documentUrl)
  })

  it('shows a message when the source URL is not publicly reachable', () => {
    render(<OfficeViewer url='/files/report.docx' />)

    expect(
      screen.getByText(
        'A public HTTP or HTTPS document URL is required for Office preview.'
      )
    ).toBeInTheDocument()
    expect(screen.queryByTitle('Microsoft Office document preview')).toBeNull()
  })
})
