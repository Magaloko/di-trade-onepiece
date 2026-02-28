import { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import type { CollectionState, Product, Achievement } from '@/types';
import { products } from '@/data/products';

/* ─── All achievements defined here ───────────────────────────── */
export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_card',  title: 'Erste Karte',   description: 'Deine erste Karte gesammelt!',           icon: '🃏' },
  { id: 'sammler_5',   title: 'Sammler',        description: '5 Karten in der Sammlung.',              icon: '📦' },
  { id: 'veteran_10',  title: 'Veteran',        description: '10 Karten in der Sammlung.',             icon: '⚔️' },
  { id: 'first_sec',   title: 'Erster SEC',     description: 'Eine Secret Rare ergattert!',            icon: '✨' },
  { id: 'first_manga', title: 'Erster Manga',   description: 'Eine Manga Rare in deiner Sammlung!',    icon: '📖' },
  { id: 'wishlist_5',  title: 'Wunschliste',    description: '5 Karten auf der Wunschliste.',          icon: '💛' },
  { id: 'op08_fan',    title: 'OP-08 Fan',      description: '3 Karten aus OP-08 gesammelt!',          icon: '🏴‍☠️' },
];

/* ─── Context type ─────────────────────────────────────────────── */
interface CollectionContextType {
  state: CollectionState;
  dispatch: React.Dispatch<CollectionAction>;
  addToOwned: (id: number) => void;
  moveToOwned: (id: number) => void;
  getCollectionValue: () => number;
  getCollectionStats: () => {
    totalCards: number;
    value: number;
    change: number;
    rareCards: number;
  };
  newAchievement: Achievement | null;
  clearNewAchievement: () => void;
}

/* ─── Actions ──────────────────────────────────────────────────── */
type CollectionAction =
  | { type: 'ADD_TO_OWNED'; payload: number }
  | { type: 'REMOVE_FROM_OWNED'; payload: number }
  | { type: 'ADD_TO_WISHLIST'; payload: number }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: number }
  | { type: 'MOVE_TO_OWNED'; payload: number }
  | { type: 'ADD_TO_CART'; payload: number }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<CollectionState> };

/* ─── Context + initial state ──────────────────────────────────── */
const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

const initialState: CollectionState = {
  owned: [],
  wishlist: [],
  cart: [],
  achievements: ALL_ACHIEVEMENTS,
};

/* ─── Reducer ──────────────────────────────────────────────────── */
function collectionReducer(state: CollectionState, action: CollectionAction): CollectionState {
  switch (action.type) {
    case 'ADD_TO_OWNED':
      if (state.owned.includes(action.payload)) return state;
      return { ...state, owned: [...state.owned, action.payload] };

    case 'REMOVE_FROM_OWNED':
      return { ...state, owned: state.owned.filter(id => id !== action.payload) };

    case 'ADD_TO_WISHLIST':
      if (state.wishlist.includes(action.payload)) return state;
      return { ...state, wishlist: [...state.wishlist, action.payload] };

    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter(id => id !== action.payload) };

    case 'MOVE_TO_OWNED':
      return {
        ...state,
        wishlist: state.wishlist.filter(id => id !== action.payload),
        owned: state.owned.includes(action.payload)
          ? state.owned
          : [...state.owned, action.payload],
      };

    case 'ADD_TO_CART':
      if (state.cart.includes(action.payload)) return state;
      return { ...state, cart: [...state.cart, action.payload] };

    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(id => id !== action.payload) };

    case 'UNLOCK_ACHIEVEMENT':
      if (state.achievements.some(a => a.id === action.payload && a.earnedAt)) return state;
      return {
        ...state,
        achievements: state.achievements.map(a =>
          a.id === action.payload ? { ...a, earnedAt: new Date().toISOString() } : a
        ),
      };

    case 'LOAD_FROM_STORAGE': {
      // Merge saved earnedAt values into the canonical ALL_ACHIEVEMENTS list
      const saved = (action.payload.achievements || []) as Achievement[];
      const merged = ALL_ACHIEVEMENTS.map(a => {
        const s = saved.find(x => x.id === a.id);
        return s?.earnedAt ? { ...a, earnedAt: s.earnedAt } : a;
      });
      return { ...state, ...action.payload, achievements: merged };
    }

    default:
      return state;
  }
}

