import { Link } from "react-router-dom";

export default function Home() {
  const blogPosts = [
    {
      id: 1,
      title: "Why recycled fabrics matter in sportswear",
      excerpt:
        "Discover how recycled performance materials reduce waste while still delivering comfort, stretch, and durability.",
      tag: "Sustainability",
    },
    {
      id: 2,
      title: "How to build a cleaner activewear wardrobe",
      excerpt:
        "A simple guide to choosing versatile training essentials that last longer and support responsible production.",
      tag: "Style Guide",
    },
    {
      id: 3,
      title: "Performance meets planet-friendly design",
      excerpt:
        "Learn how EcoWear combines breathable construction, athletic comfort, and low-impact manufacturing.",
      tag: "Eco Innovation",
    },
  ];

  return (
    <div className="home-page">
      <section className="home-hero">
        <div>
          <span className="home-badge">Eco-friendly sportswear</span>

          <h1 className="home-title">
            Train harder. Leave a lighter footprint.
          </h1>

          <p className="home-text">
            Premium activewear made with recycled, organic, and low-impact
            materials. Built for performance, designed for the planet.
          </p>

          <div className="home-actions">
            <Link to="/shop" className="btn-primary">
              Shop now
            </Link>

            <Link to="/profile" className="btn-secondary">
              My profile
            </Link>
          </div>

          <div className="feature-grid">
            <FeatureCard
              icon="♻️"
              title="Recycled materials"
              text="Performance fabrics with lower environmental impact."
            />
            <FeatureCard
              icon="🌱"
              title="Low-impact dyes"
              text="Cleaner finishes with a more responsible process."
            />
            <FeatureCard
              icon="📦"
              title="Plastic-free packaging"
              text="Minimal, recyclable packaging for every order."
            />
          </div>
        </div>

        <div>
          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
              alt="Eco sportswear hero"
            />

            <div className="hero-overlay">
              <div>
                <h3>New drop</h3>
                <p>Organic hoodie collection</p>
              </div>

              <span className="hero-tag">Sustainable</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-info">
        <h2>Why EcoWear?</h2>
        <p className="home-info-intro">
          Performance-driven essentials with a cleaner design philosophy.
        </p>

        <div className="info-grid">
          <InfoBlock
            title="Built for movement"
            text="Breathable fits and training-ready silhouettes that support everyday performance."
          />
          <InfoBlock
            title="Designed to last"
            text="Clean construction and durable materials that stay in rotation longer."
          />
          <InfoBlock
            title="Made responsibly"
            text="A better balance between modern style, athletic comfort, and sustainability."
          />
        </div>
      </section>

      <section className="home-blog">
        <div className="home-blog-head">
          <div>
            <span className="home-badge">From the journal</span>
            <h2 className="home-blog-title">Latest stories</h2>
            <p className="home-info-intro">
              Ideas, inspiration, and sustainability insights from the EcoWear world.
            </p>
          </div>

          <Link to="/shop" className="btn-secondary">
            Explore collection
          </Link>
        </div>

        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <span className="blog-tag">{post.tag}</span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <a href="#" className="blog-link">
                Read more →
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer-grid">
          <div>
            <h3>EcoWear Sports</h3>
            <p>
              Premium eco-friendly sportswear designed for performance,
              comfort, and a more responsible future.
            </p>
          </div>

          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link to="/shop">All Products</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/profile">My Account</Link></li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Sustainability</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4>Newsletter</h4>
            <p>Get updates on new drops, eco stories, and exclusive launches.</p>
            <div className="footer-newsletter">
              <input type="email" placeholder="Enter your email" />
              <button>Join</button>
            </div>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>© 2026 EcoWear Sports. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="feature-card">
      <div style={{ fontSize: "24px", marginBottom: "10px" }}>{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function InfoBlock({ title, text }) {
  return (
    <div className="info-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}