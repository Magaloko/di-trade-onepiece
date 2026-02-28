import type { ProductRarity } from '@/types';

export const rarityLabel: Record<ProductRarity, string> = {
  secret:      'SEC',
  manga:       'Manga',
  super:       'SR',
  alternative: 'AA',
  rare:        'R',
  uncommon:    'UC',
  common:      'C',
};

/** Tailwind classes for badge backgrounds (used in ProductCard, Collection) */
export const rarityBadgeClass: Record<ProductRarity, string> = {
  secret:      'bg-yellow-400 text-black',
  manga:       'bg-purple-900 text-white border border-yellow-400',
  super:       'bg-indigo-600 text-white',
  alternative: 'bg-yellow-500 text-black',
  rare:        'bg-red-600 text-white',
  uncommon:    'bg-green-700 text-white',
  common:      'bg-zinc-600 text-white',
};

/** Inline style objects for rarity badges (used in Home.tsx card grid) */
export const rarityStyle: Record<ProductRarity | 'default', React.CSSProperties> = {
  secret:      { background: 'linear-gradient(135deg,#ffd700,#ffed4e)', color: '#000' },
  manga:       { background: '#000', color: '#fff', border: '1px solid gold' },
  super:       { background: 'linear-gradient(135deg,#6366f1,#a5b4fc)', color: '#fff' },
  alternative: { background: 'linear-gradient(135deg,#ffd700,#f59e0b)', color: '#000' },
  rare:        { background: 'rgba(255,61,61,0.18)', color: '#ff3d3d' },
  uncommon:    { background: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  common:      { background: 'rgba(255,255,255,0.08)', color: '#e4e4e7' },
  default:     { background: 'rgba(255,255,255,0.08)', color: '#e4e4e7' },
};

/**
 * box-shadow glow strings per rarity.
 * Apply to the card wrapper on hover / flip.
 * secret  → gold glow
 * manga   → purple glow
 * super   → blue glow
 * rare    → dim red
 * rest    → none
 */
export const rarityGlow: Record<ProductRarity, string> = {
  secret:      '0 0 25px rgba(255,215,0,0.7), 0 0 50px rgba(255,215,0,0.3)',
  manga:       '0 0 25px rgba(168,85,247,0.7), 0 0 50px rgba(168,85,247,0.3)',
  super:       '0 0 20px rgba(99,102,241,0.6), 0 0 40px rgba(99,102,241,0.2)',
  alternative: '0 0 20px rgba(255,215,0,0.5), 0 0 40px rgba(255,215,0,0.2)',
  rare:        '0 0 15px rgba(255,61,61,0.4)',
  uncommon:    'none',
  common:      'none',
};

/** Gradient strings for animated card borders */
export const rarityBorderGradient: Record<ProductRarity, string> = {
  secret:      'linear-gradient(135deg, #ffd700, #ffed4e)',
  manga:       'linear-gradient(135deg, #a855f7, #ec4899)',
  super:       'linear-gradient(135deg, #6366f1, #8b5cf6)',
  alternative: 'linear-gradient(135deg, #ffd700, #f59e0b)',
  rare:        'linear-gradient(135deg, #ff3d3d, #ff6b6b)',
  uncommon:    'linear-gradient(135deg, #22c55e, #4ade80)',
  common:      'linear-gradient(135deg, #71717a, #a1a1aa)',
};
