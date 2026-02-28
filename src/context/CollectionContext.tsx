import { createContext, useContext, useReducer, useEffect } from 'react';
import type { CollectionState, Product } from '@/types';
import { products } from '@/data/products';

interface CollectionContextType {
  state: CollectionState;
  dispatch: React.Dispatch<CollectionAction>;
  getCollectionValue: () => number;
  getCollectionStats: () => {
    totalCards: number;
    value: number;
    change: number;
    rareCards: number;
  };
}

type CollectionAction =
  | { type: 'ADD_TO_OWNED'; payload: number }
  | { type: 'REMOVE_FROM_OWNED'; payload: number }
  | { type: 'ADD_TO_WISHLIST'; payload: number }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: number }
  | { type: 'MOVE_TO_OWNED'; payload: number }
  | { type: 'ADD_TO_CART'; payload: number }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<CollectionState> };

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

const initialState: CollectionState = {
  owned: [],
  wishlist: [],
  cart: []
};

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
          : [...state.owned, action.payload]
      };
    
    case 'ADD_TO_CART':
      if (state.cart.includes(action.payload)) return state;
      return { ...state, cart: [...state.cart, action.payload] };
    
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(id => id !== action.payload) };
    
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(collectionReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem('diTradeCollection');
    if (saved) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: JSON.parse(saved) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('diTradeCollection', JSON.stringify({
      owned: state.owned,
      wishlist: state.wishlist,
      cart: state.cart
    }));
  }, [state]);

  const getCollectionValue = () => {
    return state.owned.reduce((total, id) => {
      const product = products.find(p => p.id === id);
      return total + (product?.price || 0);
    }, 0);
  };

  const getCollectionStats = () => {
    const ownedProducts = state.owned.map(id => products.find(p => p.id === id)).filter((p): p is Product => p !== undefined);
    const value = getCollectionValue();
    const oldValue = ownedProducts.reduce((sum, p) => sum + (p?.oldPrice || 0), 0);
    const change = oldValue > 0 ? ((value - oldValue) / oldValue) * 100 : 0;
    const rareCards = ownedProducts.filter(p => p?.rarity === 'secret' || p?.rarity === 'manga').length;

    return {
      totalCards: state.owned.length,
      value,
      change,
      rareCards
    };
  };

  return (
    <CollectionContext.Provider value={{ state, dispatch, getCollectionValue, getCollectionStats }}>
      {children}
    </CollectionContext.Provider>
  );
}

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (!context) throw new Error('useCollection must be used within CollectionProvider');
  return context;
};
