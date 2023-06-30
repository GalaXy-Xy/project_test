// Validation utilities for forms and inputs

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateEtherAmount(amount: string): ValidationResult {
  if (!amount || amount.trim() === '') {
    return { isValid: false, error: 'Amount is required' }
  }

  const numAmount = parseFloat(amount)
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Amount must be a valid number' }
  }

  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' }
  }

  if (numAmount > 1000) {
    return { isValid: false, error: 'Amount cannot exceed 1000 ETH' }
  }

  // Check for too many decimal places
  const decimalPlaces = (amount.split('.')[1] || '').length
  if (decimalPlaces > 18) {
    return { isValid: false, error: 'Amount cannot have more than 18 decimal places' }
  }

  return { isValid: true }
}

export function validatePoolName(name: string): ValidationResult {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Pool name is required' }
  }

  if (name.length < 3) {
    return { isValid: false, error: 'Pool name must be at least 3 characters' }
  }

  if (name.length > 50) {
    return { isValid: false, error: 'Pool name cannot exceed 50 characters' }
  }

  // Check for valid characters (alphanumeric, spaces, hyphens, underscores)
  const validNameRegex = /^[a-zA-Z0-9\s\-_]+$/
  if (!validNameRegex.test(name)) {
    return { isValid: false, error: 'Pool name can only contain letters, numbers, spaces, hyphens, and underscores' }
  }

  return { isValid: true }
}

export function validateWinProbability(probability: string): ValidationResult {
  if (!probability || probability.trim() === '') {
    return { isValid: false, error: 'Win probability is required' }
  }

  const numProbability = parseFloat(probability)
  
  if (isNaN(numProbability)) {
    return { isValid: false, error: 'Win probability must be a valid number' }
  }

  if (numProbability <= 0) {
    return { isValid: false, error: 'Win probability must be greater than 0%' }
  }

  if (numProbability > 100) {
    return { isValid: false, error: 'Win probability cannot exceed 100%' }
  }

  return { isValid: true }
}

export function validatePlatformFee(fee: string): ValidationResult {
  if (!fee || fee.trim() === '') {
    return { isValid: false, error: 'Platform fee is required' }
  }

  const numFee = parseFloat(fee)
  
  if (isNaN(numFee)) {
    return { isValid: false, error: 'Platform fee must be a valid number' }
  }

  if (numFee < 0) {
    return { isValid: false, error: 'Platform fee cannot be negative' }
  }

  if (numFee > 20) {
    return { isValid: false, error: 'Platform fee cannot exceed 20%' }
  }

  return { isValid: true }
}

export function validateDuration(duration: string): ValidationResult {
  if (!duration || duration.trim() === '') {
    return { isValid: false, error: 'Duration is required' }
  }

  const numDuration = parseFloat(duration)
  
  if (isNaN(numDuration)) {
    return { isValid: false, error: 'Duration must be a valid number' }
  }

  if (numDuration <= 0) {
    return { isValid: false, error: 'Duration must be greater than 0 days' }
  }

  if (numDuration > 365) {
    return { isValid: false, error: 'Duration cannot exceed 365 days' }
  }

  return { isValid: true }
}

export function validateMaxParticipants(maxParticipants: string): ValidationResult {
  if (!maxParticipants || maxParticipants.trim() === '') {
    return { isValid: false, error: 'Max participants is required' }
  }

  const numMaxParticipants = parseInt(maxParticipants)
  
  if (isNaN(numMaxParticipants)) {
    return { isValid: false, error: 'Max participants must be a valid number' }
  }

  if (numMaxParticipants <= 0) {
    return { isValid: false, error: 'Max participants must be greater than 0' }
  }

  if (numMaxParticipants > 10000) {
    return { isValid: false, error: 'Max participants cannot exceed 10,000' }
  }

  return { isValid: true }
}

export function validateMaxParticipationPerUser(maxParticipation: string): ValidationResult {
  if (!maxParticipation || maxParticipation.trim() === '') {
    return { isValid: false, error: 'Max participation per user is required' }
  }

  const numMaxParticipation = parseInt(maxParticipation)
  
  if (isNaN(numMaxParticipation)) {
    return { isValid: false, error: 'Max participation per user must be a valid number' }
  }

  if (numMaxParticipation <= 0) {
    return { isValid: false, error: 'Max participation per user must be greater than 0' }
  }

  if (numMaxParticipation > 100) {
    return { isValid: false, error: 'Max participation per user cannot exceed 100' }
  }

  return { isValid: true }
}

export function validateWalletAddress(address: string): ValidationResult {
  if (!address || address.trim() === '') {
    return { isValid: false, error: 'Wallet address is required' }
  }

  // Basic Ethereum address validation
  const addressRegex = /^0x[a-fA-F0-9]{40}$/
  if (!addressRegex.test(address)) {
    return { isValid: false, error: 'Invalid wallet address format' }
  }

  return { isValid: true }
}

export function validateFormData(data: Record<string, any>): Record<string, string> {
  const errors: Record<string, string> = {}

  // Validate each field based on its type
  Object.entries(data).forEach(([key, value]) => {
    let result: ValidationResult

    switch (key) {
      case 'name':
        result = validatePoolName(value)
        break
      case 'minParticipation':
      case 'initialFunding':
        result = validateEtherAmount(value)
        break
      case 'winProbability':
        result = validateWinProbability(value)
        break
      case 'platformFeePercent':
        result = validatePlatformFee(value)
        break
      case 'duration':
        result = validateDuration(value)
        break
      case 'maxParticipants':
        result = validateMaxParticipants(value)
        break
      case 'maxParticipationPerUser':
        result = validateMaxParticipationPerUser(value)
        break
      case 'address':
        result = validateWalletAddress(value)
        break
      default:
        return
    }

    if (!result.isValid && result.error) {
      errors[key] = result.error
    }
  })

  return errors
}

export function formatValidationErrors(errors: Record<string, string>): string {
  const errorMessages = Object.values(errors)
  return errorMessages.join('. ')
}
