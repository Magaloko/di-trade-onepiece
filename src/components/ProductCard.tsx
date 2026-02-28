import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react';
import { useCollection } from '@/context/CollectionContext';
import { useToast } from '@/components/Toaster';
import type { Product } from '@/types';
import { rarityLabel, rarityBadgeClass, rarityGlow } from '@/utils/rarity';

interface ProductCardProps {
  product: Product;
  showFeaturedBadge?: boolean;
}

const featuredBadgeStyle: Record<string, { bg: string; color: string }> = {
  sale:  { bg: 'rgba(34,197,94,0.15)',  color: '#22c55e' },
  new:   { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  rare:  { bg: 'rgba(255,215,0,0.15)',  color: '#ffd700' },
  promo: { bg: 'rgba(168,85,247,0.15)', color: '#c084fc' },
};

const featuredBadgeLabels: Record<string, string> = {
  sale: 'Angebot', new: 'Neu', rare: 'Selten', promo: 'Promo',
};

export default function ProductCard({ product, showFeaturedBadge = false }: ProductCardProps) {
  const { state, dispatch, addToOwned } = useCollection();
  const { showToast } = useToast();
  const [isFlipped, setIsFlipped] = useState(false);

  const isInWishlist = state.wishlist.includes(product.id);
  const isOwned = state.owned.includes(product.id);
  const priceChange = product.oldPrice > 0
    ? ((product.price - product.oldPrice) / product.oldPrice) * 100
    : 0;
  const isPriceUp = priceChange >= 0;
  const glow = rarityGlow[product.rarity] || 'none';
  const badgeClass = rarityBadgeClass[product.rarity] || 'bg-gray-700 text-gray-300';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_CART', payload: product.id });
    showToast(`${product.name} zum Warenkorb hinzugefügt`, 'success');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: isInWishlist ? 'REMOVE_FROM_WISHLIST' : 'ADD_TO_WISHLIST',
      payload: product.id,
    });
  };

  const handleAddOwned = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToOwned(product.id);
    showToast(`${product.name} zur Sammlung hinzugefügt`, 'success');
  };

  return (
    <div
      style={{ perspective: '1000px', cursor: 'pointer' }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          aspectRatio: '2.5 / 3.5',
        }}
      >
        {/* ── FRONT ───────────────────────────────────────────── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            boxShadow: isFlipped ? 'none' : glow !== 'none' ? glow : '0 4px 16px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.07)',
            background: '#12121a',
          }}
        >
          <Link to={`/product/${product.id}`} className="block w-full h-full no-underline">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </Link>

          {/* Owned badge */}
          {isOwned && (
            <span
              className="absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(34,197,94,0.85)', color: '#fff' }}
            >
              ✓ Vorhanden
            </span>
          )}

          {/* Rarity badge */}
          <span
            className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${badgeClass}`}
          >
            {rarityLabel[product.rarity] || product.rarity}
          </span>

          {/* Featured badge */}
          {showFeaturedBadge && product.featured && product.featuredType && (
            <span
              className="absolute top-10 right-3 text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                background: featuredBadgeStyle[product.featuredType]?.bg || 'rgba(255,255,255,0.1)',
                color: featuredBadgeStyle[product.featuredType]?.color || '#e4e4e7',
              }}
            >
              {featuredBadgeLabels[product.featuredType]}
            </span>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute bottom-3 right-3 flex items-center justify-center w-8 h-8 rounded-full cursor-pointer border-0 transition-all"
            style={{
              background: isInWishlist ? '#ff3d3d' : 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-white text-white' : 'text-white'}`} />
          </button>
        </div>

        {/* ── BACK ────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(160deg, #12121a 0%, #1a1225 100%)',
            border: glow !== 'none' ? `1px solid rgba(255,215,0,0.2)` : '1px solid rgba(255,255,255,0.1)',
            boxShadow: glow !== 'none' ? glow : '0 4px 24px rgba(0,0,0,0.5)',
          }}
        >
          {/* Card name header */}
          <div
            className="px-4 pt-4 pb-2 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <p className="font-orbitron font-black text-sm leading-tight" style={{ color: '#e4e4e7' }}>
              {product.name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#71717a' }}>
              {product.number} · {product.type}
            </p>
          </div>

          {/* Stats */}
          <div className="flex-1 px-4 py-3 space-y-2">
            {product.attributes && (
              <>
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#71717a' }}>Power</span>
                  <span className="font-bold" style={{ color: '#e4e4e7' }}>{product.attributes.power?.toLocaleString() ?? '—'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#71717a' }}>Cost</span>
                  <span className="font-bold" style={{ color: '#e4e4e7' }}>{product.attributes.cost ?? '—'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#71717a' }}>Farbe</span>
                  <span className="font-bold" style={{ color: '#e4e4e7' }}>{product.attributes.color ?? '—'}</span>
                </div>
              </>
            )}
            {product.stats && (
              <>
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#71717a' }}>24h Hoch</span>
                  <span className="font-bold" style={{ color: '#22c55e' }}>€{product.stats.high}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#71717a' }}>24h Tief</span>
                  <span className="font-bold" style={{ color: '#ef4444' }}>€{product.stats.low}</span>
                </div>
              </>
            )}
          </div>

          {/* Price + Trend */}
          <div
            className="px-4 py-3 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="font-orbitron font-black text-lg" style={{ color: '#ffd700' }}>
                €{product.price.toFixed(2)}
              </span>
              <span
                className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: isPriceUp ? '#22c55e' : '#ef4444' }}
              >
                {isPriceUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(priceChange).toFixed(1)}%
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddOwned}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-0 transition-all"
                style={{ background: isOwned ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)', color: isOwned ? '#22c55e' : '#e4e4e7' }}
              >
                {isOwned ? '✓ Owned' : '+ Sammlung'}
              </button>
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer border-0 transition-all"
                style={{ background: 'rgba(255,61,61,0.15)', color: '#ff3d3d' }}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </button>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="block text-center text-xs mt-2 no-underline font-semibold"
              style={{ color: '#71717a' }}
            >
              Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
