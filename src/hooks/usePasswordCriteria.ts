export interface PasswordCriteria {
  length: boolean
  uppercase: boolean
  number: boolean
  symbol: boolean
  valid: boolean
}

export function usePasswordCriteria(password: string): PasswordCriteria {
  const trimmed = password ?? ''
  const length = trimmed.length >= 8
  const uppercase = /[A-Z]/.test(trimmed)
  const number = /[0-9]/.test(trimmed)
  const symbol = /[^A-Za-z0-9\s]/.test(trimmed)

  return {
    length,
    uppercase,
    number,
    symbol,
    valid: length && uppercase && number && symbol,
  }
}
