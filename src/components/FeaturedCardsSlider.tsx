import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, TrendingDown, Clock, Crown } from 'lucide-react';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface FeaturedCardsSliderProps {
  products: Product[];
}

export default function FeaturedCardsSlider({ products }: FeaturedCardsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const featuredProducts = products.filter(p => p.featured).slice(0, 5);

  useEffect(() => {
    if (!isAutoPlaying || featuredProducts.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredProducts.length]);

  if (featuredProducts.length === 0) return null;

  const currentProduct = featuredProducts[currentIndex];

  const getBadgeInfo = (type?: string) => {
    switch (type) {
      case 'sale':
        return { icon: TrendingDown, label: 'Im Angebot', color: 'bg-green-500', gradient: 'from-green-500/20 to-green-500/5' };
      case 'new':
        return { icon: Clock, label: 'Brandneu', color: 'bg-blue-500', gradient: 'from-blue-500/20 to-blue-500/5' };
      case 'rare':
        return { icon: Crown, label: 'Extrem Selten', color: 'bg-yellow-500', gradient: 'from-yellow-500/20 to-yellow-500/5' };
      case 'promo':
        return { icon: Sparkles, label: 'Highlight', color: 'bg-purple-500', gradient: 'from-purple-500/20 to-purple-500/5' };
      default:
        return { icon: Sparkles, label: 'Highlight', color: 'bg-primary', gradient: 'from-primary/20 to-primary/5' };
    }
  };

  const badgeInfo = getBadgeInfo(currentProduct.featuredType);
  const BadgeIcon = badgeInfo.icon;

  const priceChange = ((currentProduct.price - currentProduct.oldPrice) / currentProduct.oldPrice) * 100;
  const isOnSale = currentProduct.featuredType === 'sale';

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  return (
    <section className="relative overflow-hidden py-16">
      <div className={`absolute inset-0 bg-gradient-to-br ${badgeInfo.gradient} pointer-events-none transition-all duration-500`} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Beworbene Karten</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {featuredProducts.length}
            </span>
            <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-2 border-primary/20">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div className="relative aspect-[2.5/3.5] max-w-md mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent blur-3xl rounded-full" />
              <img 
                src={currentProduct.image} 
                alt={currentProduct.name}
                className="relative z-10 w-full h-full object-cover rounded-2xl shadow-2xl"
              />
              <Badge className={`absolute top-4 left-4 z-20 ${badgeInfo.color} text-white font-bold flex items-center gap-1`}>
                <BadgeIcon className="w-4 h-4" />
                {badgeInfo.label}
              </Badge>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="uppercase">{currentProduct.rarity}</Badge>
                  <span className="text-sm text-muted-foreground">{currentProduct.number}</span>
                </div>
                <h3 className="text-4xl font-bold mb-2">{currentProduct.name}</h3>
                <p className="text-lg text-muted-foreground">{currentProduct.set}</p>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {currentProduct.description}
              </p>

              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Aktueller Preis</p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-yellow-500">
                      €{currentProduct.price.toFixed(2)}
                    </span>
                    {isOnSale && (
                      <span className="text-xl text-muted-foreground line-through">
                        €{currentProduct.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {isOnSale && (
                    <p className="text-green-500 text-sm mt-1">
                      Du sparst €{(currentProduct.oldPrice - currentProduct.price).toFixed(2)} ({Math.abs(priceChange).toFixed(0)}%)
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Link to={`/product/${currentProduct.id}`} className="flex-1">
                  <Button size="lg" className="w-full rounded-xl">
                    Details ansehen
                  </Button>
                </Link>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 pt-4">
                {featuredProducts.map((product, index) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentIndex(index);
                    }}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentIndex ? 'border-primary ring-2 ring-primary/20' : 'border-border opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
