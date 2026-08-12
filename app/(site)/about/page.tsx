import '@/styles/pages/about.css';
import type { Metadata } from 'next';
import Image from 'next/image';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export const metadata: Metadata = { title: 'About' };

const STATS = [
  { value: '5000+', label: 'Happy Customers' },
  { value: '200+', label: 'Unique Designs' },
  { value: '3+', label: 'Years of Love' },
];

const VALUES = [
  {
    icon: '💎',
    title: 'Quality First',
    text: 'Every piece is made with high-quality materials, tested for durability and comfort before it reaches you.',
  },
  {
    icon: '🌸',
    title: 'Affordable Luxury',
    text: "We believe luxury shouldn't be exclusive. Our pieces are designed to feel premium without the premium price tag.",
  },
  {
    icon: '🤝',
    title: 'Customer Love',
    text: 'Our customers are our family. We go above and beyond to ensure every order is perfect and every customer is happy.',
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="page-header">
        <h1>Our Story</h1>
        <p>Born from love, built for the modern Pakistani woman 🌸</p>
      </div>

      <section className="about-story">
        <div className="about-story-img">
          <Image
            src="https://images.unsplash.com/photo-1758995115643-1e8348bfde39?w=600&q=80"
            alt="About SaasyCharms"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="about-story-text">
          <p className="section-tag"><span className="tag-icon">✦</span> About Us</p>
          <h2>We Believe Every Girl Deserves to Feel Like a <em>Charm</em></h2>
          <p>
            SaasyCharms was born from a simple idea — that beautiful jewellery shouldn&apos;t cost a
            fortune. We started in 2024 with a small collection of handcrafted pieces, and today
            we&apos;re proud to be one of Pakistan&apos;s most-loved jewellery brands.
          </p>
          <p>
            Every piece in our collection is designed with love, crafted with care, and packaged
            with a smile. From dainty rings to statement necklaces, we have something for every
            mood, every outfit, and every occasion.
          </p>
          <p>
            We&apos;re more than just a jewellery brand — we&apos;re a community of girls who love
            all things pink, pretty, and charming. ✨
          </p>
          <div className="about-stats">
            {STATS.map((stat) => (
              <div className="stat" key={stat.label}>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="section-header">
          <p className="section-tag"><span className="tag-icon">✦</span> What We Stand For</p>
          <h2>Our Values 💖</h2>
        </div>
        <div className="values-grid">
          {VALUES.map((value) => (
            <div className="value-card" key={value.title}>
              <div className="value-icon">{value.icon}</div>
              <h4>{value.title}</h4>
              <p>{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Newsletter heading="Stay Connected 💌" />
      <Footer simple />
    </>
  );
}
