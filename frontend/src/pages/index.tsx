import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Head from 'next/head'
import Link from 'next/link'
import { Trophy, Users, Clock, TrendingUp } from 'lucide-react'

export default function Home() {
  const { address, isConnected } = useAccount()
  const [stats, setStats] = useState({
    totalPools: 0,
    totalParticipants: 0,
    totalRewards: '0',
    activePools: 0
  })

  useEffect(() => {
    // TODO: Fetch real stats from contract
    setStats({
      totalPools: 12,
      totalParticipants: 156,
      totalRewards: '2.5',
      activePools: 8
    })
  }, [])

  return (
    <>
      <Head>
        <title>Prize Pool DApp - Decentralized Lottery System</title>
        <meta name="description" content="Participate in decentralized prize pools on Sepolia testnet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-primary-600" />
                <h1 className="ml-2 text-2xl font-bold text-gray-900">Prize Pool DApp</h1>
              </div>
              <ConnectButton />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Decentralized Prize Pool Lottery
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Participate in fair, transparent prize pools powered by Chainlink VRF. 
              Create your own pools or join existing ones on Sepolia testnet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pools" className="btn-primary text-lg px-8 py-3">
                View Prize Pools
              </Link>
              <Link href="/create" className="btn-secondary text-lg px-8 py-3">
                Create New Pool
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="card text-center">
              <Trophy className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalPools}</div>
              <div className="text-sm text-gray-600">Total Pools</div>
            </div>
            <div className="card text-center">
              <Users className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</div>
              <div className="text-sm text-gray-600">Participants</div>
            </div>
            <div className="card text-center">
              <TrendingUp className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalRewards} ETH</div>
              <div className="text-sm text-gray-600">Total Rewards</div>
            </div>
            <div className="card text-center">
              <Clock className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.activePools}</div>
              <div className="text-sm text-gray-600">Active Pools</div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fair & Transparent</h3>
              <p className="text-gray-600">
                Powered by Chainlink VRF for verifiable randomness. All transactions are transparent on the blockchain.
              </p>
            </div>
            <div className="card text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
              <p className="text-gray-600">
                Connect your wallet and start participating in seconds. No complex setup required.
              </p>
            </div>
            <div className="card text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p className="text-gray-600">
                Get immediate results after participating. Winners are determined instantly using VRF.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
