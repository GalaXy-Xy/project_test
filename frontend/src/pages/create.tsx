import { useState } from 'react'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'
import Head from 'next/head'
import Link from 'next/link'
import { Trophy, ArrowLeft, AlertCircle } from 'lucide-react'

export default function CreatePool() {
  const { address, isConnected } = useAccount()
  const [formData, setFormData] = useState({
    name: '',
    minParticipation: '',
    winProbability: '',
    platformFeePercent: '5',
    duration: '7'
  })
  const [initialFunding, setInitialFunding] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected) return

    setIsSubmitting(true)
    
    try {
      // TODO: Implement actual contract interaction
      console.log('Creating pool with data:', formData, 'Initial funding:', initialFunding)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Pool created successfully!')
      // Redirect to pools page
    } catch (error) {
      console.error('Error creating pool:', error)
      alert('Error creating pool. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateForm = () => {
    return (
      formData.name.trim() &&
      parseFloat(formData.minParticipation) > 0 &&
      parseFloat(formData.winProbability) > 0 &&
      parseFloat(formData.winProbability) <= 100 &&
      parseFloat(formData.platformFeePercent) >= 0 &&
      parseFloat(formData.platformFeePercent) <= 20 &&
      parseFloat(formData.duration) > 0 &&
      parseFloat(initialFunding) > 0
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to create a prize pool</p>
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Create Prize Pool - Prize Pool DApp</title>
        <meta name="description" content="Create a new decentralized prize pool" />
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
                <Link href="/profile" className="btn-secondary">
                  My Profile
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <Link href="/pools" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pools
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Prize Pool</h2>
            <p className="text-gray-600">Set up your own decentralized prize pool for others to participate in</p>
          </div>

          {/* Form */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pool Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Pool Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter a catchy name for your pool"
                  className="input-field"
                  required
                />
              </div>

              {/* Min Participation */}
              <div>
                <label htmlFor="minParticipation" className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Participation (ETH)
                </label>
                <input
                  type="number"
                  id="minParticipation"
                  name="minParticipation"
                  value={formData.minParticipation}
                  onChange={handleInputChange}
                  placeholder="0.01"
                  step="0.001"
                  min="0.001"
                  className="input-field"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Minimum amount users need to participate</p>
              </div>

              {/* Win Probability */}
              <div>
                <label htmlFor="winProbability" className="block text-sm font-medium text-gray-700 mb-2">
                  Win Probability (%)
                </label>
                <input
                  type="number"
                  id="winProbability"
                  name="winProbability"
                  value={formData.winProbability}
                  onChange={handleInputChange}
                  placeholder="10"
                  min="1"
                  max="100"
                  className="input-field"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Chance of winning (1-100%)</p>
              </div>

              {/* Platform Fee */}
              <div>
                <label htmlFor="platformFeePercent" className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Fee (%)
                </label>
                <select
                  id="platformFeePercent"
                  name="platformFeePercent"
                  value={formData.platformFeePercent}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="0">0% (No fee)</option>
                  <option value="1">1%</option>
                  <option value="2">2%</option>
                  <option value="5">5% (Recommended)</option>
                  <option value="10">10%</option>
                  <option value="20">20% (Maximum)</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">Percentage you keep from the pool</p>
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Pool Duration (days)
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="1">1 day</option>
                  <option value="3">3 days</option>
                  <option value="7">7 days (Recommended)</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>

              {/* Initial Funding */}
              <div>
                <label htmlFor="initialFunding" className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Funding (ETH)
                </label>
                <input
                  type="number"
                  id="initialFunding"
                  value={initialFunding}
                  onChange={(e) => setInitialFunding(e.target.value)}
                  placeholder="0.1"
                  step="0.001"
                  min="0.001"
                  className="input-field"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Initial amount to seed the prize pool</p>
              </div>

              {/* Summary */}
              <div className="bg-secondary-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Pool Summary</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Name: {formData.name || 'Not specified'}</div>
                  <div>Min Participation: {formData.minParticipation || '0'} ETH</div>
                  <div>Win Rate: {formData.winProbability || '0'}%</div>
                  <div>Platform Fee: {formData.platformFeePercent}%</div>
                  <div>Duration: {formData.duration} days</div>
                  <div>Initial Funding: {initialFunding || '0'} ETH</div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!validateForm() || isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating Pool...' : 'Create Prize Pool'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  )
}
