import Navbar from "./statics/navbar.jsx";
import Footer from "./statics/footer.jsx";
import { AlertCircle, Heart, Clock, DollarSign, Shield, Lightbulb, BookOpen, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import './css/traveltips.css';

const categories = [
  { id: 'packing', label: 'Packing', icon: '🎒' },
  { id: 'safety', label: 'Safety', icon: '🛡️' },
  { id: 'budget', label: 'Budget', icon: '💰' },
  { id: 'health', label: 'Health', icon: '💊' },
  { id: 'culture', label: 'Culture', icon: '🎭' },
  { id: 'transport', label: 'Transport', icon: '🚗' },
];

const tips = [
  {
    id: 1,
    category: 'packing',
    title: 'Essential Items for Kenya Safari',
    excerpt: 'Pack neutral-colored clothing, high SPF sunscreen, and binoculars for the best safari experience.',
    content: 'When preparing for a safari in Kenya, pack light, neutral-colored clothing that allows you to blend in with the environment. Sun protection is crucial - bring high SPF sunscreen, a wide-brimmed hat, and sunglasses. Don\'t forget lightweight layers for cool mornings and evenings. Binoculars are essential for spotting wildlife.',
    author: 'Travel Expert',
    date: '2024-04-15',
  },
  {
    id: 2,
    category: 'safety',
    title: 'Safety Tips for Nairobi',
    excerpt: 'Stay aware of your surroundings, avoid displaying valuables, and stick to well-known areas when exploring.',
    content: 'Nairobi is generally safe for tourists when you take sensible precautions. Avoid displaying expensive jewelry, cameras, or large amounts of cash. Use registered taxis or ride-sharing apps. Stick to well-known areas like the CBD, Westlands, and Karen. Travel in groups when possible, especially at night.',
    author: 'Local Guide',
    date: '2024-04-12',
  },
  {
    id: 3,
    category: 'budget',
    title: 'Budget-Friendly Dining in Kenya',
    excerpt: 'Experience authentic Kenyan cuisine at local markets and street food vendors for great value.',
    content: 'Save money on food by eating where locals eat. Visit Wakulima Market for fresh produce and prepared meals. Street food like mandazi (fried dough), samosas, and grilled corn are delicious and cheap. Local restaurants (not tourist-oriented ones) offer generous portions at reasonable prices. A meal at a typical Kenyan restaurant costs $2-5.',
    author: 'Budget Traveler',
    date: '2024-04-10',
  },
  {
    id: 4,
    category: 'health',
    title: 'Health Precautions for Kenya',
    excerpt: 'Take malaria prevention seriously, stay hydrated, and carry a basic first-aid kit.',
    content: 'Consult your doctor before traveling to get vaccinations for yellow fever, typhoid, and polio if needed. Take malaria prevention (antimalarials) seriously, especially if visiting coastal areas or Masai Mara. Stay hydrated by drinking plenty of water. Avoid tap water; stick to bottled water. Pack a basic first-aid kit with altitude sickness medication if visiting highlands.',
    author: 'Medical Expert',
    date: '2024-04-08',
  },
  {
    id: 5,
    category: 'culture',
    title: 'Understanding Kenyan Culture',
    excerpt: 'Respect local customs, greet people warmly, and learn a few Swahili phrases.',
    content: 'Kenyans are warm and hospitable. Always greet people with a handshake or "Jambo/Habari." Use right hand for eating and giving/receiving items as it\'s considered respectful. Dress modestly, especially when visiting religious sites. Ask permission before photographing people. Learn basic Swahili phrases like "Asante" (thank you) and "Karibu" (welcome).',
    author: 'Cultural Ambassador',
    date: '2024-04-05',
  },
  {
    id: 6,
    category: 'transport',
    title: 'Getting Around Kenya',
    excerpt: 'Explore Kenya by matatus, taxis, rental cars, or domestic flights based on your needs.',
    content: 'For short distances in cities, use Uber or local taxis. For longer distances between cities, matatus (shared minibuses) are cheap but crowded. Rent a car if you want flexibility (driving is on the left). Domestic flights are available between major cities. Always use official channels and agree on prices before boarding.',
    author: 'Transportation Guide',
    date: '2024-04-03',
  },
];

function TravelTips() {
  const [activeCategory, setActiveCategory] = useState('packing');
  const [expandedTip, setExpandedTip] = useState(null);

  const filteredTips = activeCategory === 'all' ? tips : tips.filter(tip => tip.category === activeCategory);

  return (
    <>
      <Navbar />

      <main className="travel-tips-page">
        {/* HERO SECTION */}
        <header className="page-header">
          <div className="container">
            <div className="hero-content">
              <Lightbulb size={48} className="hero-icon" />
              <h1>Travel Tips & Guides</h1>
              <p>Expert advice to make your Kenya trip unforgettable</p>
            </div>
          </div>
        </header>

        {/* QUICK TIPS SECTION */}
        <section className="quick-tips">
          <div className="container">
            <div className="quick-tips-grid">
              <div className="quick-tip-card">
                <AlertCircle size={32} />
                <h3>Best Time to Visit</h3>
                <p>June-October for wildlife viewing; November-March for beaches</p>
              </div>
              <div className="quick-tip-card">
                <Heart size={32} />
                <h3>What to Love</h3>
                <p>Authentic culture, incredible wildlife, and stunning landscapes</p>
              </div>
              <div className="quick-tip-card">
                <Clock size={32} />
                <h3>Time Zone</h3>
                <p>Kenya Standard Time (KST): UTC+3, No daylight saving time</p>
              </div>
              <div className="quick-tip-card">
                <DollarSign size={32} />
                <h3>Currency</h3>
                <p>Kenyan Shilling (KES): 1 USD ≈ 130-140 KES</p>
              </div>
            </div>
          </div>
        </section>

        {/* TIPS SECTION */}
        <section className="tips-section">
          <div className="container">
            <div className="tips-layout">
              {/* Category Sidebar */}
              <aside className="tips-sidebar">
                <h3>Categories</h3>
                <div className="category-list">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      <span className="cat-icon">{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </aside>

              {/* Tips List */}
              <div className="tips-content">
                <div className="tips-header">
                  <h2>{categories.find(c => c.id === activeCategory)?.label} Tips</h2>
                  <span className="tip-count">{filteredTips.length} tips</span>
                </div>

                <div className="tips-list">
                  {filteredTips.map(tip => (
                    <article key={tip.id} className="tip-card">
                      <div
                        className="tip-header"
                        onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
                      >
                        <h4>{tip.title}</h4>
                        <ChevronRight
                          size={20}
                          className={`chevron ${expandedTip === tip.id ? 'open' : ''}`}
                        />
                      </div>

                      {expandedTip === tip.id && (
                        <div className="tip-content">
                          <p>{tip.content}</p>
                          <div className="tip-footer">
                            <span className="author">By {tip.author}</span>
                            <span className="date">{new Date(tip.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}

                      {expandedTip !== tip.id && (
                        <p className="tip-excerpt">{tip.excerpt}</p>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready for Your Adventure?</h2>
              <p>Now that you have all the tips, start planning your perfect Kenya trip</p>
              <button className="cta-button">Start Planning</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default TravelTips;