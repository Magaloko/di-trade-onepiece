import { useState, useMemo, useEffect, useRef } from 'react';
// useRef is used in StatsBar and scroll observer
import { Link } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';
import { sets } from '@/data/sets';
import type { TcgSet } from '@/types';

/* ─── Helpers ───────────────────────────────────────────────── */
const rarityLabel: Record<string, string> = {
  secret: 'SEC',
  manga: 'Manga',
  super: 'SR',
  alternative: 'AA',
  rare: 'R',
  uncommon: 'UC',
  common: 'C',
  leader: 'L',
};

const rarityStyle: Record<string, React.CSSProperties> = {
  secret: { background: 'linear-gradient(135deg,#ffd700,#ffed4e)', color: '#000' },
  manga: { background: '#000', color: '#fff', border: '1px solid gold' },
  super: { background: 'linear-gradient(135deg,#ffd700,#ffed4e)', color: '#000' },
  alternative: { background: 'linear-gradient(135deg,#ffd700,#ffed4e)', color: '#000' },
  rare: { background: 'rgba(255,61,61,0.15)', color: '#ff3d3d' },
  leader: { background: 'rgba(255,255,255,0.1)', color: '#fff' },
  default: { background: 'rgba(255,255,255,0.08)', color: '#e4e4e7' },
};

const tagStyleMap: Record<string, React.CSSProperties> = {
  primary: { background: 'rgba(255,61,61,0.1)', color: '#ff3d3d' },
  gold: { background: 'rgba(255,215,0,0.1)', color: '#ffd700' },
  muted: { background: 'rgba(255,255,255,0.08)', color: '#71717a' },
  white: { background: 'rgba(255,255,255,0.08)', color: '#e4e4e7' },
};

/* ─── SetCard component ──────────────────────────────────────── */
function SetCard({ set }: { set: TcgSet }) {
  return (
    <div
      className="rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer group"
      style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.05)' }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,61,61,0.3)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.05)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div
        className="relative h-48 overflow-hidden"
        style={{ background: set.bgGradient }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl"
          style={{ opacity: 0.2 }}
        >
          {set.emoji}
        </div>
        <span
          className="absolute bottom-4 left-6 font-orbitron font-bold text-2xl"
          style={{ color: 'rgba(255,255,255,0.9)' }}
        >
          {set.code}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex gap-3 mb-3 flex-wrap">
          {set.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={tagStyleMap[tag.style] || tagStyleMap.muted}
            >
              {tag.label}
            </span>
          ))}
        </div>
        <h3 className="font-bold text-lg mb-2" style={{ color: '#e4e4e7' }}>
          {set.code}: {set.name}
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: '#71717a' }}>
          {set.description}
        </p>
        <div
          className="flex justify-between pt-4 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: '#ffd700' }}>{set.cardCount}</div>
            <div className="text-xs" style={{ color: '#71717a' }}>Karten</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: '#ffd700' }}>{set.specialCount}</div>
            <div className="text-xs" style={{ color: '#71717a' }}>{set.specialLabel}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: '#ffd700' }}>ab {set.boxPrice}€</div>
            <div className="text-xs" style={{ color: '#71717a' }}>Booster Box</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Counter hook ───────────────────────────────────────────── */
