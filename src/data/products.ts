import type { Product, ProductType, ProductRarity, FeaturedType, TrendType } from '@/types';

export const products: Product[] = [
  {
    id: 1,
    name: "Monkey D. Luffy",
    number: "OP08-001",
    set: "OP-08: Wings of Captain",
    type: "leader" as ProductType,
    rarity: "secret" as ProductRarity,
    price: 450.00,
    oldPrice: 420.00,
    image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=560&fit=crop",
    trend: "up" as TrendType,
    stats: { high: 520, low: 380, avg: 445 },
    description: "Leader-Karte aus der neuen OP-08 Serie. Extrem selten als Secret Rare.",
    attributes: { power: 5000, color: "Red", cost: 0 },
    featured: true,
    featuredType: "new" as FeaturedType,
    featuredOrder: 1
  },
  {
    id: 2,
    name: "Shanks",
    number: "OP07-002",
    set: "OP-07: 500 Years",
    type: "leader" as ProductType,
    rarity: "manga" as ProductRarity,
    price: 1200.00,
    oldPrice: 950.00,
    image: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=400&h=560&fit=crop",
    trend: "up" as TrendType,
    stats: { high: 1350, low: 800, avg: 1100 },
    description: "Manga Rare Variante mit alternativem Artwork. Höchste Seltenheitsstufe.",
    attributes: { power: 5000, color: "Red", cost: 0 },
    featured: true,
    featuredType: "rare" as FeaturedType,
    featuredOrder: 2
  },
  {
    id: 3,
    name: "Nico Robin",
    number: "OP08-042",
    set: "OP-08: Wings of Captain",
    type: "character" as ProductType,
    rarity: "super" as ProductRarity,
    price: 45.00,
    oldPrice: 52.00,
    image: "https://images.unsplash.com/photo-1542259681-d4cd403bc352?w=400&h=560&fit=crop",
    trend: "down" as TrendType,
    stats: { high: 60, low: 40, avg: 48 },
    description: "Super Rare Character-Karte mit starker Fähigkeit.",
    attributes: { power: 6000, color: "Purple", cost: 4 },
    featured: false
  },
  {
    id: 4,
    name: "Marshall D. Teach",
    number: "OP07-081",
    set: "OP-07: 500 Years",
    type: "leader" as ProductType,
    rarity: "secret" as ProductRarity,
    price: 380.00,
    oldPrice: 350.00,
    image: "https://images.unsplash.com/photo-1605218427368-35b0f996d6b7?w=400&h=560&fit=crop",
    trend: "up" as TrendType,
    stats: { high: 450, low: 300, avg: 375 },
    description: "Blackbeard Leader-Karte. Sehr gefragt im aktuellen Meta.",
    attributes: { power: 5000, color: "Black", cost: 0 },
    featured: true,
    featuredType: "sale" as FeaturedType,
    featuredOrder: 3
  },
  {
    id: 5,
    name: "Trafalgar Law",
    number: "OP08-021",
    set: "OP-08: Wings of Captain",
    type: "character" as ProductType,
    rarity: "rare" as ProductRarity,
    price: 12.50,
    oldPrice: 15.00,
    image: "https://images.unsplash.com/photo-1635322966219-b75ed3a90e2d?w=400&h=560&fit=crop",
    trend: "down" as TrendType,
    stats: { high: 18, low: 10, avg: 13 },
    description: "Solide Rare-Karte für Ope-Ope-Decks.",
    attributes: { power: 5000, color: "Blue", cost: 3 },
    featured: false
  },
  {
    id: 6,
    name: "Gol D. Roger",
    number: "OP07-118",
    set: "OP-07: 500 Years",
    type: "character" as ProductType,
    rarity: "manga" as ProductRarity,
    price: 850.00,
    oldPrice: 820.00,
    image: "https://images.unsplash.com/photo-1560972550-aba3456b5564?w=400&h=560&fit=crop",
    trend: "up" as TrendType,
    stats: { high: 950, low: 700, avg: 825 },
    description: "Der Piratenkönig als Manga Rare. Must-have für Sammler.",
    attributes: { power: 9000, color: "Red", cost: 8 },
    featured: true,
    featuredType: "rare" as FeaturedType,
    featuredOrder: 4
  },
  {
    id: 7,
    name: "Roronoa Zoro",
    number: "OP08-015",
    set: "OP-08: Wings of Captain",
    type: "character" as ProductType,
    rarity: "secret" as ProductRarity,
    price: 320.00,
    oldPrice: 280.00,
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=560&fit=crop",
    trend: "up" as TrendType,
    stats: { high: 380, low: 250, avg: 310 },
    description: "Zoro als Secret Rare aus der neuesten Serie.",
    attributes: { power: 7000, color: "Green", cost: 5 },
    featured: true,
    featuredType: "promo" as FeaturedType,
    featuredOrder: 5
  },
  {
    id: 8,
    name: "Nami",
    number: "OP08-033",
    set: "OP-08: Wings of Captain",
    type: "character" as ProductType,
    rarity: "super" as ProductRarity,
    price: 28.00,
    oldPrice: 25.00,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=560&fit=crop",
    trend: "up" as TrendType,
    stats: { high: 35, low: 20, avg: 26 },
    description: "Nami als Super Rare - perfekt für Navigator-Decks.",
    attributes: { power: 4000, color: "Yellow", cost: 2 },
    featured: false
  },
  {
    id: 9,
    name: "Sanji",
    number: "OP07-045",
    set: "OP-07: 500 Years",
    type: "character" as ProductType,
    rarity: "rare" as ProductRarity,
    price: 18.00,
    oldPrice: 22.00,
    image: "https://images.unsplash.com/photo-1560167016-022b78a0258e?w=400&h=560&fit=crop",
    trend: "down" as TrendType,
    stats: { high: 28, low: 15, avg: 20 },
    description: "Sanji Rare-Karte für Vinsmoke-Decks.",
    attributes: { power: 6000, color: "Blue", cost: 4 },
    featured: false
  },
  {
    id: 10,
    name: "Portgas D. Ace",
    number: "OP07-052",
    set: "OP-07: 500 Years",
    type: "character" as ProductType,
    rarity: "secret" as ProductRarity,
    price: 520.00,
    oldPrice: 480.00,
    image: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=400&h=560&fit=crop",
    trend: "up" as TrendType,
    stats: { high: 600, low: 450, avg: 510 },
    description: "Ace als Secret Rare - extrem beliebt bei Sammlern.",
    attributes: { power: 7000, color: "Red", cost: 5 },
    featured: false
  },
  {
    id: 11,
    name: "Sabo",
    number: "OP08-067",
    set: "OP-08: Wings of Captain",
    type: "character" as ProductType,
    rarity: "manga" as ProductRarity,
    price: 680.00,
    oldPrice: 620.00,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=560&fit=crop",
    trend: "up" as TrendType,
    stats: { high: 750, low: 580, avg: 660 },
    description: "Sabo als Manga Rare - limitierte Auflage.",
    attributes: { power: 8000, color: "Red", cost: 6 },
    featured: false
  },
  {
    id: 12,
    name: "Boa Hancock",
    number: "OP07-038",
    set: "OP-07: 500 Years",
    type: "character" as ProductType,
    rarity: "super" as ProductRarity,
    price: 55.00,
    oldPrice: 48.00,
    image: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=400&h=560&fit=crop",
    trend: "up" as TrendType,
    stats: { high: 70, low: 42, avg: 52 },
    description: "Boa Hancock Super Rare für Kuja-Decks.",
    attributes: { power: 6000, color: "Purple", cost: 4 },
    featured: false
  }
];

export const getProductById = (id: number | string): Product | undefined => {
  return products.find(p => p.id === Number(id));
};

export const getFeaturedProducts = (): Product[] => {
  return products
    .filter(p => p.featured)
    .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999))
    .slice(0, 5);
};

export const getProductsByRarity = (rarity: ProductRarity): Product[] => {
  return products.filter(p => p.rarity === rarity);
};

export const getProductsBySet = (set: string): Product[] => {
  return products.filter(p => p.set.toLowerCase().includes(set.toLowerCase()));
};

export const getProductsByType = (type: ProductType): Product[] => {
  return products.filter(p => p.type === type);
};

export const addProduct = (product: Omit<Product, 'id'>): Product => {
  const newId = Math.max(...products.map(p => p.id)) + 1;
  const newProduct = { ...product, id: newId };
  products.push(newProduct);
  return newProduct;
};

export const updateProduct = (id: number, updates: Partial<Product>): Product | null => {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates };
  return products[index];
};

export const deleteProduct = (id: number): boolean => {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
};
