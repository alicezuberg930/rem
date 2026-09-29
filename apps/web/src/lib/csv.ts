const detectCsvDelimiter = (value: string) => {
  const counts = new Map<string, number>([
    [',', 0],
    [';', 0],
    ['\t', 0],
  ])
  let quoted = false

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index]

    if (character === '"') {
      if (quoted && value[index + 1] === '"') {
        index += 1
      } else {
        quoted = !quoted
      }
      continue
    }

    if (!quoted && (character === '\n' || character === '\r')) break
    if (!quoted && counts.has(character)) {
      counts.set(character, (counts.get(character) ?? 0) + 1)
    }
  }

  return [...counts.entries()].reduce((best, current) =>
    current[1] > best[1] ? current : best
  )[0]
}

export const parseCsv = (value: string) => {
  if (!value) return []

  const delimiter = detectCsvDelimiter(value)
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false

  const finishRow = () => {
    row.push(field)
    rows.push(row)
    row = []
    field = ''
  }

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index]

    if (quoted) {
      if (character === '"' && value[index + 1] === '"') {
        field += '"'
        index += 1
      } else if (character === '"') {
        quoted = false
      } else {
        field += character
      }
      continue
    }

    if (character === '"') {
      quoted = true
    } else if (character === delimiter) {
      row.push(field)
      field = ''
    } else if (character === '\n' || character === '\r') {
      finishRow()
      if (character === '\r' && value[index + 1] === '\n') index += 1
    } else {
      field += character
    }
  }

  if (field || row.length) finishRow()
  if (rows[0]?.[0]) rows[0][0] = rows[0][0].replace(/^\uFEFF/, '')
  return rows
}
