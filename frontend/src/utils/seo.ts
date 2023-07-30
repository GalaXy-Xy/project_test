// SEO utilities and meta tag management

export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
}

export interface OpenGraphData {
  title: string
  description: string
  image: string
  url: string
  type: string
  siteName?: string
  locale?: string
}

export interface TwitterCardData {
  card: 'summary' | 'summary_large_image' | 'app' | 'player'
  title: string
  description: string
  image?: string
  creator?: string
  site?: string
}

class SEO {
  private defaultData: SEOData = {
    title: 'Prize Pool DApp - Decentralized Lottery System',
    description: 'Participate in fair, transparent prize pools powered by Chainlink VRF on Sepolia testnet',
    keywords: ['dapp', 'lottery', 'ethereum', 'sepolia', 'chainlink', 'vrf', 'defi'],
    image: '/og-image.png',
    url: 'https://prize-pool-dapp.vercel.app',
    type: 'website',
    author: 'GalaXy Team',
  }

  generateMetaTags(data: Partial<SEOData> = {}): string {
    const seoData = { ...this.defaultData, ...data }
    const keywords = seoData.keywords?.join(', ') || ''

    return `
      <title>${seoData.title}</title>
      <meta name="description" content="${seoData.description}" />
      <meta name="keywords" content="${keywords}" />
      <meta name="author" content="${seoData.author}" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      <!-- Open Graph -->
      <meta property="og:title" content="${seoData.title}" />
      <meta property="og:description" content="${seoData.description}" />
      <meta property="og:image" content="${seoData.image}" />
      <meta property="og:url" content="${seoData.url}" />
      <meta property="og:type" content="${seoData.type}" />
      <meta property="og:site_name" content="Prize Pool DApp" />
      <meta property="og:locale" content="en_US" />
      
      <!-- Twitter Card -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${seoData.title}" />
      <meta name="twitter:description" content="${seoData.description}" />
      <meta name="twitter:image" content="${seoData.image}" />
      <meta name="twitter:creator" content="@GalaXyTeam" />
      <meta name="twitter:site" content="@GalaXyTeam" />
      
      <!-- Additional Meta Tags -->
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Prize Pool DApp" />
      
      <!-- Canonical URL -->
      <link rel="canonical" href="${seoData.url}" />
      
      <!-- Favicon -->
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
    `.trim()
  }

  generateStructuredData(data: Partial<SEOData> = {}): string {
    const seoData = { ...this.defaultData, ...data }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: seoData.title,
      description: seoData.description,
      url: seoData.url,
      image: seoData.image,
      author: {
        '@type': 'Organization',
        name: seoData.author,
      },
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'ETH',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '150',
      },
    }

    return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`
  }

  generateSitemap(pages: Array<{ url: string; lastmod?: string; changefreq?: string; priority?: number }>): string {
    const baseUrl = 'https://prize-pool-dapp.vercel.app'
    
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    pages.forEach(page => {
      sitemap += '  <url>\n'
      sitemap += `    <loc>${baseUrl}${page.url}</loc>\n`
      if (page.lastmod) {
        sitemap += `    <lastmod>${page.lastmod}</lastmod>\n`
      }
      if (page.changefreq) {
        sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`
      }
      if (page.priority) {
        sitemap += `    <priority>${page.priority}</priority>\n`
      }
      sitemap += '  </url>\n'
    })
    
    sitemap += '</urlset>'
    
    return sitemap
  }

  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

Sitemap: https://prize-pool-dapp.vercel.app/sitemap.xml
`
  }

  // Page-specific SEO data
  getHomePageSEO(): SEOData {
    return {
      title: 'Prize Pool DApp - Decentralized Lottery System',
      description: 'Participate in fair, transparent prize pools powered by Chainlink VRF on Sepolia testnet. Create pools, win rewards, and enjoy decentralized gaming.',
      keywords: ['dapp', 'lottery', 'ethereum', 'sepolia', 'chainlink', 'vrf', 'defi', 'gaming', 'rewards'],
      type: 'website',
    }
  }

  getPoolsPageSEO(): SEOData {
    return {
      title: 'Prize Pools - Prize Pool DApp',
      description: 'Browse and participate in active prize pools. Find pools with the best odds and highest rewards on our decentralized platform.',
      keywords: ['prize pools', 'lottery', 'gaming', 'rewards', 'ethereum', 'defi'],
      type: 'website',
    }
  }

  getCreatePageSEO(): SEOData {
    return {
      title: 'Create Prize Pool - Prize Pool DApp',
      description: 'Create your own prize pool and let others participate. Set rules, choose odds, and start earning from your pool.',
      keywords: ['create pool', 'prize pool', 'lottery', 'gaming', 'ethereum', 'defi'],
      type: 'website',
    }
  }

  getProfilePageSEO(): SEOData {
    return {
      title: 'My Profile - Prize Pool DApp',
      description: 'View your participation history, track your wins, and manage your account on the Prize Pool DApp.',
      keywords: ['profile', 'history', 'wins', 'account', 'ethereum', 'defi'],
      type: 'website',
    }
  }

  getPoolDetailSEO(poolName: string, poolId: string): SEOData {
    return {
      title: `${poolName} - Prize Pool DApp`,
      description: `Participate in ${poolName} prize pool. View details, check odds, and join the lottery for a chance to win big rewards.`,
      keywords: ['prize pool', 'lottery', 'gaming', 'rewards', 'ethereum', 'defi', poolName],
      type: 'website',
      url: `https://prize-pool-dapp.vercel.app/pools/${poolId}`,
    }
  }
}

// Singleton instance
export const seo = new SEO()

// React hook for SEO
export function useSEO() {
  const updateTitle = (title: string) => {
    if (typeof document !== 'undefined') {
      document.title = title
    }
  }

  const updateMeta = (name: string, content: string) => {
    if (typeof document !== 'undefined') {
      let meta = document.querySelector(`meta[name="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }
  }

  const updateProperty = (property: string, content: string) => {
    if (typeof document !== 'undefined') {
      let meta = document.querySelector(`meta[property="${property}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }
  }

  return {
    updateTitle,
    updateMeta,
    updateProperty,
  }
}
