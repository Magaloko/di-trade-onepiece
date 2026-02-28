import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, TrendingDown, Clock, Crown, Sparkles } from 'lucide-react';
import type { Product } from '@/types';
import { rarityLabel, rarityBadgeClass } from '@/utils/rarity';

interface FeaturedCardsSliderProps {
  products: Product[];
}

const featuredMeta: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  sale:  { icon: TrendingDown, label: 'Im Angebot',   color: '#22c55e' },
  new:   { icon: Clock,        label: 'Brandneu',     color: '#60a5fa' },
  rare:  { icon: Crown,        label: 'Extrem Selten',color: '#ffd700' },
  promo: { icon: Sparkles,     label: 'Highlight',    color: '#c084fc' },
};

export default function FeaturedCardsSlider({ products }: FeaturedCardsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPausedByHover, setIsPausedByHover] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const featuredProducts = products.filter(p => p.featured).slice(0, 5);

  const goNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % featuredProducts.length);
  }, [featuredProducts.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  }, [featuredProducts.length]);

  // Auto-play with hover-pause
  useEffect(() => {
    if (!isAutoPlaying || isPausedByHover || featuredProducts.length <= 1) return;
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isPausedByHover, featuredProducts.length, goNext]);

  // Reset progress bar key on slide change
  useEffect(() => {
    setProgressKey(k => k + 1);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { setIsAutoPlaying(false); goPrev(); }
      if (e.key === 'ArrowRight') { setIsAutoPlaying(false); goNext(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  if (featuredProducts.length === 0) return null;

  const card = featuredProducts[currentIndex];
  const meta = featuredMeta[card.featuredType || 'promo'] || featuredMeta.promo;
  const MetaIcon = meta.icon;
  const priceChange = card.oldPrice > 0
    ? ((card.price - card.oldPrice) / card.oldPrice) * 100
    : 0;
  const isOnSale = card.featuredType === 'sale';

  return (
    <section
      className="relative overflow-hidden py-16"
      onMouseEnter={() => setIsPausedByHover(true)}
      onMouseLeave={() => setIsPausedByHover(false)}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${meta.color}18 0%, transparent 70%)` }}
      />

      <div className="max-w-[1400px] mx-auto px-8 relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" style={{ color: '#ff3d3d' }} />
            <h2 className="font-orbitron font-black text-2xl" style={{ color: '#e4e4e7' }}>
              Beworbene Karten
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: '#71717a' }}>
              {currentIndex + 1} / {featuredProducts.length}
            </span>
            <button
              onClick={() => { setIsAutoPlaying(false); goPrev(); }}
              className="flex items-center justify-center w-10 h-10 rounded-xl border cursor-pointer transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: '#e4e4e7' }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setIsAutoPlaying(false); goNext(); }}
              className="flex items-center justify-center w-10 h-10 rounded-xl border cursor-pointer transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: '#e4e4e7' }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main card */}
        <div
          className="rounded-3xl overflow-hidden border"
          style={{ background: '#12121a', borderColor: `${meta.color}30` }}
        >
          {/* Progress bar */}
          {isAutoPlaying && !isPausedByHover && (
            <div className="h-0.5 w-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                key={progressKey}
                className="h-full animate-fill-progress"
                style={{ background: meta.color }}
              />
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div className="relative flex items-center justify-center" style={{ minHeight: '320px' }}>
              <div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-20 pointer-events-none"
                style={{ background: meta.color }}
              />
              <div className="relative">
                <img
                  src={card.image}
                  alt={card.name}
                  className="relative z-10 rounded-2xl shadow-2xl"
                  style={{ width: '220px', height: '308px', objectFit: 'cover' }}
                />
                <span
                  className="absolute top-3 left-3 z-20 flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: `${meta.color}25`, color: meta.color, border: `1px solid ${meta.color}40` }}
                >
                  <MetaIcon className="w-3 h-3" />
                  {meta.label}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center gap-5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${rarityBadgeClass[card.rarity] || 'bg-gray-700 text-gray-300'}`}>
                  {rarityLabel[card.rarity] || card.rarity}
                </span>
                <span className="text-sm" style={{ color: '#71717a' }}>{card.number}</span>
              </div>

              <div>
                <h3
                  className="font-orbitron font-black text-3xl md:text-4xl mb-1"
                  style={{ color: '#e4e4e7' }}
                >
                  {card.name}
                </h3>
                <p className="text-base" style={{ color: '#71717a' }}>{card.set}</p>
              </div>

              <p className="text-sm leading-relaxed" style={{ color: '#a1a1aa' }}>
                {card.description}
              </p>

              {/* Price */}
              <div>
                <p className="text-xs mb-1" style={{ color: '#71717a' }}>Aktueller Preis</p>
                <div className="flex items-end gap-3">
                  <span className="font-orbitron font-black text-4xl" style={{ color: '#ffd700' }}>
                    €{card.price.toFixed(2)}
                  </span>
                  {isOnSale && (
                    <span className="text-xl line-through pb-1" style={{ color: '#4a4a52' }}>
                      €{card.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {isOnSale && (
                  <p className="text-sm mt-1" style={{ color: '#22c55e' }}>
                    Du sparst €{(card.oldPrice - card.price).toFixed(2)} ({Math.abs(priceChange).toFixed(0)}%)
                  </p>
                )}
              </div>

              <Link
                to={`/product/${card.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white no-underline transition-all duration-300 hover:-translate-y-0.5 self-start"
                style={{ background: 'linear-gradient(135deg,#ff3d3d,#ff6b6b)', boxShadow: '0 4px 15px rgba(255,61,61,0.4)' }}
              >
                Details ansehen →
              </Link>

              {/* Thumbnails */}
              <div className="flex gap-2 pt-2">
                {featuredProducts.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => { setIsAutoPlaying(false); setCurrentIndex(idx); }}
                    className="rounded-lg overflow-hidden border-2 cursor-pointer transition-all"
                    style={{
                      width: '52px',
                      height: '72px',
                      borderColor: idx === currentIndex ? '#ff3d3d' : 'rgba(255,255,255,0.1)',
                      opacity: idx === currentIndex ? 1 : 0.5,
                    }}
                  >
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
