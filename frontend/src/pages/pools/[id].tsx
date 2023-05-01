import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import Head from 'next/head'
import Link from 'next/link'
import { Trophy, Users, Clock, TrendingUp, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'

interface PoolDetails {
  id: string
  name: string
  minParticipation: string
  winProbability: number
  totalBalance: string
  participants: number
  isActive: boolean
  endTime: number
  creator: string
  platformFeePercent: number
  participantHistory: Array<{
    address: string
    amount: string
    timestamp: number
    hasWon: boolean
    reward: string
  }>
}

export default function PoolDetail() {
  const router = useRouter()
  const { id } = router.query
  const { address, isConnected } = useAccount()
  const [poolDetails, setPoolDetails] = useState<PoolDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [participationAmount, setParticipationAmount] = useState('')
  const [isParticipating, setIsParticipating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!id) return

    // TODO: Fetch real pool data from contract
    const mockPoolDetails: PoolDetails = {
      id: id as string,
      name: 'Mega Prize Pool',
      minParticipation: '0.01',
      winProbability: 10,
      totalBalance: '2.5',
      participants: 45,
      isActive: true,
      endTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
      creator: '0x1234...5678',
      platformFeePercent: 5,
      participantHistory: [
        {
          address: '0x1111...1111',
          amount: '0.01',
          timestamp: Date.now() - 2 * 60 * 60 * 1000,
          hasWon: true,
          reward: '0.25'
        },
        {
          address: '0x2222...2222',
          amount: '0.02',
          timestamp: Date.now() - 4 * 60 * 60 * 1000,
          hasWon: false,
          reward: '0'
        },
        {
          address: '0x3333...3333',
          amount: '0.01',
          timestamp: Date.now() - 6 * 60 * 60 * 1000,
          hasWon: true,
          reward: '0.15'
        }
      ]
    }

    setTimeout(() => {
      setPoolDetails(mockPoolDetails)
      setLoading(false)
    }, 1000)
  }, [id])

  const formatTimeRemaining = (endTime: number) => {
    const now = Date.now()
    const diff = endTime - now
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleParticipation = async () => {
    if (!isConnected || !poolDetails) return

    const amount = parseFloat(participationAmount)
    if (amount < parseFloat(poolDetails.minParticipation)) {
      alert(`Minimum participation is ${poolDetails.minParticipation} ETH`)
      return
    }

    setIsParticipating(true)
    
    try {
      // TODO: Implement actual contract interaction
      console.log('Participating in pool:', poolDetails.id, 'Amount:', participationAmount)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setShowSuccess(true)
      setParticipationAmount('')
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
      
    } catch (error) {
      console.error('Error participating:', error)
      alert('Error participating in pool. Please try again.')
    } finally {
      setIsParticipating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pool details...</p>
        </div>
      </div>
    )
  }

  if (!poolDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pool Not Found</h2>
          <p className="text-gray-600 mb-6">The requested pool could not be found</p>
          <Link href="/pools" className="btn-primary">
            Back to Pools
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{poolDetails.name} - Prize Pool DApp</title>
        <meta name="description" content={`Participate in ${poolDetails.name} prize pool`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="flex items-center">
                <Trophy className="h-8 w-8 text-primary-600" />
                <h1 className="ml-2 text-2xl font-bold text-gray-900">Prize Pool DApp</h1>
              </Link>
              <div className="flex items-center space-x-4">
                <Link href="/pools" className="btn-secondary">
                  View Pools
                </Link>
                <Link href="/create" className="btn-primary">
                  Create Pool
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <Link href="/pools" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pools
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{poolDetails.name}</h2>
            <p className="text-gray-600">Pool ID: {poolDetails.id}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pool Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pool Stats */}
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Pool Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Prize Pool</div>
                    <div className="text-2xl font-bold text-gray-900">{poolDetails.totalBalance} ETH</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Participants</div>
                    <div className="text-2xl font-bold text-gray-900">{poolDetails.participants}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Win Probability</div>
                    <div className="text-2xl font-bold text-gray-900">{poolDetails.winProbability}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Min Participation</div>
                    <div className="text-2xl font-bold text-gray-900">{poolDetails.minParticipation} ETH</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Platform Fee</div>
                    <div className="text-2xl font-bold text-gray-900">{poolDetails.platformFeePercent}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Time Remaining</div>
                    <div className="text-2xl font-bold text-gray-900">{formatTimeRemaining(poolDetails.endTime)}</div>
                  </div>
                </div>
              </div>

              {/* Participation History */}
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Participants</h3>
                {poolDetails.participantHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No participants yet</p>
                ) : (
                  <div className="space-y-3">
                    {poolDetails.participantHistory.map((participant, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <div>
                          <div className="font-mono text-sm text-gray-900">{participant.address}</div>
                          <div className="text-xs text-gray-500">{formatDate(participant.timestamp)}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{participant.amount} ETH</div>
                          <div className={`text-xs ${participant.hasWon ? 'text-green-600' : 'text-red-600'}`}>
                            {participant.hasWon ? `Won ${participant.reward} ETH` : 'Lost'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Participation Panel */}
            <div className="space-y-6">
              {/* Participation Form */}
              {poolDetails.isActive && (
                <div className="card">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Participate</h3>
                  
                  {!isConnected ? (
                    <div className="text-center py-4">
                      <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-gray-600 mb-4">Connect your wallet to participate</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Participation Amount (ETH)
                        </label>
                        <input
                          type="number"
                          value={participationAmount}
                          onChange={(e) => setParticipationAmount(e.target.value)}
                          placeholder={poolDetails.minParticipation}
                          step="0.001"
                          min={poolDetails.minParticipation}
                          className="input-field"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Minimum: {poolDetails.minParticipation} ETH
                        </p>
                      </div>

                      <button
                        onClick={handleParticipation}
                        disabled={isParticipating || !participationAmount}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isParticipating ? 'Participating...' : 'Participate Now'}
                      </button>

                      {showSuccess && (
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Participation successful! Waiting for result...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Pool Status */}
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Pool Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      poolDetails.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {poolDetails.isActive ? 'Active' : 'Ended'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Creator</span>
                    <span className="font-mono text-sm">{poolDetails.creator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Time</span>
                    <span className="text-sm">{formatDate(poolDetails.endTime)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
