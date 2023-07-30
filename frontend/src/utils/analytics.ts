// Analytics and tracking utilities

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: number
}

export interface UserProperties {
  walletAddress?: string
  networkId?: number
  userAgent?: string
  language?: string
}

class Analytics {
  private events: AnalyticsEvent[] = []
  private userProperties: UserProperties = {}
  private isEnabled: boolean = true

  constructor() {
    this.initialize()
  }

  private initialize(): void {
    if (typeof window !== 'undefined') {
      this.userProperties = {
        userAgent: navigator.userAgent,
        language: navigator.language,
      }
    }
  }

  setUserProperties(properties: UserProperties): void {
    this.userProperties = { ...this.userProperties, ...properties }
  }

  track(eventName: string, properties?: Record<string, any>): void {
    if (!this.isEnabled) return

    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        ...this.userProperties,
      },
      timestamp: Date.now(),
    }

    this.events.push(event)

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(event)
    } else {
      console.log('[Analytics]', event)
    }
  }

  private sendToAnalytics(event: AnalyticsEvent): void {
    // In production, send to your analytics service
    // e.g., Google Analytics, Mixpanel, Amplitude, etc.
    
    // Example for Google Analytics 4
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', event.name, event.properties)
    }

    // Example for Mixpanel
    if (typeof window !== 'undefined' && 'mixpanel' in window) {
      (window as any).mixpanel.track(event.name, event.properties)
    }
  }

  pageView(pageName: string, properties?: Record<string, any>): void {
    this.track('page_view', {
      page_name: pageName,
      ...properties,
    })
  }

  userAction(action: string, properties?: Record<string, any>): void {
    this.track('user_action', {
      action,
      ...properties,
    })
  }

  error(error: Error, context?: string): void {
    this.track('error', {
      error_message: error.message,
      error_stack: error.stack,
      context,
    })
  }

  performance(metric: string, value: number, unit: string = 'ms'): void {
    this.track('performance', {
      metric,
      value,
      unit,
    })
  }

  businessEvent(eventName: string, value?: number, currency?: string): void {
    this.track('business_event', {
      event_name: eventName,
      value,
      currency,
    })
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  clearEvents(): void {
    this.events = []
  }

  enable(): void {
    this.isEnabled = true
  }

  disable(): void {
    this.isEnabled = false
  }
}

// Singleton instance
export const analytics = new Analytics()

// React hook for analytics
export function useAnalytics() {
  const track = (eventName: string, properties?: Record<string, any>) => {
    analytics.track(eventName, properties)
  }

  const pageView = (pageName: string, properties?: Record<string, any>) => {
    analytics.pageView(pageName, properties)
  }

  const userAction = (action: string, properties?: Record<string, any>) => {
    analytics.userAction(action, properties)
  }

  const error = (error: Error, context?: string) => {
    analytics.error(error, context)
  }

  const performance = (metric: string, value: number, unit?: string) => {
    analytics.performance(metric, value, unit)
  }

  const businessEvent = (eventName: string, value?: number, currency?: string) => {
    analytics.businessEvent(eventName, value, currency)
  }

  return {
    track,
    pageView,
    userAction,
    error,
    performance,
    businessEvent,
  }
}

// Predefined analytics events
export const ANALYTICS_EVENTS = {
  // Page views
  PAGE_VIEW: 'page_view',
  HOME_PAGE_VIEW: 'home_page_view',
  POOLS_PAGE_VIEW: 'pools_page_view',
  CREATE_PAGE_VIEW: 'create_page_view',
  PROFILE_PAGE_VIEW: 'profile_page_view',
  POOL_DETAIL_VIEW: 'pool_detail_view',

  // User actions
  WALLET_CONNECT: 'wallet_connect',
  WALLET_DISCONNECT: 'wallet_disconnect',
  POOL_CREATE: 'pool_create',
  POOL_PARTICIPATE: 'pool_participate',
  POOL_VIEW_DETAILS: 'pool_view_details',
  SEARCH_POOLS: 'search_pools',
  FILTER_POOLS: 'filter_pools',

  // Business events
  POOL_CREATED: 'pool_created',
  PARTICIPATION_SUCCESS: 'participation_success',
  PARTICIPATION_FAILED: 'participation_failed',
  WINNER_SELECTED: 'winner_selected',
  REWARD_CLAIMED: 'reward_claimed',

  // Errors
  TRANSACTION_FAILED: 'transaction_failed',
  CONTRACT_ERROR: 'contract_error',
  NETWORK_ERROR: 'network_error',
  VALIDATION_ERROR: 'validation_error',

  // Performance
  PAGE_LOAD_TIME: 'page_load_time',
  API_RESPONSE_TIME: 'api_response_time',
  TRANSACTION_CONFIRMATION_TIME: 'transaction_confirmation_time',
} as const

// Analytics decorators
export function withAnalytics<T extends (...args: any[]) => any>(
  fn: T,
  eventName: string,
  getProperties?: (...args: Parameters<T>) => Record<string, any>
): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args)
      
      // Track success
      analytics.track(eventName, {
        success: true,
        ...(getProperties ? getProperties(...args) : {}),
      })

      return result
    } catch (error) {
      // Track error
      analytics.track(eventName, {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        ...(getProperties ? getProperties(...args) : {}),
      })

      throw error
    }
  }) as T
}

// Performance tracking decorator
export function withPerformanceTracking<T extends (...args: any[]) => any>(
  fn: T,
  metricName: string
): T {
  return ((...args: Parameters<T>) => {
    const startTime = performance.now()
    
    try {
      const result = fn(...args)
      const endTime = performance.now()
      
      analytics.performance(metricName, endTime - startTime)
      
      return result
    } catch (error) {
      const endTime = performance.now()
      
      analytics.performance(metricName, endTime - startTime)
      analytics.error(error instanceof Error ? error : new Error('Unknown error'), metricName)
      
      throw error
    }
  }) as T
}
