import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Check, TrendingUp, TrendingDown, Share2 } from 'lucide-react';
import { getProductById, products as allProducts } from '@/data/products';
import { useCollection } from '@/context/CollectionContext';
import { useToast } from '@/components/Toaster';
import { rarityLabel, rarityBadgeClass, rarityGlow } from '@/utils/rarity';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch, state, addToOwned } = useCollection();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const product = getProductById(id || '');

  if (!product) {
    return (
      <div className="pt-32 text-center" style={{ minHeight: '100vh', background: '#050508' }}>
        <p style={{ color: '#71717a' }}>Karte nicht gefunden</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-3 rounded-xl cursor-pointer border-0"
          style={{ background: '#ff3d3d', color: '#fff' }}
        >
          Zurück
        </button>
      </div>
    );
  }

  const isInWishlist = state.wishlist.includes(product.id);
  const isOwned = state.owned.includes(product.id);
  const priceChange = product.oldPrice > 0
    ? ((product.price - product.oldPrice) / product.oldPrice) * 100
    : 0;
  const isPriceUp = priceChange >= 0;
  const glow = rarityGlow[product.rarity] || 'none';

  // Related cards (same set, different id)
  const relatedCards = allProducts
    .filter(p => p.set === product.set && p.id !== product.id)
    .slice(0, 4);

  // Mock chart data
  const chartData = [
    { day: 'Tag 1', price: product.stats.low },
    { day: 'Tag 7', price: product.stats.low + (product.stats.avg - product.stats.low) * 0.4 },
    { day: 'Tag 14', price: product.stats.avg },
    { day: 'Tag 21', price: product.stats.avg * 0.95 },
    { day: 'Tag 30', price: product.price },
  ];

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link in Zwischenablage kopiert!', 'success');
    } catch {
      showToast('Link konnte nicht kopiert werden', 'error');
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_TO_CART', payload: product.id });
    }
    showToast(`${quantity}x ${product.name} zum Warenkorb hinzugefügt`, 'success');
  };

  const statusBadge = product.trend === 'up'
    ? { label: '↑ Steigend', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' }
    : product.trend === 'down'
    ? { label: '↓ Fallend', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' }
    : { label: '~ Stabil', color: '#71717a', bg: 'rgba(255,255,255,0.05)' };

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh', background: '#050508' }}>
      <div className="max-w-[1400px] mx-auto px-8 pb-16">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 cursor-pointer border-0 bg-transparent text-sm transition-colors"
          style={{ color: '#71717a' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#e4e4e7')}
          onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}
        >
          <ArrowLeft className="w-4 h-4" /> Zurück
        </button>

        <div className="grid lg:grid-cols-2 gap-16">

          {/* ── Image ─────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-6">
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                boxShadow: glow !== 'none' ? glow : '0 25px 60px rgba(0,0,0,0.6)',
                border: '2px solid rgba(255,255,255,0.08)',
                maxWidth: '360px',
                width: '100%',
                aspectRatio: '2.5/3.5',
              }}
            >
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {/* Status badges row */}
            <div className="flex gap-2 flex-wrap justify-center">
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ background: statusBadge.bg, color: statusBadge.color }}
              >
                {statusBadge.label}
              </span>
              {isOwned && (
                <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                  ✓ In deiner Sammlung
                </span>
              )}
              {isInWishlist && (
                <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,215,0,0.1)', color: '#ffd700' }}>
                  💛 Auf Wunschliste
                </span>
              )}
              {product.featured && (
                <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(168,85,247,0.1)', color: '#c084fc' }}>
                  ✨ Featured
                </span>
              )}
            </div>
          </div>

          {/* ── Info ──────────────────────────────────────────── */}
          <div className="space-y-8">

            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${rarityBadgeClass[product.rarity] || 'bg-gray-700 text-gray-300'}`}>
                  {rarityLabel[product.rarity] || product.rarity}
                </span>
                <span className="text-sm" style={{ color: '#71717a' }}>{product.number}</span>
                <span className="text-sm" style={{ color: '#71717a' }}>· {product.type}</span>
              </div>
              <h1 className="font-orbitron font-black text-4xl lg:text-5xl mb-3" style={{ color: '#e4e4e7' }}>
                {product.name}
              </h1>
              <p className="text-lg" style={{ color: '#71717a' }}>{product.set}</p>
            </div>

            <p className="leading-relaxed" style={{ color: '#a1a1aa' }}>{product.description}</p>

            {/* Price box */}
            <div
              className="rounded-2xl p-6 border"
              style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.07)' }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm mb-1" style={{ color: '#71717a' }}>Aktueller Marktpreis</p>
                  <span className="font-orbitron font-black text-5xl" style={{ color: '#ffd700' }}>
                    €{product.price.toFixed(2)}
                  </span>
                </div>
                <span
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold"
                  style={isPriceUp ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e' } : { background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                >
                  {isPriceUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(priceChange).toFixed(1)}%
                </span>
              </div>

              <div
                className="grid grid-cols-3 gap-4 pt-5 border-t"
                style={{ borderColor: 'rgba(255,255,255,0.07)' }}
              >
                {[
                  { label: '30T Hoch', value: `€${product.stats.high}`, color: '#22c55e' },
                  { label: '30T Tief', value: `€${product.stats.low}`, color: '#ef4444' },
                  { label: 'Ø Preis', value: `€${product.stats.avg}`, color: '#e4e4e7' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="font-bold text-xl" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs mt-1" style={{ color: '#71717a' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm" style={{ color: '#71717a' }}>Menge:</span>
              <div className="flex items-center rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center cursor-pointer border-0 text-lg transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#e4e4e7' }}
                >
                  −
                </button>
                <span className="w-12 text-center font-bold" style={{ color: '#e4e4e7' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(10, q + 1))}
                  className="w-10 h-10 flex items-center justify-center cursor-pointer border-0 text-lg transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#e4e4e7' }}
                >
                  +
                </button>
              </div>
              <span className="text-sm font-bold" style={{ color: '#ffd700' }}>
                = €{(product.price * quantity).toFixed(2)}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 flex-wrap">
              {!isOwned ? (
                <button
                  onClick={() => { addToOwned(product.id); showToast(`${product.name} zur Sammlung hinzugefügt`, 'success'); }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold cursor-pointer border-0 transition-all"
                  style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
                >
                  <Check className="w-5 h-5" /> Zur Sammlung
                </button>
              ) : (
                <span
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
                  style={{ background: 'rgba(34,197,94,0.08)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}
                >
                  <Check className="w-5 h-5" /> In Sammlung
                </span>
              )}

              <button
                onClick={() => dispatch({ type: isInWishlist ? 'REMOVE_FROM_WISHLIST' : 'ADD_TO_WISHLIST', payload: product.id })}
                className="flex items-center justify-center w-12 h-12 rounded-xl cursor-pointer border-0 transition-all"
                style={isInWishlist ? { background: '#ff3d3d', color: '#fff' } : { background: 'rgba(255,255,255,0.05)', color: '#e4e4e7', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-white' : ''}`} />
              </button>

              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold cursor-pointer border-0 flex-1 justify-center transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg,#ff3d3d,#ff6b6b)', color: '#fff', boxShadow: '0 4px 15px rgba(255,61,61,0.4)' }}
              >
                <ShoppingCart className="w-5 h-5" />
                In den Warenkorb
              </button>

              <button
                onClick={handleShare}
                className="flex items-center justify-center w-12 h-12 rounded-xl cursor-pointer border-0 transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#71717a', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Attributes */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Power', value: product.attributes.power?.toLocaleString() ?? '—' },
                { label: 'Farbe', value: product.attributes.color ?? '—' },
                { label: 'Kosten', value: product.attributes.cost ?? '—' },
              ].map(attr => (
                <div
                  key={attr.label}
                  className="text-center rounded-xl p-4 border"
                  style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.07)' }}
                >
                  <p className="text-xs mb-1" style={{ color: '#71717a' }}>{attr.label}</p>
                  <p className="font-orbitron font-black text-xl" style={{ color: '#e4e4e7' }}>{attr.value}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#e4e4e7' }}>
                <TrendingUp className="w-5 h-5" style={{ color: '#ff3d3d' }} />
                Preisverlauf (30 Tage)
              </h3>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="day" stroke="#4a4a52" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4a4a52" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `€${v}`} />
                    <Tooltip
                      contentStyle={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#ffd700' }}
                      labelStyle={{ color: '#71717a' }}
                    />
                    <Line
                      type="monotone" dataKey="price" stroke="#ff3d3d" strokeWidth={3}
                      dot={{ fill: '#ff3d3d', r: 4 }} activeDot={{ r: 6, fill: '#ffd700' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Cards ─────────────────────────────────────── */}
        {relatedCards.length > 0 && (
          <div className="mt-20">
            <h2 className="font-orbitron font-bold text-2xl mb-6" style={{ color: '#e4e4e7' }}>
              Weitere Karten aus {product.set.split(':')[0]}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedCards.map(p => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="no-underline group"
                >
                  <div
                    className="relative rounded-2xl overflow-hidden border transition-all duration-300 group-hover:-translate-y-1"
                    style={{ aspectRatio: '2.5/3.5', background: '#12121a', borderColor: 'rgba(255,255,255,0.07)' }}
                  >
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${rarityBadgeClass[p.rarity] || 'bg-gray-700 text-gray-300'}`}>
                      {rarityLabel[p.rarity] || p.rarity}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.9),transparent)' }}>
                      <p className="text-xs font-bold truncate" style={{ color: '#ffd700' }}>€{p.price.toFixed(2)}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: '#a1a1aa' }}>{p.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
