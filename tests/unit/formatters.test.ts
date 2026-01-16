import { describe, it, expect } from 'vitest'
import { formatPrice, formatSquareFootage } from '@/lib/formatters'

describe('formatters', () => {
  describe('formatPrice', () => {
    it('formats a number correctly', () => {
      expect(formatPrice(1000)).toBe('$1,000')
      expect(formatPrice(550.5)).toBe('$551') // maxFractionDigits: 0
    })

    it('returns "Price TBD" for null', () => {
      expect(formatPrice(null)).toBe('Price TBD')
    })
  })

  describe('formatSquareFootage', () => {
    it('formats sqft correctly', () => {
      expect(formatSquareFootage(1500)).toBe('1,500 sq ft')
    })

    it('returns "—" for null', () => {
      expect(formatSquareFootage(null)).toBe('—')
    })
  })
})
