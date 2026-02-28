import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, DollarSign, TrendingUp, Star, Trash2, Check, Trophy, ArrowUpDown } from 'lucide-react';
import { products as allProducts } from '@/data/products';
import { useCollection } from '@/context/CollectionContext';
import { ALL_ACHIEVEMENTS } from '@/context/CollectionContext';
import SetProgress from '@/components/SetProgress';
import { rarityLabel, rarityBadgeClass } from '@/utils/rarity';
import type { Product } from '@/types';

type SortKey = 'name' | 'price_asc' | 'price_desc' | 'rarity';

const rarityOrder: Record<string, number> = {
  manga: 0, secret: 1, super: 2, alternative: 3, rare: 4, uncommon: 5, common: 6, leader: 7,
};

function sortProducts(list: Product[], key: SortKey): Product[] {
  return [...list].sort((a, b) => {
    switch (key) {
      case 'price_desc': return b.price - a.price;
      case 'price_asc': return a.price - b.price;
      case 'rarity': return (rarityOrder[a.rarity] ?? 99) - (rarityOrder[b.rarity] ?? 99);
      case 'name': default: return a.name.localeCompare(b.name);
    }
  });
}

/* ── Circular SVG ring ───────────────────────────────────────── */
function Ring({ pct, color, size = 80 }: { pct: number; color: string; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <svg width={size} height={size} className="block -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={6} stroke="rgba(255,255,255,0.06)" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={6}
        stroke={color}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  );
}

