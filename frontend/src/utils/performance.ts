// Performance monitoring and optimization utilities

export interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  apiResponseTime: number
  memoryUsage: number
  errorCount: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    renderTime: 0,
    apiResponseTime: 0,
    memoryUsage: 0,
    errorCount: 0
  }

  private startTimes: Map<string, number> = new Map()

  startTimer(label: string): void {
    this.startTimes.set(label, performance.now())
  }

  endTimer(label: string): number {
    const startTime = this.startTimes.get(label)
    if (!startTime) {
      console.warn(`Timer '${label}' was not started`)
      return 0
    }

    const duration = performance.now() - startTime
    this.startTimes.delete(label)
    return duration
  }

  measureLoadTime(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        this.metrics.loadTime = performance.now()
        this.logMetric('loadTime', this.metrics.loadTime)
      })
    }
  }

  measureRenderTime(componentName: string, renderFn: () => void): void {
    this.startTimer(`${componentName}_render`)
    renderFn()
    const renderTime = this.endTimer(`${componentName}_render`)
    this.metrics.renderTime += renderTime
    this.logMetric('renderTime', renderTime, componentName)
  }

  measureApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
    this.startTimer('api_call')
    return apiCall().then(
      (result) => {
        const responseTime = this.endTimer('api_call')
        this.metrics.apiResponseTime = responseTime
        this.logMetric('apiResponseTime', responseTime)
        return result
      },
      (error) => {
        this.endTimer('api_call')
        this.metrics.errorCount++
        this.logMetric('errorCount', this.metrics.errorCount)
        throw error
      }
    )
  }

  measureMemoryUsage(): void {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory
      this.metrics.memoryUsage = memory.usedJSHeapSize
      this.logMetric('memoryUsage', this.metrics.memoryUsage)
    }
  }

  private logMetric(metric: keyof PerformanceMetrics, value: number, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${metric}: ${value.toFixed(2)}ms${context ? ` (${context})` : ''}`)
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  resetMetrics(): void {
    this.metrics = {
      loadTime: 0,
      renderTime: 0,
      apiResponseTime: 0,
      memoryUsage: 0,
      errorCount: 0
    }
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const measureRender = (componentName: string, renderFn: () => void) => {
    performanceMonitor.measureRenderTime(componentName, renderFn)
  }

  const measureApiCall = <T>(apiCall: () => Promise<T>) => {
    return performanceMonitor.measureApiCall(apiCall)
  }

  const getMetrics = () => {
    return performanceMonitor.getMetrics()
  }

  const resetMetrics = () => {
    performanceMonitor.resetMetrics()
  }

  return {
    measureRender,
    measureApiCall,
    getMetrics,
    resetMetrics
  }
}

// Performance optimization utilities
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function memoize<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map()

  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = func(...args)
    cache.set(key, result)
    return result
  }
}

// Lazy loading utility
export function lazyLoad<T>(
  importFn: () => Promise<{ default: T }>
): Promise<T> {
  return importFn().then(module => module.default)
}

// Image optimization
export function optimizeImage(
  src: string,
  width?: number,
  height?: number,
  quality: number = 80
): string {
  if (src.startsWith('data:') || src.startsWith('blob:')) {
    return src
  }

  const url = new URL(src)
  const params = new URLSearchParams()

  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  params.set('q', quality.toString())

  return `${url.origin}${url.pathname}?${params.toString()}`
}

// Bundle size optimization
export function preloadResource(href: string, as: string): void {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    document.head.appendChild(link)
  }
}

export function prefetchResource(href: string): void {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  }
}

// Network optimization
export function createAbortController(): AbortController {
  return new AbortController()
}

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
  })

  return Promise.race([promise, timeout])
}

// Error tracking
export function trackError(error: Error, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error] ${context || 'Unknown context'}:`, error)
  }

  // In production, you would send this to an error tracking service
  // e.g., Sentry, LogRocket, etc.
}

// Performance reporting
export function reportPerformance(metrics: PerformanceMetrics): void {
  if (process.env.NODE_ENV === 'development') {
    console.table(metrics)
  }

  // In production, you would send this to an analytics service
  // e.g., Google Analytics, Mixpanel, etc.
}
