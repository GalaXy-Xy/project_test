import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import Head from 'next/head'
import Link from 'next/link'
import { Trophy, User, Clock, TrendingUp, ArrowLeft, Award } from 'lucide-react'

interface Participation {
  id: string
  poolName: string
  amount: string
  timestamp: number
  hasWon: boolean
  reward: string
  poolId: string
}

export default function Profile() {
  const { address, isConnected } = useAccount()
  const [participations, setParticipations] = useState<Participation[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalParticipations: 0,
    totalWon: 0,
    totalRewards: '0',
    winRate: 0
  })

  useEffect(() => {
    if (!isConnected) {
      setLoading(false)
      return
    }

    // TODO: Fetch real data from contract
    const mockParticipations: Participation[] = [
      {
        id: '1',
        poolName: 'Mega Prize Pool',
        amount: '0.01',
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        hasWon: true,
        reward: '0.25',
        poolId: '1'
      },
      {
        id: '2',
        poolName: 'High Stakes Pool',
        amount: '0.1',
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
        hasWon: false,
        reward: '0',
        poolId: '2'
      },
      {
        id: '3',
        poolName: 'Quick Win Pool',
        amount: '0.005',
        timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
        hasWon: true,
        reward: '0.15',
        poolId: '3'
      }
    ]

    setTimeout(() => {
      setParticipations(mockParticipations)
      
      const totalWon = mockParticipations.filter(p => p.hasWon).length
      const totalRewards = mockParticipations.reduce((sum, p) => sum + parseFloat(p.reward), 0)
      const winRate = mockParticipations.length > 0 ? (totalWon / mockParticipations.length) * 100 : 0
      
      setStats({
        totalParticipations: mockParticipations.length,
        totalWon,
        totalRewards: totalRewards.toFixed(3),
        winRate: Math.round(winRate)
      })
      
      setLoading(false)
    }, 1000)
  }, [isConnected])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to view your profile</p>
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>My Profile - Prize Pool DApp</title>
        <meta name="description" content="View your participation history and statistics" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h2>
            <p className="text-gray-600">Your participation history and statistics</p>
          </div>

          {/* Wallet Address */}
          <div className="card mb-8">
            <div className="flex items-center">
              <User className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Connected Wallet</h3>
                <p className="text-gray-600 font-mono text-sm">{address}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card text-center">
              <Trophy className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalParticipations}</div>
              <div className="text-sm text-gray-600">Total Participations</div>
            </div>
            <div className="card text-center">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalWon}</div>
              <div className="text-sm text-gray-600">Times Won</div>
            </div>
            <div className="card text-center">
              <TrendingUp className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalRewards} ETH</div>
              <div className="text-sm text-gray-600">Total Rewards</div>
            </div>
            <div className="card text-center">
              <Clock className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.winRate}%</div>
              <div className="text-sm text-gray-600">Win Rate</div>
            </div>
          </div>

          {/* Participation History */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Participation History</h3>
            
            {participations.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No participations yet</h4>
                <p className="text-gray-600 mb-6">Start participating in prize pools to see your history here</p>
                <Link href="/pools" className="btn-primary">
                  Browse Pools
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pool
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Result
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reward
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {participations.map((participation) => (
                      <tr key={participation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {participation.poolName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {participation.amount} ETH
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(participation.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            participation.hasWon
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {participation.hasWon ? 'Won' : 'Lost'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {participation.hasWon ? `${participation.reward} ETH` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
