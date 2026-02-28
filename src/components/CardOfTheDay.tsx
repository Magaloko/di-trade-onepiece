import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { rarityLabel, rarityGlow } from '@/utils/rarity';

interface Props {
  products: Product[];
}

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0]; // e.g. "2026-02-28"
}

function getCardOfTheDay(products: Product[]): Product | null {
  if (products.length === 0) return null;

  const todayKey = getTodayKey();
  const storageKey = 'diTrade_cotd';

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const { date, id } = JSON.parse(saved);
      if (date === todayKey) {
        const found = products.find(p => p.id === id);
        if (found) return found;
      }
    }
  } catch { /* ignore */ }

  // Pick a new card — prefer secret/manga rarity
  const preferred = products.filter(p => p.rarity === 'secret' || p.rarity === 'manga');
  const pool = preferred.length > 0 ? preferred : products;

  // Deterministic "random" based on date so all users see same card
  const dateSum = todayKey.replace(/-/g, '').split('').reduce((s, c) => s + parseInt(c, 10), 0);
  const card = pool[dateSum % pool.length];

  try {
    localStorage.setItem(storageKey, JSON.stringify({ date: todayKey, id: card.id }));
  } catch { /* ignore */ }

  return card;
}

export default function CardOfTheDay({ products }: Props) {
  const card = useMemo(() => getCardOfTheDay(products), [products]);

  if (!card) return null;

  const glow = rarityGlow[card.rarity] || 'none';
  const label = rarityLabel[card.rarity] || card.rarity;
  const trend = card.trend === 'up' ? '+' : card.trend === 'down' ? '-' : '~';
  const trendColor = card.trend === 'up' ? '#22c55e' : card.trend === 'down' ? '#ef4444' : '#71717a';

  return (
    <section className="mb-16">
      <div
        className="rounded-3xl p-8 border relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(18,18,26,0.9) 0%, rgba(30,20,5,0.9) 100%)',
          borderColor: 'rgba(255,215,0,0.2)',
          boxShadow: '0 0 60px rgba(255,215,0,0.08)',
        }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(255,215,0,0.3) 0%, transparent 70%)' }}
        />

        {/* Badge */}
        <div className="flex items-center gap-2 mb-6">
          <span
            className="animate-pulse-glow text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-2"
            style={{ background: 'rgba(255,215,0,0.15)', color: '#ffd700', border: '1px solid rgba(255,215,0,0.3)' }}
          >
            ⭐ Tageskarte
          </span>
          <span className="text-sm" style={{ color: '#71717a' }}>Täglich neu</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          {/* Card image */}
          <div className="flex-shrink-0 relative">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                boxShadow: glow !== 'none' ? glow : '0 8px 32px rgba(0,0,0,0.4)',
                border: '2px solid rgba(255,215,0,0.3)',
              }}
            >
              <img
                src={card.image}
                alt={card.name}
                style={{ width: '140px', height: '196px', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Rarity badge */}
            <span
              className="absolute -top-2 -right-2 text-xs font-bold px-2 py-1 rounded-full"
              style={{ background: '#ffd700', color: '#0a0a0f' }}
            >
              {label}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3
              className="font-orbitron font-black text-2xl md:text-3xl mb-2"
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {card.name}
            </h3>
            <p className="text-sm mb-4" style={{ color: '#71717a' }}>
              {card.number} · {card.set}
            </p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#a1a1aa', maxWidth: '480px' }}>
              {card.description}
            </p>

            {/* Price row */}
            <div className="flex items-center gap-6 mb-6">
              <div>
                <p className="text-xs mb-1" style={{ color: '#71717a' }}>Aktueller Preis</p>
                <p className="font-orbitron font-black text-2xl" style={{ color: '#ffd700' }}>
                  €{card.price.toFixed(2)}
                </p>
              </div>
              {card.stats && (
                <>
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#71717a' }}>24h Hoch</p>
                    <p className="font-semibold" style={{ color: '#22c55e' }}>€{card.stats.high}</p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#71717a' }}>24h Tief</p>
                    <p className="font-semibold" style={{ color: '#ef4444' }}>€{card.stats.low}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-xs mb-1" style={{ color: '#71717a' }}>Trend</p>
                <p className="font-bold" style={{ color: trendColor }}>
                  {trend} {card.trend === 'up' ? 'Steigend' : card.trend === 'down' ? 'Fallend' : 'Stabil'}
                </p>
              </div>
            </div>

            <Link
              to={`/product/${card.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white no-underline transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                color: '#0a0a0f',
                boxShadow: '0 4px 15px rgba(255,215,0,0.3)',
              }}
            >
              Details ansehen →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