function useCountUp(target: number, duration = 2000, triggered = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setValue(target);
        clearInterval(interval);
      } else {
        setValue(Math.ceil(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [triggered, target, duration]);
  return value;
}

/* ─── Stats Bar ─────────────────────────────────────────────── */
function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) { setTriggered(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const cards = useCountUp(15000, 2000, triggered);
  const setStat = useCountUp(24, 1500, triggered);
  const collectors = useCountUp(3500, 2000, triggered);
  const availability = useCountUp(99, 1200, triggered);

  const stats = [
    { value: cards.toLocaleString('de-DE'), label: 'Karten im Katalog' },
    { value: setStat.toString(), label: 'Verschiedene Sets' },
    { value: collectors.toLocaleString('de-DE'), label: 'Aktive Sammler' },
    { value: `${availability}%`, label: 'Verfügbarkeit' },
  ];

  return (
    <div ref={ref} className="border-t border-b" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.05)', padding: '2rem 0' }}>
      <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="text-center py-4">
            <span className="block font-orbitron font-black text-4xl" style={{ color: '#ff3d3d' }}>
              {s.value}
            </span>
            <span className="text-sm mt-2 block" style={{ color: '#71717a' }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Home Page ─────────────────────────────────────────── */
const filters = [
  { id: 'all', label: 'Alle' },
  { id: 'leader', label: 'Leader' },
  { id: 'character', label: 'Characters' },
  { id: 'event', label: 'Events' },
  { id: 'stage', label: 'Stages' },
  { id: 'secret', label: 'Secret Rare' },
  { id: 'alternative', label: 'Alternative Art' },
  { id: 'manga', label: 'Manga Rare' },
];

export default function Home() {
  const { products } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);

  // Scroll fade-in observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.scroll-fade').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.set.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        activeFilter === 'all' ||
        product.rarity === activeFilter ||
        product.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter, products]);

  const featuredSets = sets.filter(s => s.inStock).slice(0, 3);

  return (
    <div style={{ paddingTop: '80px', background: '#050508', minHeight: '100vh' }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{ minHeight: '90vh' }}
      >
        {/* Background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(255,61,61,0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255,215,0,0.10) 0%, transparent 50%)
            `,
          }}
        />

        <div className="max-w-[1400px] mx-auto px-8 w-full py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-pulse-glow"
              style={{
                background: 'rgba(255,61,61,0.1)',
                border: '1px solid rgba(255,61,61,0.3)',
                color: '#ff3d3d',
              }}
            >
              <i className="fas fa-bolt" />
              OP-08 Jetzt verfügbar
            </div>

            <h1
              className="font-orbitron font-black leading-tight mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              <span
                style={{
                  background: 'linear-gradient(135deg, #fff 0%, #a1a1aa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                ONE PIECE
              </span>
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #ff3d3d 0%, #ff6b6b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                TCG Paradise
              </span>
            </h1>

            <p className="text-lg leading-relaxed mb-8 max-w-[560px]" style={{ color: '#71717a' }}>
              Die ultimative Destination für One Piece Card Game Sammler. Von der aktuellen OP-08 bis zu seltenen
              Promo-Karten – komplett mit Preis-Tracking, Sammlerverwaltung und Community-Features.
            </p>

            <div className="flex gap-4 flex-wrap">
              <a
                href="#sets"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white no-underline transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg,#ff3d3d 0%,#ff6b6b 100%)',
                  boxShadow: '0 4px 15px rgba(255,61,61,0.4)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 25px rgba(255,61,61,0.6)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 15px rgba(255,61,61,0.4)'; }}
              >
                <i className="fas fa-compass" />
                Sets entdecken
              </a>
              <a
                href="#database"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold no-underline transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e4e4e7',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                <i className="fas fa-database" />
                Karten-DB
              </a>
            </div>
          </div>

          {/* Card Showcase */}
          <div className="hidden lg:flex justify-center items-center h-[600px]">
            <div className="relative animate-float" style={{ width: 300, height: 420, transformStyle: 'preserve-3d' }}>
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg,#ff3d3d,#ff6b6b)',
                  filter: 'blur(30px)',
                  opacity: 0.5,
                  transform: 'translateZ(-50px)',
                }}
              />
              {/* Card Frame */}
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)',
                  border: '2px solid rgba(255,215,0,0.3)',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
                }}
              >
                {/* Shine animation */}
                <div
                  className="absolute animate-shine"
                  style={{
                    top: '-50%', left: '-50%',
                    width: '200%', height: '200%',
                    background: 'linear-gradient(45deg,transparent 30%,rgba(255,255,255,0.1) 50%,transparent 70%)',
                    transform: 'rotate(45deg)',
                  }}
                />
                {/* ONE PIECE text */}
                <span
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-orbitron font-black text-3xl text-center w-full"
                  style={{ color: 'rgba(255,215,0,0.1)' }}
                >
                  ONE PIECE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <StatsBar />

      {/* ── FEATURED SETS ────────────────────────────────────── */}
      <section id="sets" className="max-w-[1400px] mx-auto px-8 py-24">
        <div className="scroll-fade flex justify-between items-end mb-12">
          <div>
            <h2 className="font-orbitron font-bold text-4xl mb-2" style={{ color: '#e4e4e7' }}>
              Aktuelle Sets
            </h2>
            <p style={{ color: '#71717a', fontSize: '1.1rem' }}>
              Die neuesten One Piece TCG Releases und Reprints
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold no-underline transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e4e4e7',
            }}
          >
            Alle Sets <i className="fas fa-arrow-right" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {featuredSets.map(set => (
            <div key={set.id} className="scroll-fade">
              <SetCard set={set} />
            </div>
          ))}
        </div>
      </section>

      {/* ── CARD DATABASE ─────────────────────────────────────── */}
      <section
        id="database"
        className="max-w-[1400px] mx-auto px-8 mb-16 rounded-3xl relative overflow-hidden py-16"
        style={{ background: '#12121a' }}
      >
        {/* Decorative glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-50%', right: '-10%',
            width: 500, height: 500,
            background: 'radial-gradient(circle,rgba(255,61,61,0.1) 0%,transparent 70%)',
          }}
        />

        <div className="scroll-fade flex justify-between items-end mb-8">
          <div>
            <h2 className="font-orbitron font-bold text-3xl mb-1" style={{ color: '#e4e4e7' }}>
              Karten-Datenbank
            </h2>
            <p style={{ color: '#71717a' }}>Durchsuche über 15.000 Karten mit Filter und Preisvergleich</p>
          </div>
        </div>

        {/* Search */}
        <div
          className="scroll-fade flex items-center gap-4 rounded-2xl px-6 py-4 mb-6 max-w-2xl"
          style={{ background: '#050508', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <i className="fas fa-search" style={{ color: '#71717a' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Suche nach Kartenname, Nummer oder Charakter..."
            className="bg-transparent border-0 outline-none text-base w-full"
            style={{ color: '#e4e4e7' }}
          />
        </div>

        {/* Filters */}
        <div className="scroll-fade flex gap-3 mb-8 flex-wrap">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => { setActiveFilter(f.id); setVisibleCount(6); }}
              className="px-4 py-2 rounded-xl text-sm font-medium border cursor-pointer transition-all duration-300"
              style={
                activeFilter === f.id
                  ? { background: '#ff3d3d', borderColor: '#ff3d3d', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: '#e4e4e7' }
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredProducts.slice(0, visibleCount).map(product => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="no-underline group"
            >
              <div
                className="relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300"
                style={{
                  aspectRatio: '2.5/3.5',
                  background: 'linear-gradient(135deg,#1e1e2e 0%,#2d2d44 100%)',
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-10px) rotateY(5deg)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#ffd700';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'none';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover absolute inset-0"
                    style={{ opacity: 0.6 }}
                  />
                )}
                {/* Rarity badge */}
                <span
                  className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold z-10"
                  style={rarityStyle[product.rarity] || rarityStyle.default}
                >
                  {rarityLabel[product.rarity] || product.rarity.toUpperCase()}
                </span>
                {/* Price */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-3 z-10"
                  style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.9),transparent)' }}
                >
                  <div className="text-sm font-bold truncate" style={{ color: '#ffd700' }}>
                    € {product.price.toFixed(2)}
                  </div>
                  <div className="text-xs truncate mt-0.5" style={{ color: '#a1a1aa' }}>
                    {product.name}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16" style={{ color: '#71717a' }}>
            <i className="fas fa-search text-4xl mb-4 block opacity-30" />
            Keine Karten gefunden.
          </div>
        )}

        {/* Load more */}
        {visibleCount < filteredProducts.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount(v => v + 6)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white cursor-pointer border-0 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg,#ff3d3d,#ff6b6b)',
                boxShadow: '0 4px 15px rgba(255,61,61,0.4)',
              }}
            >
              Mehr laden <i className="fas fa-chevron-down" />
            </button>
          </div>
        )}
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-8 py-24">
        <div className="scroll-fade text-center mb-16">
          <h2 className="font-orbitron font-bold text-4xl mb-3" style={{ color: '#e4e4e7' }}>
            Warum Di-Trade?
          </h2>
          <p style={{ color: '#71717a', fontSize: '1.1rem' }}>
            Die Premium-Plattform für ernsthafte Sammler
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: 'fas fa-shield-alt',
              title: '100% Authentisch',
              text: 'Alle Karten werden von unseren Experten auf Echtheit geprüft. Garantiert keine Fakes oder Reproduktionen.',
            },
            {
              icon: 'fas fa-chart-line',
              title: 'Preis-Tracking',
              text: 'Verfolge den Wert deiner Sammlung in Echtzeit. Historische Preisdaten für alle Karten verfügbar.',
            },
            {
              icon: 'fas fa-graduation-cap',
              title: 'PSA Grading Service',
              text: 'Wir übernehmen den kompletten Grading-Prozess für PSA, CGC oder Beckett. Inklusive Versicherung.',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="scroll-fade text-center p-10 rounded-2xl border transition-all duration-300 cursor-default"
              style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.05)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,61,61,0.3)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              <div
                className="w-[70px] h-[70px] rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl text-white"
                style={{ background: 'linear-gradient(135deg,#ff3d3d 0%,#ff6b6b 100%)' }}
              >
                <i className={f.icon} />
              </div>
              <h3 className="font-bold text-xl mb-3" style={{ color: '#e4e4e7' }}>{f.title}</h3>
              <p style={{ color: '#71717a', lineHeight: 1.7 }}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section
        className="max-w-[1400px] mx-auto px-8 mb-24 rounded-3xl py-20 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#ff3d3d 0%,#ff6b6b 100%)' }}
      >
        {/* dot pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle,rgba(255,255,255,0.1) 1px,transparent 1px)',
            backgroundSize: '20px 20px',
            opacity: 0.3,
          }}
        />
        <h2 className="font-orbitron font-black text-5xl mb-4 relative" style={{ color: '#fff' }}>
          Bereit für den nächsten Pull?
        </h2>
        <p className="text-xl opacity-90 mb-8 relative" style={{ color: '#fff' }}>
          Melde dich an und erhalte 10% Rabatt auf deine erste Bestellung plus exklusive Early Access auf neue Sets.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold no-underline transition-all duration-300 hover:-translate-y-0.5 relative"
          style={{ background: '#fff', color: '#ff3d3d' }}
        >
          <i className="fas fa-user-plus" />
          Kostenlos registrieren
        </Link>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer
        className="border-t mt-24 py-16"
        style={{ background: '#0a0a0f', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-16 mb-12">
          {/* Brand */}
          <div>
            <span
              className="font-orbitron font-black text-2xl block mb-4"
              style={{
                background: 'linear-gradient(135deg,#ff3d3d,#ff6b6b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              DI-TRADE
            </span>
            <p className="leading-relaxed mb-6 text-sm" style={{ color: '#71717a' }}>
              Dein Fachhandel für One Piece TCG, Disney Lorcana und weitere Trading Card Games. Seit 2020 für Sammler da.
            </p>
            <div className="flex gap-3">
              {['fab fa-discord', 'fab fa-instagram', 'fab fa-twitter', 'fab fa-youtube'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl flex items-center justify-center no-underline transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#e4e4e7' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#ff3d3d'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'; }}
                >
                  <i className={icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold mb-6" style={{ color: '#fff' }}>Shop</h4>
            <ul className="list-none space-y-3">
              {['One Piece TCG', 'Disney Lorcana', 'Dragon Ball', 'Yu-Gi-Oh!', 'Zubehör'].map(item => (
                <li key={item}>
                  <a href="#" className="no-underline text-sm transition-colors duration-200" style={{ color: '#71717a' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#ff3d3d'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#71717a'; }}
                  >{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div>
            <h4 className="font-bold mb-6" style={{ color: '#fff' }}>Service</h4>
            <ul className="list-none space-y-3">
              {['PSA Grading', 'Preisverzeichnis', 'Sammlungs-Manager', 'Wishlist', 'Verkaufen'].map(item => (
                <li key={item}>
                  <a href="#" className="no-underline text-sm transition-colors duration-200" style={{ color: '#71717a' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#ff3d3d'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#71717a'; }}
                  >{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-6" style={{ color: '#fff' }}>Rechtliches</h4>
            <ul className="list-none space-y-3">
              {['Impressum', 'Datenschutz', 'AGB', 'Versand', 'Kontakt'].map(item => (
                <li key={item}>
                  <a href="#" className="no-underline text-sm transition-colors duration-200" style={{ color: '#71717a' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#ff3d3d'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#71717a'; }}
                  >{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="max-w-[1400px] mx-auto px-8 pt-8 border-t text-center text-sm"
          style={{ borderColor: 'rgba(255,255,255,0.05)', color: '#71717a' }}
        >
          <p>&copy; 2024 Di-Trade. Alle Rechte vorbehalten. One Piece &copy; E. Oda/Shueisha, Bandai.</p>
        </div>
      </footer>
    </div>
  );
}
