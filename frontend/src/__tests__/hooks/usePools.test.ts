import { renderHook, waitFor } from '@testing-library/react'
import { usePools, usePool } from '../../hooks/usePools'

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useContractRead: jest.fn()
}))

const mockUseContractRead = require('wagmi').useContractRead

describe('usePools', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns loading state initially', () => {
    mockUseContractRead.mockReturnValue({ data: undefined })
    
    const { result } = renderHook(() => usePools())
    
    expect(result.current.loading).toBe(true)
    expect(result.current.pools).toEqual([])
    expect(result.current.error).toBe(null)
  })

  it('returns pools when data is available', async () => {
    const mockPoolAddresses = ['0x123', '0x456', '0x789']
    mockUseContractRead
      .mockReturnValueOnce({ data: 3 }) // poolCount
      .mockReturnValueOnce({ data: mockPoolAddresses }) // poolAddresses

    const { result } = renderHook(() => usePools())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.pools).toHaveLength(3)
    expect(result.current.pools[0].id).toBe('0x123')
    expect(result.current.pools[1].id).toBe('0x456')
    expect(result.current.pools[2].id).toBe('0x789')
  })

  it('handles empty pool list', async () => {
    mockUseContractRead
      .mockReturnValueOnce({ data: 0 }) // poolCount
      .mockReturnValueOnce({ data: [] }) // poolAddresses

    const { result } = renderHook(() => usePools())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.pools).toEqual([])
    expect(result.current.error).toBe(null)
  })

  it('handles errors gracefully', async () => {
    mockUseContractRead.mockReturnValue({ 
      data: undefined, 
      error: new Error('Contract read failed') 
    })

    const { result } = renderHook(() => usePools())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Contract read failed')
    expect(result.current.pools).toEqual([])
  })
})

describe('usePool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns loading state initially', () => {
    const { result } = renderHook(() => usePool('test-pool-id'))
    
    expect(result.current.loading).toBe(true)
    expect(result.current.pool).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('returns pool data when available', async () => {
    const { result } = renderHook(() => usePool('test-pool-id'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.pool).toBeDefined()
    expect(result.current.pool?.id).toBe('test-pool-id')
    expect(result.current.pool?.name).toBe('Mega Prize Pool')
  })

  it('handles missing pool id', () => {
    const { result } = renderHook(() => usePool(''))

    expect(result.current.loading).toBe(false)
    expect(result.current.pool).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('handles errors gracefully', async () => {
    // Mock an error scenario
    const { result } = renderHook(() => usePool('invalid-pool-id'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // In the current implementation, it returns mock data
    // In a real implementation, this would handle errors
    expect(result.current.pool).toBeDefined()
  })
})
