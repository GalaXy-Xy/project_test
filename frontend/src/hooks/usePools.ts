import { useState, useEffect } from 'react'
import { useContractRead } from 'wagmi'
import { CONTRACT_ADDRESSES, POOL_FACTORY_ABI } from '../utils/contracts'

interface Pool {
  id: string
  name: string
  minParticipation: string
  winProbability: number
  totalBalance: string
  participants: number
  isActive: boolean
  endTime: number
  creator: string
}

export function usePools() {
  const [pools, setPools] = useState<Pool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Read pool count from contract
  const { data: poolCount } = useContractRead({
    address: CONTRACT_ADDRESSES.POOL_FACTORY,
    abi: POOL_FACTORY_ABI,
    functionName: 'getPoolCount',
    watch: true
  })

  // Read all pool addresses
  const { data: poolAddresses } = useContractRead({
    address: CONTRACT_ADDRESSES.POOL_FACTORY,
    abi: POOL_FACTORY_ABI,
    functionName: 'getPools',
    watch: true,
    enabled: !!poolCount && poolCount > 0
  })

  useEffect(() => {
    const fetchPools = async () => {
      if (!poolAddresses || poolAddresses.length === 0) {
        setPools([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // TODO: Fetch pool details from each pool contract
        // For now, return mock data
        const mockPools: Pool[] = poolAddresses.map((address, index) => ({
          id: address,
          name: `Pool ${index + 1}`,
          minParticipation: '0.01',
          winProbability: 10 + (index * 5),
          totalBalance: (0.5 + index * 0.2).toFixed(2),
          participants: 10 + index * 5,
          isActive: true,
          endTime: Date.now() + (7 - index) * 24 * 60 * 60 * 1000,
          creator: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`
        }))

        setPools(mockPools)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pools')
      } finally {
        setLoading(false)
      }
    }

    fetchPools()
  }, [poolAddresses])

  return { pools, loading, error, refetch: () => fetchPools() }
}

export function usePool(poolId: string) {
  const [pool, setPool] = useState<Pool | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPool = async () => {
      if (!poolId) return

      try {
        setLoading(true)
        setError(null)

        // TODO: Fetch pool details from contract
        // For now, return mock data
        const mockPool: Pool = {
          id: poolId,
          name: 'Mega Prize Pool',
          minParticipation: '0.01',
          winProbability: 10,
          totalBalance: '2.5',
          participants: 45,
          isActive: true,
          endTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
          creator: '0x1234...5678'
        }

        setPool(mockPool)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pool')
      } finally {
        setLoading(false)
      }
    }

    fetchPool()
  }, [poolId])

  return { pool, loading, error }
}