export default function Collection() {
  const { state, dispatch, getCollectionStats, moveToOwned } = useCollection();
  const [activeTab, setActiveTab] = useState<'owned' | 'wishlist' | 'achievements' | 'sets'>('owned');
  const [sortKey, setSortKey] = useState<SortKey>('rarity');

  const stats = getCollectionStats();

  const ownedProducts = useMemo(
    () => sortProducts(state.owned.map(id => allProducts.find(p => p.id === id)).filter(Boolean) as Product[], sortKey),
    [state.owned, sortKey]
  );
  const wishlistProducts = useMemo(
    () => sortProducts(state.wishlist.map(id => allProducts.find(p => p.id === id)).filter(Boolean) as Product[], sortKey),
    [state.wishlist, sortKey]
  );

  // Set completion per set code
  const setGroups = useMemo(() => {
    const groups: Record<string, { total: number; owned: number; name: string }> = {};
    allProducts.forEach(p => {
      const code = p.set.split(':')[0].trim();
      if (!groups[code]) groups[code] = { total: 0, owned: 0, name: p.set };
      groups[code].total++;
      if (state.owned.includes(p.id)) groups[code].owned++;
    });
    return Object.entries(groups).map(([code, data]) => ({ code, ...data }));
  }, [state.owned]);

  const earnedAchievements = ALL_ACHIEVEMENTS.filter(a => a.earnedAt);
  const totalValue = ownedProducts.reduce((sum, p) => sum + p.price, 0);

  const tabs = [
    { id: 'owned', label: `Sammlung (${state.owned.length})` },
    { id: 'wishlist', label: `Wunschliste (${state.wishlist.length})` },
    { id: 'sets', label: 'Set-Fortschritt' },
    { id: 'achievements', label: `Achievements (${earnedAchievements.length}/${ALL_ACHIEVEMENTS.length})` },
  ] as const;

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'rarity', label: 'Seltenheit' },
    { key: 'price_desc', label: 'Preis ↓' },
    { key: 'price_asc', label: 'Preis ↑' },
    { key: 'name', label: 'Name' },
  ];

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh', background: '#050508' }}>
      <div className="max-w-[1400px] mx-auto px-8 pb-16">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="font-orbitron font-black text-4xl mb-1" style={{ color: '#e4e4e7' }}>
              Meine Sammlung
            </h1>
            <p style={{ color: '#71717a' }}>Verwalte deine Karten und tracke den Wert</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold no-underline transition-all"
            style={{ background: 'linear-gradient(135deg,#ff3d3d,#ff6b6b)', color: '#fff', boxShadow: '0 4px 15px rgba(255,61,61,0.3)' }}
          >
            + Karten entdecken
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Package, label: 'Karten', value: stats.totalCards, color: '#60a5fa', ring: Math.min(stats.totalCards * 10, 100) },
            { icon: DollarSign, label: 'Marktwert', value: `€${totalValue.toFixed(0)}`, color: '#22c55e', ring: Math.min(totalValue / 100, 100) },
            { icon: TrendingUp, label: '30 Tage Trend', value: `${stats.change >= 0 ? '+' : ''}${stats.change.toFixed(1)}%`, color: stats.change >= 0 ? '#22c55e' : '#ef4444', ring: 65 },
            { icon: Star, label: 'Secret / Manga', value: stats.rareCards, color: '#ffd700', ring: Math.min(stats.rareCards * 20, 100) },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 flex items-center gap-4 border"
              style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div className="relative flex-shrink-0">
                <Ring pct={s.ring} color={s.color} size={72} />
                <s.icon className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: '#71717a' }}>{s.label}</p>
                <p className="font-orbitron font-black text-2xl" style={{ color: s.color }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 rounded-2xl border w-fit" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-0 transition-all"
              style={
                activeTab === tab.id
                  ? { background: '#ff3d3d', color: '#fff' }
                  : { background: 'transparent', color: '#71717a' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort bar (for owned/wishlist) */}
        {(activeTab === 'owned' || activeTab === 'wishlist') && (
          <div className="flex items-center gap-2 mb-6">
            <ArrowUpDown className="w-4 h-4" style={{ color: '#71717a' }} />
            <span className="text-sm" style={{ color: '#71717a' }}>Sortieren:</span>
            {sortOptions.map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortKey(opt.key)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-0 transition-all"
                style={
                  sortKey === opt.key
                    ? { background: 'rgba(255,61,61,0.2)', color: '#ff3d3d' }
                    : { background: 'rgba(255,255,255,0.05)', color: '#71717a' }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* ── OWNED ─────────────────────────────────────────────── */}
        {activeTab === 'owned' && (
          <>
            {ownedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {ownedProducts.map(product => (
                  <div
                    key={product.id}
                    className="group relative rounded-2xl overflow-hidden border"
                    style={{ aspectRatio: '2.5/3.5', background: '#12121a', borderColor: 'rgba(255,255,255,0.07)' }}
                  >
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />

                    {/* Rarity badge */}
                    <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${rarityBadgeClass[product.rarity] || 'bg-gray-700 text-gray-300'}`}>
                      {rarityLabel[product.rarity] || product.rarity}
                    </span>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2"
                      style={{ background: 'rgba(0,0,0,0.75)' }}>
                      <Link
                        to={`/product/${product.id}`}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg no-underline"
                        style={{ background: 'rgba(255,255,255,0.1)', color: '#e4e4e7' }}
                      >
                        Details →
                      </Link>
                      <button
                        onClick={() => dispatch({ type: 'REMOVE_FROM_OWNED', payload: product.id })}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg cursor-pointer border-0"
                        style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
                      >
                        <Trash2 className="w-3 h-3" /> Entfernen
                      </button>
                    </div>

                    {/* Price bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-3"
                      style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.9),transparent)' }}>
                      <p className="font-semibold text-sm truncate" style={{ color: '#ffd700' }}>€{product.price.toFixed(2)}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: '#a1a1aa' }}>{product.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">🃏</div>
                <h3 className="font-orbitron font-bold text-xl mb-2" style={{ color: '#e4e4e7' }}>Noch keine Karten</h3>
                <p className="mb-6" style={{ color: '#71717a' }}>Füge deine erste Karte hinzu und schalte Achievements frei!</p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold no-underline"
                  style={{ background: 'linear-gradient(135deg,#ff3d3d,#ff6b6b)', color: '#fff' }}
                >
                  Karten entdecken →
                </Link>
              </div>
            )}
          </>
        )}

        {/* ── WISHLIST ──────────────────────────────────────────── */}
        {activeTab === 'wishlist' && (
          <>
            {wishlistProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {wishlistProducts.map(product => (
                  <div
                    key={product.id}
                    className="group relative rounded-2xl overflow-hidden border"
                    style={{ aspectRatio: '2.5/3.5', background: '#12121a', borderColor: 'rgba(255,255,255,0.07)' }}
                  >
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />

                    <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${rarityBadgeClass[product.rarity] || 'bg-gray-700 text-gray-300'}`}>
                      {rarityLabel[product.rarity] || product.rarity}
                    </span>

                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2"
                      style={{ background: 'rgba(0,0,0,0.75)' }}>
                      <button
                        onClick={() => moveToOwned(product.id)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg cursor-pointer border-0"
                        style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}
                      >
                        <Check className="w-3 h-3" /> Zur Sammlung
                      </button>
                      <button
                        onClick={() => dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id })}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg cursor-pointer border-0"
                        style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
                      >
                        <Trash2 className="w-3 h-3" /> Entfernen
                      </button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-3"
                      style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.9),transparent)' }}>
                      <p className="font-semibold text-sm truncate" style={{ color: '#ffd700' }}>€{product.price.toFixed(2)}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: '#a1a1aa' }}>{product.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">💛</div>
                <h3 className="font-orbitron font-bold text-xl mb-2" style={{ color: '#e4e4e7' }}>Wunschliste leer</h3>
                <p className="mb-6" style={{ color: '#71717a' }}>Merke Karten vor und behalte den Überblick.</p>
                <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold no-underline"
                  style={{ background: 'rgba(255,215,0,0.15)', color: '#ffd700', border: '1px solid rgba(255,215,0,0.3)' }}>
                  Karten durchsuchen →
                </Link>
              </div>
            )}
          </>
        )}

        {/* ── SET PROGRESS ──────────────────────────────────────── */}
        {activeTab === 'sets' && (
          <div className="space-y-3 max-w-2xl">
            {setGroups.map(sg => (
              <SetProgress key={sg.code} setCode={sg.code} setName={sg.name.split(':')[1]?.trim() || sg.name} owned={sg.owned} total={sg.total} />
            ))}
          </div>
        )}

        {/* ── ACHIEVEMENTS ─────────────────────────────────────── */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_ACHIEVEMENTS.map(a => {
              const earned = !!a.earnedAt;
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-4 p-5 rounded-2xl border transition-all"
                  style={{
                    background: earned ? 'rgba(255,215,0,0.05)' : 'rgba(255,255,255,0.02)',
                    borderColor: earned ? 'rgba(255,215,0,0.25)' : 'rgba(255,255,255,0.06)',
                    opacity: earned ? 1 : 0.5,
                  }}
                >
                  <div
                    className="flex items-center justify-center w-14 h-14 rounded-xl text-2xl flex-shrink-0"
                    style={{
                      background: earned ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)',
                      border: earned ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {earned ? a.icon : <Trophy className="w-6 h-6" style={{ color: '#4a4a52' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: earned ? '#ffd700' : '#4a4a52' }}>
                      {a.title}
                    </p>
                    <p className="text-xs leading-snug mt-0.5" style={{ color: earned ? '#a1a1aa' : '#3a3a42' }}>
                      {a.description}
                    </p>
                    {earned && a.earnedAt && (
                      <p className="text-xs mt-1" style={{ color: '#71717a' }}>
                        {new Date(a.earnedAt).toLocaleDateString('de-DE')}
                      </p>
                    )}
                  </div>
                  {earned && (
                    <span className="text-lg">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
