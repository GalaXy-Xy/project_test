import { GetServerSideProps } from 'next';
import { generateRobotsTxt } from '@/utils/seo';

const RobotsTxt = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const robotsTxt = generateRobotsTxt();

  res.setHeader('Content-Type', 'text/plain');
  res.write(robotsTxt);
  res.end();

  return {
    props: {},
  };
};

export default RobotsTxt;
