import Link from 'next/link'
import { Trophy, Users, Clock, TrendingUp } from 'lucide-react'

interface PoolCardProps {
  pool: {
    id: string
    name: string
    minParticipation: string
    winProbability: number
    totalBalance: string
    participants: number
    isActive: boolean
    endTime: number
  }
}

export default function PoolCard({ pool }: PoolCardProps) {
  const formatTimeRemaining = (endTime: number) => {
    const now = Date.now()
    const diff = endTime - now
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  return (
    <div className="card hover:shadow-xl transition-shadow duration-200">
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
  )
}
