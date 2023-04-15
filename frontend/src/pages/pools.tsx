import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import Head from 'next/head'
import Link from 'next/link'
import { Trophy, Users, Clock, TrendingUp, Filter, Search } from 'lucide-react'

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

export default function Pools() {
  const { address, isConnected } = useAccount()
  const [pools, setPools] = useState<Pool[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'balance' | 'participants' | 'probability'>('balance')

  useEffect(() => {
    // TODO: Fetch real pools from contract
    const mockPools: Pool[] = [
      {
        id: '1',
        name: 'Mega Prize Pool',
        minParticipation: '0.01',
        winProbability: 10,
        totalBalance: '2.5',
        participants: 45,
        isActive: true,
        endTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
        creator: '0x1234...5678'
      },
      {
        id: '2',
        name: 'High Stakes Pool',
        minParticipation: '0.1',
        winProbability: 5,
        totalBalance: '5.2',
        participants: 23,
        isActive: true,
        endTime: Date.now() + 3 * 24 * 60 * 60 * 1000,
        creator: '0x9876...5432'
      },
      {
        id: '3',
        name: 'Quick Win Pool',
        minParticipation: '0.005',
        winProbability: 25,
        totalBalance: '0.8',
        participants: 67,
        isActive: true,
        endTime: Date.now() + 1 * 24 * 60 * 60 * 1000,
        creator: '0x4567...8901'
      }
    ]
    
    setTimeout(() => {
      setPools(mockPools)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredPools = pools.filter(pool =>
    pool.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'balance':
        return parseFloat(b.totalBalance) - parseFloat(a.totalBalance)
      case 'participants':
        return b.participants - a.participants
      case 'probability':
        return b.winProbability - a.winProbability
      default:
        return 0
    }
  })

  const formatTimeRemaining = (endTime: number) => {
    const now = Date.now()
    const diff = endTime - now
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading prize pools...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Prize Pools - Prize Pool DApp</title>
        <meta name="description" content="Browse and participate in decentralized prize pools" />
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
                <Link href="/create" className="btn-primary">
                  Create Pool
                </Link>
                {isConnected && (
                  <Link href="/profile" className="btn-secondary">
                    My Profile
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Prize Pools</h2>
            <p className="text-gray-600">Discover and participate in decentralized prize pools</p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search pools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="input-field"
                >
                  <option value="balance">Sort by Balance</option>
                  <option value="participants">Sort by Participants</option>
                  <option value="probability">Sort by Win Rate</option>
                </select>
                <button className="btn-secondary flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Pools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPools.map((pool) => (
              <div key={pool.id} className="card hover:shadow-xl transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{pool.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pool.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {pool.isActive ? 'Active' : 'Ended'}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prize Pool</span>
                    <span className="font-semibold">{pool.totalBalance} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Participants</span>
                    <span className="font-semibold">{pool.participants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Win Probability</span>
                    <span className="font-semibold">{pool.winProbability}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Participation</span>
                    <span className="font-semibold">{pool.minParticipation} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Remaining</span>
                    <span className="font-semibold">{formatTimeRemaining(pool.endTime)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link 
                    href={`/pools/${pool.id}`}
                    className="flex-1 btn-primary text-center"
                  >
                    View Details
                  </Link>
                  <button className="btn-secondary">
                    <TrendingUp className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredPools.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No pools found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or create a new pool</p>
              <Link href="/create" className="btn-primary">
                Create New Pool
              </Link>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
