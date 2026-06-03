type InputValue = string | number | null

export function fNumber(number: InputValue) {
  if (!number && number !== 0) return ''
  return Number(number).toLocaleString('en-US')
}

export function fCurrency(number: InputValue) {
  if (!number && number !== 0) return ''
  const value = Number(number)
  const formatted = value.toLocaleString('vi-VN')
  return `${formatted}đ`
}

export function fPercent(number: InputValue) {
  if (!number && number !== 0) return ''
  const value = Number(number) / 100
  const formatted = (value * 100).toFixed(1)
  return `${formatted}%`.replace(/\.0%$/, '%')
}

export function fShortenNumber(number: InputValue) {
  if (!number && number !== 0) return ''
  const value = Number(number)
  const abs = Math.abs(value)

  if (abs >= 1e9) {
    const formatted = (value / 1e9).toFixed(2)
    return `${formatted}b`.replace(/\.00/, '')
  }
  if (abs >= 1e6) {
    const formatted = (value / 1e6).toFixed(2)
    return `${formatted}m`.replace(/\.00/, '')
  }
  if (abs >= 1e3) {
    const formatted = (value / 1e3).toFixed(2)
    return `${formatted}k`.replace(/\.00/, '')
  }

  return value.toFixed(2).replace(/\.00$/, '')
}

export function fData(number: InputValue) {
  if (!number && number !== 0) return ''
  const value = Number(number)
  const abs = Math.abs(value)

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  let unitIndex = 0
  let result = abs

  while (result >= 1024 && unitIndex < units.length - 1) {
    result /= 1024
    unitIndex++
  }

  const formatted = result.toFixed(1)
  return `${formatted} ${units[unitIndex]}`.replace(/\.0 /, ' ')
}
