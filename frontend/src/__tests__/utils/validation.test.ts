import {
  validateEtherAmount,
  validatePoolName,
  validateWinProbability,
  validatePlatformFee,
  validateDuration,
  validatePoolCreation,
  validateParticipation,
} from '@/utils/validation';

describe('validation', () => {
  describe('validateEtherAmount', () => {
    it('should validate correct ether amounts', () => {
      expect(validateEtherAmount('1.0')).toEqual({ isValid: true });
      expect(validateEtherAmount('0.001')).toEqual({ isValid: true });
      expect(validateEtherAmount('100')).toEqual({ isValid: true });
    });

    it('should reject invalid ether amounts', () => {
      expect(validateEtherAmount('')).toEqual({ isValid: false, error: 'Amount is required' });
      expect(validateEtherAmount('0')).toEqual({ isValid: false, error: 'Amount must be greater than 0' });
      expect(validateEtherAmount('-1')).toEqual({ isValid: false, error: 'Amount must be greater than 0' });
      expect(validateEtherAmount('abc')).toEqual({ isValid: false, error: 'Amount must be a valid number' });
      expect(validateEtherAmount('1001')).toEqual({ isValid: false, error: 'Amount cannot exceed 1000 ETH' });
    });
  });

  describe('validatePoolName', () => {
    it('should validate correct pool names', () => {
      expect(validatePoolName('Test Pool')).toEqual({ isValid: true });
      expect(validatePoolName('My Awesome Pool')).toEqual({ isValid: true });
      expect(validatePoolName('123')).toEqual({ isValid: true });
    });

    it('should reject invalid pool names', () => {
      expect(validatePoolName('')).toEqual({ isValid: false, error: 'Pool name is required' });
      expect(validatePoolName('ab')).toEqual({ isValid: false, error: 'Pool name must be at least 3 characters' });
      expect(validatePoolName('a'.repeat(51))).toEqual({ isValid: false, error: 'Pool name cannot exceed 50 characters' });
    });
  });

  describe('validateWinProbability', () => {
    it('should validate correct win probabilities', () => {
      expect(validateWinProbability('1', '10')).toEqual({ isValid: true });
      expect(validateWinProbability('3', '20')).toEqual({ isValid: true });
      expect(validateWinProbability('1', '2')).toEqual({ isValid: true });
    });

    it('should reject invalid win probabilities', () => {
      expect(validateWinProbability('0', '10')).toEqual({ isValid: false, error: 'Win probability must be greater than 0' });
      expect(validateWinProbability('1', '0')).toEqual({ isValid: false, error: 'Denominator must be greater than 0' });
      expect(validateWinProbability('11', '10')).toEqual({ isValid: false, error: 'Win probability cannot be greater than denominator' });
      expect(validateWinProbability('10', '10')).toEqual({ isValid: false, error: 'Win probability cannot be 100%' });
      expect(validateWinProbability('abc', '10')).toEqual({ isValid: false, error: 'Probability values must be valid numbers' });
    });
  });

  describe('validatePlatformFee', () => {
    it('should validate correct platform fees', () => {
      expect(validatePlatformFee('0')).toEqual({ isValid: true });
      expect(validatePlatformFee('20')).toEqual({ isValid: true });
      expect(validatePlatformFee('50')).toEqual({ isValid: true });
    });

    it('should reject invalid platform fees', () => {
      expect(validatePlatformFee('-1')).toEqual({ isValid: false, error: 'Platform fee cannot be negative' });
      expect(validatePlatformFee('51')).toEqual({ isValid: false, error: 'Platform fee cannot exceed 50%' });
      expect(validatePlatformFee('abc')).toEqual({ isValid: false, error: 'Platform fee must be a valid number' });
    });
  });

  describe('validateDuration', () => {
    it('should validate correct durations', () => {
      expect(validateDuration('')).toEqual({ isValid: true }); // Optional
      expect(validateDuration('3600')).toEqual({ isValid: true }); // 1 hour
      expect(validateDuration('86400')).toEqual({ isValid: true }); // 1 day
      expect(validateDuration('31536000')).toEqual({ isValid: true }); // 1 year
    });

    it('should reject invalid durations', () => {
      expect(validateDuration('-1')).toEqual({ isValid: false, error: 'Duration cannot be negative' });
      expect(validateDuration('31536001')).toEqual({ isValid: false, error: 'Duration cannot exceed 1 year' });
      expect(validateDuration('abc')).toEqual({ isValid: false, error: 'Duration must be a valid number' });
    });
  });

  describe('validatePoolCreation', () => {
    const validPoolData = {
      name: 'Test Pool',
      minParticipation: '0.01',
      winProbability: '1',
      winProbabilityDenominator: '10',
      platformFeePercentage: '20',
      duration: '3600',
      initialFunding: '0.1',
    };

    it('should validate correct pool creation data', () => {
      expect(validatePoolCreation(validPoolData)).toEqual({ isValid: true });
    });

    it('should reject invalid pool creation data', () => {
      expect(validatePoolCreation({ ...validPoolData, name: '' })).toEqual({
        isValid: false,
        error: 'Pool name is required',
      });

      expect(validatePoolCreation({ ...validPoolData, minParticipation: '0' })).toEqual({
        isValid: false,
        error: 'Amount must be greater than 0',
      });

      expect(validatePoolCreation({ ...validPoolData, winProbability: '11', winProbabilityDenominator: '10' })).toEqual({
        isValid: false,
        error: 'Win probability cannot be greater than denominator',
      });

      expect(validatePoolCreation({ ...validPoolData, platformFeePercentage: '60' })).toEqual({
        isValid: false,
        error: 'Platform fee cannot exceed 50%',
      });

      expect(validatePoolCreation({ ...validPoolData, initialFunding: '0' })).toEqual({
        isValid: false,
        error: 'Amount must be greater than 0',
      });
    });
  });

  describe('validateParticipation', () => {
    it('should validate correct participation amounts', () => {
      expect(validateParticipation('0.01', '1000000000000000000')).toEqual({ isValid: true }); // 0.01 ETH >= 1 ETH (in wei)
      expect(validateParticipation('1.0', '1000000000000000000')).toEqual({ isValid: true }); // 1 ETH >= 1 ETH
    });

    it('should reject invalid participation amounts', () => {
      expect(validateParticipation('0.001', '1000000000000000000')).toEqual({
        isValid: false,
        error: 'Amount must be at least 1 ETH',
      });

      expect(validateParticipation('0', '1000000000000000000')).toEqual({
        isValid: false,
        error: 'Amount must be greater than 0',
      });

      expect(validateParticipation('abc', '1000000000000000000')).toEqual({
        isValid: false,
        error: 'Amount must be a valid number',
      });
    });
  });
});
