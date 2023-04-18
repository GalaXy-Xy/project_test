// SEO utilities for meta tags and structured data

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export const generateSEOProps = (props: SEOProps): SEOProps => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://prize-pool-dapp.vercel.app';
  
  return {
    title: `${props.title} | Prize Pool DApp`,
    description: props.description || 'Decentralized prize pool lottery system on Ethereum Sepolia testnet',
    keywords: [
      'ethereum',
      'dapp',
      'lottery',
      'prize-pool',
      'chainlink',
      'vrf',
      'sepolia',
      'decentralized',
      'blockchain',
      ...(props.keywords || [])
    ],
    image: props.image || `${baseUrl}/og-image.png`,
    url: props.url || baseUrl,
    type: props.type || 'website',
    author: props.author || 'GalaXy Team',
    ...props,
  };
};

export const generateStructuredData = (data: {
  type: 'WebSite' | 'Organization' | 'WebPage';
  name: string;
  description: string;
  url: string;
  potentialAction?: {
    type: string;
    target: string;
    'query-input': string;
  };
}) => {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': data.type,
    name: data.name,
    description: data.description,
    url: data.url,
  };

  if (data.potentialAction) {
    return {
      ...baseStructuredData,
      potentialAction: data.potentialAction,
    };
  }

  return baseStructuredData;
};

export const generateMetaTags = (seoProps: SEOProps) => {
  const {
    title,
    description,
    keywords,
    image,
    url,
    type,
    author,
    publishedTime,
    modifiedTime,
  } = generateSEOProps(seoProps);

  return {
    title,
    description,
    keywords: keywords?.join(', '),
    openGraph: {
      title,
      description,
      type,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: 'Prize Pool DApp',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@galaxy_team',
    },
    additionalMetaTags: [
      {
        name: 'author',
        content: author,
      },
      {
        name: 'robots',
        content: 'index, follow',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...(publishedTime ? [{
        property: 'article:published_time',
        content: publishedTime,
      }] : []),
      ...(modifiedTime ? [{
        property: 'article:modified_time',
        content: modifiedTime,
      }] : []),
    ],
  };
};

export const generateSitemap = (pages: Array<{
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}>) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://prize-pool-dapp.vercel.app';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
    <url>
      <loc>${baseUrl}${page.url}</loc>
      <lastmod>${page.lastModified}</lastmod>
      <changefreq>${page.changeFrequency}</changefreq>
      <priority>${page.priority}</priority>
    </url>
  `).join('')}
</urlset>`;
};

export const generateRobotsTxt = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://prize-pool-dapp.vercel.app';
  
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and private pages
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/`;
};
