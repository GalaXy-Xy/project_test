import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import WalletConnect from '@/components/WalletConnect';
import LoadingSpinner from '@/components/LoadingSpinner';
import Notification from '@/components/Notification';
import { usePools } from '@/hooks/usePools';
import { validatePoolCreation } from '@/utils/validation';
import { 
  TrophyIcon, 
  ArrowLeftIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

export default function CreatePoolPage() {
  const { state } = useApp();
  const { createPool, loading } = usePools();
  const [formData, setFormData] = useState({
    name: '',
    minParticipation: '',
    winProbability: '1',
    winProbabilityDenominator: '10',
    platformFeePercentage: '20',
    duration: '',
    initialFunding: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.isConnected) {
      setNotification({
        type: 'warning',
        title: 'Wallet Not Connected',
        message: 'Please connect your wallet to create a pool.',
      });
      return;
    }

    // Validate form data
    const validation = validatePoolCreation(formData);
    if (!validation.isValid) {
      setNotification({
        type: 'error',
        title: 'Validation Error',
        message: validation.error,
      });
      return;
    }

    setIsSubmitting(true);
    setNotification(null);

    try {
      const txHash = await createPool(formData, formData.initialFunding);
      
      setNotification({
        type: 'success',
        title: 'Pool Created Successfully!',
        message: `Transaction hash: ${txHash}`,
      });

      // Reset form
      setFormData({
        name: '',
        minParticipation: '',
        winProbability: '1',
        winProbabilityDenominator: '10',
        platformFeePercentage: '20',
        duration: '',
        initialFunding: '',
      });
    } catch (error: any) {
      setNotification({
        type: 'error',
        title: 'Failed to Create Pool',
        message: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const winPercentage = (parseFloat(formData.winProbability) / parseFloat(formData.winProbabilityDenominator)) * 100;

  return (
    <>
      <Head>
        <title>Create Pool - Prize Pool DApp</title>
        <meta name="description" content="Create a new prize pool for decentralized lottery participation." />
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

        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center">
              <Link href="/pools" className="mr-4">
                <ArrowLeftIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create Prize Pool</h1>
                <p className="text-gray-600 mt-2">
                  Set up a new decentralized lottery pool
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pool Name */}
              <div>
                <label htmlFor="name" className="label">
                  Pool Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter a name for your pool"
                  required
                />
              </div>

              {/* Minimum Participation */}
              <div>
                <label htmlFor="minParticipation" className="label">
                  Minimum Participation (ETH) *
                </label>
                <input
                  type="number"
                  id="minParticipation"
                  name="minParticipation"
                  value={formData.minParticipation}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="0.01"
                  step="0.001"
                  min="0"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum amount users must pay to participate
                </p>
              </div>

              {/* Win Probability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="winProbability" className="label">
                    Win Probability Numerator *
                  </label>
                  <input
                    type="number"
                    id="winProbability"
                    name="winProbability"
                    value={formData.winProbability}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="1"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="winProbabilityDenominator" className="label">
                    Denominator *
                  </label>
                  <input
                    type="number"
                    id="winProbabilityDenominator"
                    name="winProbabilityDenominator"
                    value={formData.winProbabilityDenominator}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="10"
                    min="2"
                    required
                  />
                </div>
              </div>
              
              {formData.winProbability && formData.winProbabilityDenominator && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">
                      Win probability: {winPercentage.toFixed(1)}% (1 in {formData.winProbabilityDenominator} chance)
                    </span>
                  </div>
                </div>
              )}

              {/* Platform Fee */}
              <div>
                <label htmlFor="platformFeePercentage" className="label">
                  Platform Fee Percentage *
                </label>
                <input
                  type="number"
                  id="platformFeePercentage"
                  name="platformFeePercentage"
                  value={formData.platformFeePercentage}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="20"
                  min="0"
                  max="50"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Percentage of each participation that goes to platform fees (0-50%)
                </p>
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="label">
                  Duration (seconds) - Optional
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="604800 (7 days)"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty for no time limit. Common values: 3600 (1 hour), 86400 (1 day), 604800 (1 week)
                </p>
              </div>

              {/* Initial Funding */}
              <div>
                <label htmlFor="initialFunding" className="label">
                  Initial Funding (ETH) *
                </label>
                <input
                  type="number"
                  id="initialFunding"
                  name="initialFunding"
                  value={formData.initialFunding}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="0.1"
                  step="0.001"
                  min="0"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Initial ETH amount to fund the pool
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link href="/pools">
                  <button type="button" className="btn-secondary">
                    Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || loading || !state.isConnected}
                  className="btn-primary"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Creating Pool...</span>
                    </div>
                  ) : (
                    'Create Pool'
                  )}
                </button>
              </div>
            </form>
          </div>
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