/* ─── Provider ─────────────────────────────────────────────────── */
export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(collectionReducer, initialState);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('diTradeCollection');
    if (saved) {
      try {
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: JSON.parse(saved) });
      } catch { /* ignore corrupt storage */ }
    }
  }, []);

  // Persist on state change
  useEffect(() => {
    localStorage.setItem('diTradeCollection', JSON.stringify({
      owned: state.owned,
      wishlist: state.wishlist,
      cart: state.cart,
      achievements: state.achievements,
    }));
  }, [state]);

  /* Check which achievements are newly earned.
     Called with the *next* owned/wishlist arrays (before reducer updates state). */
  const checkAchievements = useCallback((nextOwned: number[], nextWishlist: number[]) => {
    const ownedProducts = nextOwned
      .map(id => products.find(p => p.id === id))
      .filter((p): p is Product => !!p);

    const checks: [string, boolean][] = [
      ['first_card',  nextOwned.length >= 1],
      ['sammler_5',   nextOwned.length >= 5],
      ['veteran_10',  nextOwned.length >= 10],
      ['first_sec',   ownedProducts.some(p => p.rarity === 'secret')],
      ['first_manga', ownedProducts.some(p => p.rarity === 'manga')],
      ['wishlist_5',  nextWishlist.length >= 5],
      ['op08_fan',    ownedProducts.filter(p => p.set.startsWith('OP-08')).length >= 3],
    ];

    checks.forEach(([id, condition]) => {
      const achievement = state.achievements.find(a => a.id === id);
      if (condition && !achievement?.earnedAt) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: id });
        const definition = ALL_ACHIEVEMENTS.find(a => a.id === id);
        if (definition) setNewAchievement(definition);
      }
    });
  }, [state.achievements]);

  /* Named helpers that also trigger achievement checks */
  const addToOwned = useCallback((id: number) => {
    dispatch({ type: 'ADD_TO_OWNED', payload: id });
    const nextOwned = state.owned.includes(id) ? state.owned : [...state.owned, id];
    checkAchievements(nextOwned, state.wishlist);
  }, [state.owned, state.wishlist, checkAchievements]);

  const moveToOwned = useCallback((id: number) => {
    dispatch({ type: 'MOVE_TO_OWNED', payload: id });
    const nextOwned = state.owned.includes(id) ? state.owned : [...state.owned, id];
    const nextWishlist = state.wishlist.filter(x => x !== id);
    checkAchievements(nextOwned, nextWishlist);
  }, [state.owned, state.wishlist, checkAchievements]);

  const clearNewAchievement = useCallback(() => setNewAchievement(null), []);

  const getCollectionValue = () => {
    return state.owned.reduce((total, id) => {
      const product = products.find(p => p.id === id);
      return total + (product?.price || 0);
    }, 0);
  };

  const getCollectionStats = () => {
    const ownedProducts = state.owned
      .map(id => products.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);
    const value = getCollectionValue();
    const oldValue = ownedProducts.reduce((sum, p) => sum + (p?.oldPrice || 0), 0);
    const change = oldValue > 0 ? ((value - oldValue) / oldValue) * 100 : 0;
    const rareCards = ownedProducts.filter(p => p?.rarity === 'secret' || p?.rarity === 'manga').length;
    return { totalCards: state.owned.length, value, change, rareCards };
  };

  return (
    <CollectionContext.Provider value={{
      state,
      dispatch,
      addToOwned,
      moveToOwned,
      getCollectionValue,
      getCollectionStats,
      newAchievement,
      clearNewAchievement,
    }}>
      {children}
    </CollectionContext.Provider>
  );
}

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (!context) throw new Error('useCollection must be used within CollectionProvider');
  return context;
};
