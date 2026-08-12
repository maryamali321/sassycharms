import '@/styles/pages/home.css';
import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

const CATEGORIES = [
  { name: 'Rings', count: '12 Products', image: 'https://images.unsplash.com/photo-1567523977592-7959bc5df51e?w=400&q=80' },
  { name: 'Necklaces', count: '18 Products', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80' },
  { name: 'Earrings', count: '9 Products', image: 'https://images.unsplash.com/photo-1765560172744-dcc030763771?w=400&q=80' },
  { name: 'Bracelets', count: '14 Products', image: 'https://images.unsplash.com/photo-1611598935678-c88dca238fce?w=400&q=80' },
];

const STATS = [
  { value: '5000+', label: 'Happy Customers' },
  { value: '200+', label: 'Unique Designs' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '3+', label: 'Years of Love' },
];

const TRUST_BADGES = [
  { icon: 'fa-truck-fast', title: 'Free Shipping', text: 'On all orders across Pakistan' },
  { icon: 'fa-shield-halved', title: 'Secure Payment', text: 'Cash on Delivery, fully protected' },
  { icon: 'fa-headset', title: '24/7 Support', text: "We're here for you, always" },
];

const WHY_US = [
  { icon: '💎', title: 'Premium Quality', text: 'Each piece is carefully crafted using high-quality materials that last.' },
  { icon: '🎁', title: 'Beautiful Packaging', text: 'Every order comes in our signature pink gift box, ready to gift.' },
  { icon: '🚚', title: 'Fast Delivery', text: 'Quick and secure shipping all across Pakistan.' },
  { icon: '💖', title: 'Made With Love', text: 'Every charm is designed with passion for the modern Pakistani woman.' },
];

const TESTIMONIALS = [
  {
    initial: 'A',
    name: 'Aiza Khan, Lahore',
    text: '"Absolutely obsessed with my rose gold ring! The quality is amazing and the packaging was SO pretty. Will definitely order again 💕"',
  },
  {
    initial: 'S',
    name: 'Sara Malik, Karachi',
    text: '"I gifted the pearl necklace to my sister and she LOVED it. Delivery was fast and everything was perfect. SaasyCharms is my go-to!"',
  },
  {
    initial: 'M',
    name: 'Mahnoor, Islamabad',
    text: '"The earrings are even more beautiful in person! Lightweight and dainty, exactly what I was looking for. 10/10 recommend 🌸"',
  },
];

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(4);

  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <p className="hero-tag"><span className="tag-icon">✦</span> New Collection 2026</p>
          <h1>
            Wear Your <em>Charm</em>,<br />
            Own Your Story
          </h1>
          <p className="hero-sub">
            Delicate, handcrafted jewellery made for the modern woman who loves all things pink & pretty.
          </p>
          <div className="hero-btns">
            <Link href="/shop" className="btn-primary">Shop Now <i className="fas fa-arrow-right" /></Link>
            <Link href="/about" className="btn-outline">Our Story</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-img-circle">
            <Image
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&q=80"
              alt="Jewellery"
              fill
              sizes="400px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          <div className="floating-badge badge1">✦ Handcrafted</div>
          <div className="floating-badge badge2">💖 New Arrivals</div>
        </div>
      </section>

      <div className="marquee-strip">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} style={{ display: 'contents' }}>
              <span>✦ Rings</span>
              <span>✦ Necklaces</span>
              <span>✦ Earrings</span>
              <span>✦ Bracelets</span>
              <span>✦ Anklets</span>
              <span>✦ Charms</span>
            </span>
          ))}
        </div>
      </div>

      <section className="trust-badges">
        <div className="trust-grid">
          {TRUST_BADGES.map((item) => (
            <div className="trust-card" key={item.title}>
              <div className="trust-icon">
                <i className={`fas ${item.icon}`} />
              </div>
              <div className="trust-text">
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section categories" id="shop">
        <div className="section-header">
          <p className="section-tag"><span className="tag-icon">✦</span> Browse By</p>
          <h2>Our Collections</h2>
          <p className="section-sub">Handpicked pieces sorted into the categories our customers love most.</p>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((category) => (
            <div className="cat-card" key={category.name}>
              <div className="cat-img">
                <Image src={category.image} alt={category.name} fill sizes="(max-width: 768px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
              </div>
              <span className="cat-sparkle">✦</span>
              <div className="cat-card-content">
                <h3>{category.name}</h3>
                <p className="cat-count">{category.count}</p>
                <Link href="/shop">
                  Explore <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section featured-products">
        <div className="section-header">
          <p className="section-tag"><span className="tag-icon">✦</span> Handpicked For You</p>
          <h2>Bestsellers</h2>
          <p className="section-sub">The pieces our customers keep coming back for, crafted with premium finishes.</p>
        </div>
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className="center-btn">
          <Link href="/shop" className="btn-primary">View All Products</Link>
        </div>
      </section>

      <section className="stats-strip">
        <div className="stats-grid">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="promo-banner">
        <div className="promo-content">
          <p className="section-tag section-tag-light"><span className="tag-icon">✦</span> Limited Time</p>
          <h2>Get 10% Off Your First Order 💖</h2>
          <p>Use code <strong>SAASY10</strong> at checkout</p>
          <Link href="/shop" className="btn-white">Shop Now</Link>
        </div>
      </section>

      <section className="section why-us">
        <div className="section-header">
          <p className="section-tag"><span className="tag-icon">✦</span> Why SaasyCharms</p>
          <h2>Made With Love ♡</h2>
        </div>
        <div className="why-grid">
          {WHY_US.map((item) => (
            <div className="why-card" key={item.title}>
              <div className="why-icon">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section testimonials">
        <div className="section-header">
          <p className="section-tag"><span className="tag-icon">✦</span> Customer Love</p>
          <h2>What Our Girls Say ✨</h2>
        </div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((testimonial) => (
            <div className="testi-card" key={testimonial.name}>
              <div className="stars">★★★★★</div>
              <p>{testimonial.text}</p>
              <div className="testi-author">
                <div className="testi-avatar">{testimonial.initial}</div>
                <span>{testimonial.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="final-cta-wrap">
        <div className="final-cta">
          <p className="section-tag"><span className="tag-icon">✦</span> Special Offer</p>
          <h2>Ready to Find Your Perfect Piece at SaasyCharms?</h2>
          <p>
            Join thousands of happy customers across Pakistan who trust SaasyCharms for delicate,
            affordable jewellery. Start your journey to elegance today.
          </p>
          <div className="final-cta-btns">
            <Link href="/shop" className="btn-primary">Start Shopping <i className="fas fa-arrow-right" /></Link>
            <Link href="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </>
  );
}
