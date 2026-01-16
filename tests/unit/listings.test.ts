import { describe, it, expect } from 'vitest'
import { filterListings } from '@/lib/listings'
import { ListingWithRelations, ListingFilters } from '@/lib/types'

const mockListings: ListingWithRelations[] = [
  {
    id: 1,
    address: '123 Main St',
    locationDescription: 'Downtown',
    cycleGroup: 1,
    propertyTypeId: 1,
    conditionId: 1,
    zoningId: 1,
    isActive: true,
    price: 100000,
    squareFootage: 1000,
    onMarket: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    dimensions: null,
    rooms: null,
    featureIds: [],
    propertyType: { id: 1, name: 'House' },
    condition: { id: 1, name: 'Good' },
    zoning: { id: 1, code: 'R1' },
    features: []
  },
  {
    id: 2,
    address: '456 Oak Ave',
    locationDescription: 'Suburb',
    cycleGroup: 2,
    propertyTypeId: 2,
    conditionId: 2,
    zoningId: 2,
    isActive: false,
    price: 200000,
    squareFootage: 2000,
    onMarket: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    dimensions: null,
    rooms: null,
    featureIds: [],
    propertyType: { id: 2, name: 'Apartment' },
    condition: { id: 2, name: 'Fair' },
    zoning: { id: 2, code: 'C1' },
    features: []
  }
]

describe('filterListings', () => {
  it('filters by search term in address', () => {
    const filters: ListingFilters = {
      search: 'Main',
      cycleGroup: null,
      propertyTypeId: null,
      conditionId: null,
      zoningId: null,
      isActive: null
    }
    const result = filterListings(mockListings, filters)
    expect(result).toHaveLength(1)
    expect(result[0].address).toBe('123 Main St')
  })

  it('filters by cycle group', () => {
    const filters: ListingFilters = {
      search: '',
      cycleGroup: 2,
      propertyTypeId: null,
      conditionId: null,
      zoningId: null,
      isActive: null
    }
    const result = filterListings(mockListings, filters)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(2)
  })

  it('filters by active status', () => {
    const filters: ListingFilters = {
      search: '',
      cycleGroup: null,
      propertyTypeId: null,
      conditionId: null,
      zoningId: null,
      isActive: true
    }
    const result = filterListings(mockListings, filters)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
  })

  it('filters by multiple criteria', () => {
    const filters: ListingFilters = {
      search: 'Downtown', // in locationDescription
      cycleGroup: 1,
      propertyTypeId: 1,
      conditionId: 1,
      zoningId: 1,
      isActive: true
    }
    const result = filterListings(mockListings, filters)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
  })

  it('returns empty if nothing matches', () => {
    const filters: ListingFilters = {
      search: 'Nonexistent',
      cycleGroup: null,
      propertyTypeId: null,
      conditionId: null,
      zoningId: null,
      isActive: null
    }
    const result = filterListings(mockListings, filters)
    expect(result).toHaveLength(0)
  })
})
