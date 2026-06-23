import Hero from '../components/home/Hero';
import FeaturedCollection from '../components/home/FeaturedCollection';
import BrandTeaser from '../components/home/BrandTeaser';
import Newsletter from '../components/home/Newsletter';

export default function Home() {
  return (
    <div style={{ marginTop: 'calc(-1 * var(--header-height))' }}>
      <Hero />
      <FeaturedCollection />
      <BrandTeaser />
      <Newsletter />
    </div>
  );
}
