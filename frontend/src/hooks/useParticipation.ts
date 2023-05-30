import { useState, useEffect } from 'react'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { CONTRACT_ADDRESSES, PRIZE_POOL_ABI } from '../utils/contracts'

interface Participation {
  id: string
  poolName: string
  amount: string
  timestamp: number
  hasWon: boolean
  reward: string
  poolId: string
}

export function useParticipation(poolAddress?: string) {
  const { address } = useAccount()
  const [participations, setParticipations] = useState<Participation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Read user history from contract
  const { data: userHistory } = useContractRead({
    address: poolAddress as `0x${string}`,
    abi: PRIZE_POOL_ABI,
    functionName: 'getUserHistory',
    args: [address],
    enabled: !!poolAddress && !!address,
    watch: true
  })

  useEffect(() => {
    const fetchParticipations = async () => {
      if (!address) {
        setParticipations([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        if (userHistory) {
          // Convert contract data to our format
          const participations: Participation[] = userHistory.map((participation: any, index: number) => ({
            id: `${poolAddress}-${index}`,
            poolName: 'Pool Name', // Would need to fetch from pool contract
            amount: (Number(participation.amount) / 1e18).toFixed(4),
            timestamp: Number(participation.timestamp) * 1000,
            hasWon: participation.hasWon,
            reward: (Number(participation.reward) / 1e18).toFixed(4),
            poolId: poolAddress || ''
          }))
          setParticipations(participations)
        } else {
          // Mock data for development
          const mockParticipations: Participation[] = [
            {
              id: '1',
              poolName: 'Mega Prize Pool',
              amount: '0.01',
              timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
              hasWon: true,
              reward: '0.25',
              poolId: poolAddress || '1'
            },
            {
              id: '2',
              poolName: 'High Stakes Pool',
              amount: '0.1',
              timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
              hasWon: false,
              reward: '0',
              poolId: poolAddress || '2'
            }
          ]
          setParticipations(mockParticipations)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch participations')
      } finally {
        setLoading(false)
      }
    }

    fetchParticipations()
  }, [address, userHistory, poolAddress])

  return { participations, loading, error }
}

export function usePoolParticipation(poolAddress: string, amount: string) {
  const { config } = usePrepareContractWrite({
    address: poolAddress as `0x${string}`,
    abi: PRIZE_POOL_ABI,
    functionName: 'participate',
    value: amount ? BigInt(Math.floor(parseFloat(amount) * 1e18)) : undefined,
    enabled: !!poolAddress && !!amount
  })

  const { write, isLoading, isSuccess, error } = useContractWrite(config)

  const participate = () => {
    if (write) {
      write()
    }
  }

  return {
    participate,
    isLoading,
    isSuccess,
    error: error?.message
  }
}
