// Analytics utilities for tracking user interactions and performance

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean = false;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production';
  }

  track(event: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now(),
    };

    this.events.push(analyticsEvent);
    this.sendEvent(analyticsEvent);
  }

  private sendEvent(event: AnalyticsEvent) {
    // In a real implementation, this would send to your analytics service
    console.log('Analytics Event:', event);
  }

  // Track page views
  pageView(page: string, properties?: Record<string, any>) {
    this.track('page_view', {
      page,
      ...properties,
    });
  }

  // Track user interactions
  trackInteraction(action: string, element: string, properties?: Record<string, any>) {
    this.track('interaction', {
      action,
      element,
      ...properties,
    });
  }

  // Track pool creation
  trackPoolCreation(poolData: {
    name: string;
    minParticipation: string;
    winProbability: string;
    platformFeePercentage: string;
  }) {
    this.track('pool_created', {
      pool_name: poolData.name,
      min_participation: poolData.minParticipation,
      win_probability: poolData.winProbability,
      platform_fee: poolData.platformFeePercentage,
    });
  }

  // Track pool participation
  trackPoolParticipation(poolId: string, amount: string, result: 'won' | 'lost') {
    this.track('pool_participation', {
      pool_id: poolId,
      amount,
      result,
    });
  }

  // Track wallet connection
  trackWalletConnection(chainId: number, address: string) {
    this.track('wallet_connected', {
      chain_id: chainId,
      address: address.slice(0, 10) + '...', // Privacy-friendly
    });
  }

  // Track errors
  trackError(error: string, context?: string) {
    this.track('error', {
      error_message: error,
      context,
    });
  }

  // Get analytics data
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  // Clear analytics data
  clear() {
    this.events = [];
  }
}

export const analytics = new Analytics();

// Hook for React components
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    pageView: analytics.pageView.bind(analytics),
    trackInteraction: analytics.trackInteraction.bind(analytics),
    trackPoolCreation: analytics.trackPoolCreation.bind(analytics),
    trackPoolParticipation: analytics.trackPoolParticipation.bind(analytics),
    trackWalletConnection: analytics.trackWalletConnection.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
  };
};
