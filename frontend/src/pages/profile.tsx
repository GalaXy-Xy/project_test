import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import WalletConnect from '@/components/WalletConnect';
import LoadingSpinner from '@/components/LoadingSpinner';
import Notification from '@/components/Notification';
import { useParticipation } from '@/hooks/useParticipation';
import { formatEther, formatAddress, getExplorerUrl } from '@/utils/contracts';
import { 
  TrophyIcon, 
  UserIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { state } = useApp();
  const { participations, loading, getParticipationStats, getRecentParticipations, getWinningParticipations } = useParticipation();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'winnings'>('overview');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
  } | null>(null);

  const stats = getParticipationStats();
  const recentParticipations = getRecentParticipations(10);
  const winningParticipations = getWinningParticipations();

  if (!state.isConnected) {
    return (
      <>
        <Head>
          <title>Profile - Prize Pool DApp</title>
          <meta name="description" content="View your participation history and statistics." />
        </Head>

        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center">
                    <TrophyIcon className="h-8 w-8 text-primary-600 mr-3" />
                    <h1 className="text-xl font-bold text-gray-900">Prize Pool DApp</h1>
                  </Link>
                </div>
                <WalletConnect />
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
              <p className="text-gray-600 mb-6">Please connect your wallet to view your profile.</p>
              <WalletConnect />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Profile - Prize Pool DApp</title>
        <meta name="description" content="View your participation history and statistics." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <TrophyIcon className="h-8 w-8 text-primary-600 mr-3" />
                  <h1 className="text-xl font-bold text-gray-900">Prize Pool DApp</h1>
                </Link>
              </div>
              <WalletConnect />
            </div>
          </div>
        </header>

        {/* Profile Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mr-4">
                <UserIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                <p className="text-gray-600 mt-1">
                  {formatAddress(state.account || '')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: ChartBarIcon },
                { id: 'history', name: 'History', icon: ClockIcon },
                { id: 'winnings', name: 'Winnings', icon: TrophyIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading profile data..." />
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                          <ChartBarIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{stats.totalParticipations}</p>
                          <p className="text-sm text-gray-500">Total Participations</p>
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <div className="flex items-center">
                        <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                          <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{stats.totalWon}</p>
                          <p className="text-sm text-gray-500">Times Won</p>
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <div className="flex items-center">
                        <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                          <TrophyIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{stats.winRate.toFixed(1)}%</p>
                          <p className="text-sm text-gray-500">Win Rate</p>
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <div className="flex items-center">
                        <div className={`rounded-full w-12 h-12 flex items-center justify-center mr-4 ${
                          stats.netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <CurrencyDollarIcon className={`h-6 w-6 ${
                            stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <p className={`text-2xl font-bold ${
                            stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stats.netProfit >= 0 ? '+' : ''}{stats.netProfit.toFixed(4)}
                          </p>
                          <p className="text-sm text-gray-500">Net Profit (ETH)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Stats */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Participation Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Spent:</span>
                          <span className="font-medium">{stats.totalSpent.toFixed(4)} ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Winnings:</span>
                          <span className="font-medium text-green-600">{stats.totalWinnings.toFixed(4)} ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Net Profit/Loss:</span>
                          <span className={`font-medium ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stats.netProfit >= 0 ? '+' : ''}{stats.netProfit.toFixed(4)} ETH
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Win Rate:</span>
                          <span className="font-medium">{stats.winRate.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average Win:</span>
                          <span className="font-medium">
                            {stats.totalWon > 0 ? (stats.totalWinnings / stats.totalWon).toFixed(4) : '0.0000'} ETH
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average Participation:</span>
                          <span className="font-medium">
                            {stats.totalParticipations > 0 ? (stats.totalSpent / stats.totalParticipations).toFixed(4) : '0.0000'} ETH
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Participations</h3>
                  {recentParticipations.length === 0 ? (
                    <div className="text-center py-8">
                      <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No participation history found.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentParticipations.map((participation, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            {participation.hasWon ? (
                              <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
                            ) : (
                              <XCircleIcon className="h-6 w-6 text-red-600 mr-3" />
                            )}
                            <div>
                              <p className="font-medium">
                                {participation.poolName || 'Unknown Pool'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(participation.timestamp * 1000).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatEther(participation.amount)} ETH
                            </p>
                            {participation.hasWon && (
                              <p className="text-sm text-green-600">
                                Won {formatEther(participation.winnings)} ETH
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Winnings Tab */}
              {activeTab === 'winnings' && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Winning History</h3>
                  {winningParticipations.length === 0 ? (
                    <div className="text-center py-8">
                      <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No winnings yet. Keep participating!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {winningParticipations.map((participation, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center">
                            <TrophyIcon className="h-6 w-6 text-green-600 mr-3" />
                            <div>
                              <p className="font-medium">
                                {participation.poolName || 'Unknown Pool'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(participation.timestamp * 1000).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">
                              +{formatEther(participation.winnings)} ETH
                            </p>
                            <p className="text-sm text-gray-500">
                              From {formatEther(participation.amount)} ETH bet
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Notification */}
        {notification && (
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </>
  );
}
