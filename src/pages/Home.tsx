import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, TrendingUp, Flame } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import FeaturedCardsSlider from '@/components/FeaturedCardsSlider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.set.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.number.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = activeFilter === 'all' || 
                           (activeFilter === 'secret' && product.rarity === 'secret') ||
                           (activeFilter === 'manga' && product.rarity === 'manga') ||
                           product.type === activeFilter ||
                           product.set.toLowerCase().includes(activeFilter.toLowerCase());

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  const filters = [
    { id: 'all', label: 'Alle' },
    { id: 'leader', label: 'Leader' },
    { id: 'character', label: 'Characters' },
    { id: 'secret', label: 'Secret Rare' },
    { id: 'manga', label: 'Manga Rare' },
    { id: 'op08', label: 'OP-08' },
    { id: 'op07', label: 'OP-07' },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-yellow-500/10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
              <Badge variant="secondary" className="px-4 py-2 text-primary border-primary/30">
                <TrendingUp className="w-4 h-4 mr-2" />
                OP-08 Jetzt verfügbar
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                ONE PIECE <span className="bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">TCG</span><br />
                MARKETPLACE
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                Verwalte deine Sammlung, tracke Preise in Echtzeit und verpasse nie wieder ein Schnäppchen.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Karten finden
                </Button>
                <Link to="/collection">
                  <Button variant="outline" size="lg">
                    Meine Sammlung
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-primary/30 blur-[100px] rounded-full" />
              <img 
                src="https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&h=400&fit=crop" 
                alt="Featured Card" 
                className="relative z-10 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500 rotate-3 hover:rotate-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cards Slider */}
      <FeaturedCardsSlider products={products} />

      {/* Search & Filter */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-xl rounded-2xl p-6 border mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Suche nach Kartenname, Set oder Nummer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 text-lg"
            />
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            {filters.map(filter => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                className="rounded-full whitespace-nowrap"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {filteredProducts.length} Karten gefunden
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} showFeaturedBadge />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Flame className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground text-lg">Keine Karten gefunden.</p>
          </div>
        )}
      </section>
    </div>
  );
}
