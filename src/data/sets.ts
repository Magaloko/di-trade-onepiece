import type { TcgSet } from '@/types';

export const sets: TcgSet[] = [
  {
    id: 1,
    code: 'OP-08',
    name: 'Wings of Captain',
    emoji: '🏴‍☠️',
    bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
    tags: [
      { label: 'Neu', style: 'primary' },
      { label: 'Booster Box', style: 'gold' },
    ],
    description: 'Die neue Erweiterung mit Fokus auf die Flügel der Piratenkönige – Marco, Ben Beckman & mehr.',
    cardCount: 121,
    specialCount: 12,
    specialLabel: 'Secrets',
    boxPrice: 89,
    inStock: true,
  },
  {
    id: 2,
    code: 'OP-07',
    name: '500 Years in the Future',
    emoji: '👑',
    bgGradient: 'linear-gradient(135deg, #2d1b69 0%, #1a1a2e 100%)',
    tags: [
      { label: 'Beliebt', style: 'primary' },
      { label: 'Auf Lager', style: 'white' },
    ],
    description: 'Die Egghead-Storyline mit Dr. Vegapunk und den Seraphim als neue Charaktere.',
    cardCount: 121,
    specialCount: 14,
    specialLabel: 'Alt Arts',
    boxPrice: 95,
    inStock: true,
  },
  {
    id: 3,
    code: 'PRB',
    name: 'Premium Booster: Romance Dawn',
    emoji: '⚔️',
    bgGradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    tags: [
      { label: 'Premium', style: 'primary' },
      { label: 'Bestseller', style: 'primary' },
    ],
    description: 'Limitierte Reprint-Box mit alternativen Artworks der OP-01 Klassiker.',
    cardCount: 52,
    specialCount: 6,
    specialLabel: 'Manga Panels',
    boxPrice: 120,
    inStock: true,
  },
  {
    id: 4,
    code: 'OP-06',
    name: 'Wings of the Captain',
    emoji: '🌊',
    bgGradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 100%)',
    tags: [
      { label: 'Klassiker', style: 'muted' },
      { label: 'Begrenzt', style: 'gold' },
    ],
    description: 'Tauche ein in die Welt der großen Piratenseefahrer mit epischen Charakteren.',
    cardCount: 115,
    specialCount: 10,
    specialLabel: 'Secrets',
    boxPrice: 75,
    inStock: false,
  },
  {
    id: 5,
    code: 'OP-05',
    name: 'Awakening of the New Era',
    emoji: '⚡',
    bgGradient: 'linear-gradient(135deg, #2c1654 0%, #1a0a2e 100%)',
    tags: [
      { label: 'Ausverkauft', style: 'muted' },
      { label: 'Selten', style: 'gold' },
    ],
    description: 'Das Erwachen einer neuen Ära – mit Gear 5 Luffy und mächtigen Antagonisten.',
    cardCount: 120,
    specialCount: 11,
    specialLabel: 'Secrets',
    boxPrice: 110,
    inStock: false,
  },
  {
    id: 6,
    code: 'ST-13',
    name: 'Starter Deck: The Three Brothers',
    emoji: '👊',
    bgGradient: 'linear-gradient(135deg, #7f0000 0%, #330000 100%)',
    tags: [
      { label: 'Starter', style: 'white' },
      { label: 'Einstieg', style: 'muted' },
    ],
    description: 'Der perfekte Einstieg mit Ace, Sabo und Luffy als Themendeck.',
    cardCount: 51,
    specialCount: 4,
    specialLabel: 'Alt Arts',
    boxPrice: 15,
    inStock: true,
  },
];

export const getSetsInStock = (): TcgSet[] => sets.filter(s => s.inStock);

export const getSetById = (id: number): TcgSet | undefined => sets.find(s => s.id === id);

export const addSet = (set: Omit<TcgSet, 'id'>): TcgSet => {
  const newId = sets.length > 0 ? Math.max(...sets.map(s => s.id)) + 1 : 1;
  const newSet = { ...set, id: newId };
  sets.push(newSet);
  return newSet;
};

export const updateSet = (id: number, updates: Partial<TcgSet>): TcgSet | null => {
  const index = sets.findIndex(s => s.id === id);
  if (index === -1) return null;
  sets[index] = { ...sets[index], ...updates };
  return sets[index];
};

export const deleteSet = (id: number): boolean => {
  const index = sets.findIndex(s => s.id === id);
  if (index === -1) return false;
  sets.splice(index, 1);
  return true;
};
