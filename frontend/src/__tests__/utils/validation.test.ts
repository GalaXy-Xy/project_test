import {
  validateEtherAmount,
  validatePoolName,
  validateWinProbability,
  validatePlatformFee,
  validateDuration,
  validateMaxParticipants,
  validateMaxParticipationPerUser,
  validateWalletAddress,
  validateFormData
} from '../../utils/validation'

describe('Validation Utils', () => {
  describe('validateEtherAmount', () => {
    it('validates correct ether amounts', () => {
      expect(validateEtherAmount('0.01')).toEqual({ isValid: true })
      expect(validateEtherAmount('1.5')).toEqual({ isValid: true })
      expect(validateEtherAmount('100')).toEqual({ isValid: true })
    })

    it('rejects invalid ether amounts', () => {
      expect(validateEtherAmount('')).toEqual({ isValid: false, error: 'Amount is required' })
      expect(validateEtherAmount('0')).toEqual({ isValid: false, error: 'Amount must be greater than 0' })
      expect(validateEtherAmount('-1')).toEqual({ isValid: false, error: 'Amount must be greater than 0' })
      expect(validateEtherAmount('abc')).toEqual({ isValid: false, error: 'Amount must be a valid number' })
      expect(validateEtherAmount('1001')).toEqual({ isValid: false, error: 'Amount cannot exceed 1000 ETH' })
    })

    it('rejects amounts with too many decimal places', () => {
      const tooManyDecimals = '0.1234567890123456789' // 19 decimal places
      expect(validateEtherAmount(tooManyDecimals)).toEqual({ 
        isValid: false, 
        error: 'Amount cannot have more than 18 decimal places' 
      })
    })
  })

  describe('validatePoolName', () => {
    it('validates correct pool names', () => {
      expect(validatePoolName('Test Pool')).toEqual({ isValid: true })
      expect(validatePoolName('Mega-Prize_Pool')).toEqual({ isValid: true })
      expect(validatePoolName('Pool123')).toEqual({ isValid: true })
    })

    it('rejects invalid pool names', () => {
      expect(validatePoolName('')).toEqual({ isValid: false, error: 'Pool name is required' })
      expect(validatePoolName('AB')).toEqual({ isValid: false, error: 'Pool name must be at least 3 characters' })
      expect(validatePoolName('A'.repeat(51))).toEqual({ isValid: false, error: 'Pool name cannot exceed 50 characters' })
      expect(validatePoolName('Pool@#$')).toEqual({ isValid: false, error: 'Pool name can only contain letters, numbers, spaces, hyphens, and underscores' })
    })
  })

  describe('validateWinProbability', () => {
    it('validates correct win probabilities', () => {
      expect(validateWinProbability('1')).toEqual({ isValid: true })
      expect(validateWinProbability('50')).toEqual({ isValid: true })
      expect(validateWinProbability('100')).toEqual({ isValid: true })
    })

    it('rejects invalid win probabilities', () => {
      expect(validateWinProbability('')).toEqual({ isValid: false, error: 'Win probability is required' })
      expect(validateWinProbability('0')).toEqual({ isValid: false, error: 'Win probability must be greater than 0%' })
      expect(validateWinProbability('101')).toEqual({ isValid: false, error: 'Win probability cannot exceed 100%' })
      expect(validateWinProbability('abc')).toEqual({ isValid: false, error: 'Win probability must be a valid number' })
    })
  })

  describe('validatePlatformFee', () => {
    it('validates correct platform fees', () => {
      expect(validatePlatformFee('0')).toEqual({ isValid: true })
      expect(validatePlatformFee('5')).toEqual({ isValid: true })
      expect(validatePlatformFee('20')).toEqual({ isValid: true })
    })

    it('rejects invalid platform fees', () => {
      expect(validatePlatformFee('')).toEqual({ isValid: false, error: 'Platform fee is required' })
      expect(validatePlatformFee('-1')).toEqual({ isValid: false, error: 'Platform fee cannot be negative' })
      expect(validatePlatformFee('21')).toEqual({ isValid: false, error: 'Platform fee cannot exceed 20%' })
      expect(validatePlatformFee('abc')).toEqual({ isValid: false, error: 'Platform fee must be a valid number' })
    })
  })

  describe('validateDuration', () => {
    it('validates correct durations', () => {
      expect(validateDuration('1')).toEqual({ isValid: true })
      expect(validateDuration('30')).toEqual({ isValid: true })
      expect(validateDuration('365')).toEqual({ isValid: true })
    })

    it('rejects invalid durations', () => {
      expect(validateDuration('')).toEqual({ isValid: false, error: 'Duration is required' })
      expect(validateDuration('0')).toEqual({ isValid: false, error: 'Duration must be greater than 0 days' })
      expect(validateDuration('366')).toEqual({ isValid: false, error: 'Duration cannot exceed 365 days' })
      expect(validateDuration('abc')).toEqual({ isValid: false, error: 'Duration must be a valid number' })
    })
  })

  describe('validateMaxParticipants', () => {
    it('validates correct max participants', () => {
      expect(validateMaxParticipants('1')).toEqual({ isValid: true })
      expect(validateMaxParticipants('100')).toEqual({ isValid: true })
      expect(validateMaxParticipants('10000')).toEqual({ isValid: true })
    })

    it('rejects invalid max participants', () => {
      expect(validateMaxParticipants('')).toEqual({ isValid: false, error: 'Max participants is required' })
      expect(validateMaxParticipants('0')).toEqual({ isValid: false, error: 'Max participants must be greater than 0' })
      expect(validateMaxParticipants('10001')).toEqual({ isValid: false, error: 'Max participants cannot exceed 10,000' })
      expect(validateMaxParticipants('abc')).toEqual({ isValid: false, error: 'Max participants must be a valid number' })
    })
  })

  describe('validateMaxParticipationPerUser', () => {
    it('validates correct max participation per user', () => {
      expect(validateMaxParticipationPerUser('1')).toEqual({ isValid: true })
      expect(validateMaxParticipationPerUser('10')).toEqual({ isValid: true })
      expect(validateMaxParticipationPerUser('100')).toEqual({ isValid: true })
    })

    it('rejects invalid max participation per user', () => {
      expect(validateMaxParticipationPerUser('')).toEqual({ isValid: false, error: 'Max participation per user is required' })
      expect(validateMaxParticipationPerUser('0')).toEqual({ isValid: false, error: 'Max participation per user must be greater than 0' })
      expect(validateMaxParticipationPerUser('101')).toEqual({ isValid: false, error: 'Max participation per user cannot exceed 100' })
      expect(validateMaxParticipationPerUser('abc')).toEqual({ isValid: false, error: 'Max participation per user must be a valid number' })
    })
  })

  describe('validateWalletAddress', () => {
    it('validates correct wallet addresses', () => {
      expect(validateWalletAddress('0x1234567890123456789012345678901234567890')).toEqual({ isValid: true })
      expect(validateWalletAddress('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')).toEqual({ isValid: true })
    })

    it('rejects invalid wallet addresses', () => {
      expect(validateWalletAddress('')).toEqual({ isValid: false, error: 'Wallet address is required' })
      expect(validateWalletAddress('0x123')).toEqual({ isValid: false, error: 'Invalid wallet address format' })
      expect(validateWalletAddress('1234567890123456789012345678901234567890')).toEqual({ isValid: false, error: 'Invalid wallet address format' })
      expect(validateWalletAddress('0x123456789012345678901234567890123456789g')).toEqual({ isValid: false, error: 'Invalid wallet address format' })
    })
  })

  describe('validateFormData', () => {
    it('validates complete form data correctly', () => {
      const validData = {
        name: 'Test Pool',
        minParticipation: '0.01',
        winProbability: '10',
        platformFeePercent: '5',
        duration: '7',
        maxParticipants: '100',
        maxParticipationPerUser: '10',
        address: '0x1234567890123456789012345678901234567890'
      }

      const errors = validateFormData(validData)
      expect(errors).toEqual({})
    })

    it('returns errors for invalid form data', () => {
      const invalidData = {
        name: '',
        minParticipation: '0',
        winProbability: '101',
        platformFeePercent: '25',
        duration: '0',
        maxParticipants: '0',
        maxParticipationPerUser: '0',
        address: 'invalid'
      }

      const errors = validateFormData(invalidData)
      expect(Object.keys(errors).length).toBeGreaterThan(0)
      expect(errors.name).toBeDefined()
      expect(errors.minParticipation).toBeDefined()
      expect(errors.winProbability).toBeDefined()
      expect(errors.platformFeePercent).toBeDefined()
      expect(errors.duration).toBeDefined()
      expect(errors.maxParticipants).toBeDefined()
      expect(errors.maxParticipationPerUser).toBeDefined()
      expect(errors.address).toBeDefined()
    })
  })
})
