import { GetServerSideProps } from 'next'

function generateSiteMap() {
  const baseUrl = 'https://prize-pool-dapp.vercel.app'
  
  const staticPages = [
    {
      url: '',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: '/pools',
      lastmod: new Date().toISOString(),
      changefreq: 'hourly',
      priority: '0.9'
    },
    {
      url: '/create',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/profile',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '0.7'
    }
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${staticPages
       .map(({ url, lastmod, changefreq, priority }) => {
         return `
       <url>
           <loc>${baseUrl}${url}</loc>
           <lastmod>${lastmod}</lastmod>
           <changefreq>${changefreq}</changefreq>
           <priority>${priority}</priority>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap()

  res.setHeader('Content-Type', 'text/xml')
  // we send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
