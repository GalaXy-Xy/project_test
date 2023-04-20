import { GetServerSideProps } from 'next';
import { generateSitemap } from '@/utils/seo';

const Sitemap = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const pages = [
    {
      url: '/',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: '/pools',
      lastModified: new Date().toISOString(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: '/create',
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: '/profile',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
  ];

  const sitemap = generateSitemap(pages);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
