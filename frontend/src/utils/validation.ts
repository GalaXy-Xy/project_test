import { ethers } from 'ethers';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEtherAmount = (amount: string): ValidationResult => {
  if (!amount || amount.trim() === '') {
    return { isValid: false, error: 'Amount is required' };
  }

  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Amount must be a valid number' };
  }

  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }

  if (numAmount > 1000) {
    return { isValid: false, error: 'Amount cannot exceed 1000 ETH' };
  }

  try {
    ethers.parseEther(amount);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid amount format' };
  }
};

export const validatePoolName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Pool name is required' };
  }

  if (name.length < 3) {
    return { isValid: false, error: 'Pool name must be at least 3 characters' };
  }

  if (name.length > 50) {
    return { isValid: false, error: 'Pool name cannot exceed 50 characters' };
  }

  return { isValid: true };
};

export const validateWinProbability = (probability: string, denominator: string): ValidationResult => {
  const prob = parseInt(probability);
  const denom = parseInt(denominator);

  if (isNaN(prob) || isNaN(denom)) {
    return { isValid: false, error: 'Probability values must be valid numbers' };
  }

  if (prob <= 0) {
    return { isValid: false, error: 'Win probability must be greater than 0' };
  }

  if (denom <= 0) {
    return { isValid: false, error: 'Denominator must be greater than 0' };
  }

  if (prob > denom) {
    return { isValid: false, error: 'Win probability cannot be greater than denominator' };
  }

  if (prob === denom) {
    return { isValid: false, error: 'Win probability cannot be 100%' };
  }

  return { isValid: true };
};

export const validatePlatformFee = (fee: string): ValidationResult => {
  const feeNum = parseInt(fee);

  if (isNaN(feeNum)) {
    return { isValid: false, error: 'Platform fee must be a valid number' };
  }

  if (feeNum < 0) {
    return { isValid: false, error: 'Platform fee cannot be negative' };
  }

  if (feeNum > 50) {
    return { isValid: false, error: 'Platform fee cannot exceed 50%' };
  }

  return { isValid: true };
};

export const validateDuration = (duration: string): ValidationResult => {
  if (!duration || duration.trim() === '') {
    return { isValid: true }; // Duration is optional
  }

  const durationNum = parseInt(duration);

  if (isNaN(durationNum)) {
    return { isValid: false, error: 'Duration must be a valid number' };
  }

  if (durationNum < 0) {
    return { isValid: false, error: 'Duration cannot be negative' };
  }

  if (durationNum > 365 * 24 * 60 * 60) { // 1 year in seconds
    return { isValid: false, error: 'Duration cannot exceed 1 year' };
  }

  return { isValid: true };
};

export const validatePoolCreation = (data: {
  name: string;
  minParticipation: string;
  winProbability: string;
  winProbabilityDenominator: string;
  platformFeePercentage: string;
  duration: string;
  initialFunding: string;
}): ValidationResult => {
  // Validate pool name
  const nameValidation = validatePoolName(data.name);
  if (!nameValidation.isValid) return nameValidation;

  // Validate minimum participation
  const minParticipationValidation = validateEtherAmount(data.minParticipation);
  if (!minParticipationValidation.isValid) return minParticipationValidation;

  // Validate win probability
  const probabilityValidation = validateWinProbability(data.winProbability, data.winProbabilityDenominator);
  if (!probabilityValidation.isValid) return probabilityValidation;

  // Validate platform fee
  const feeValidation = validatePlatformFee(data.platformFeePercentage);
  if (!feeValidation.isValid) return feeValidation;

  // Validate duration
  const durationValidation = validateDuration(data.duration);
  if (!durationValidation.isValid) return durationValidation;

  // Validate initial funding
  const fundingValidation = validateEtherAmount(data.initialFunding);
  if (!fundingValidation.isValid) return fundingValidation;

  return { isValid: true };
};

export const validateParticipation = (amount: string, minAmount: string): ValidationResult => {
  const amountValidation = validateEtherAmount(amount);
  if (!amountValidation.isValid) return amountValidation;

  const numAmount = parseFloat(amount);
  const numMinAmount = parseFloat(ethers.formatEther(minAmount));

  if (numAmount < numMinAmount) {
    return { 
      isValid: false, 
      error: `Amount must be at least ${numMinAmount} ETH` 
    };
  }

  return { isValid: true };
};
