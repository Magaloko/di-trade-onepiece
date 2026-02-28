import { Link } from 'react-router-dom';
import { Heart, Plus, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { useCollection } from '@/context/CollectionContext';
import type { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  showFeaturedBadge?: boolean;
}

export default function ProductCard({ product, showFeaturedBadge = false }: ProductCardProps) {
  const { state, dispatch } = useCollection();
  
  const isInWishlist = state.wishlist.includes(product.id);
  const priceChange = ((product.price - product.oldPrice) / product.oldPrice) * 100;
  const isPriceUp = priceChange >= 0;

  const rarityColors: Record<string, string> = {
    secret: 'bg-red-500',
    manga: 'bg-yellow-500 text-black',
    super: 'bg-purple-500',
    rare: 'bg-blue-500',
    uncommon: 'bg-green-500',
    common: 'bg-gray-500',
    alternative: 'bg-pink-500'
  };

  const featuredBadgeColors: Record<string, string> = {
    sale: 'bg-green-500',
    new: 'bg-blue-500',
    rare: 'bg-yellow-500 text-black',
    promo: 'bg-purple-500'
  };

  const featuredBadgeLabels: Record<string, string> = {
    sale: 'Angebot',
    new: 'Neu',
    rare: 'Selten',
    promo: 'Promo'
  };

  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      <Link to={`/product/${product.id}`} className="block relative aspect-[2.5/3.5] overflow-hidden bg-gradient-to-br from-muted to-background">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className={`${rarityColors[product.rarity] || 'bg-gray-500'} text-white text-xs font-bold uppercase`}>
            {product.rarity}
          </Badge>
          {showFeaturedBadge && product.featured && product.featuredType && (
            <Badge className={`${featuredBadgeColors[product.featuredType]} text-xs font-bold flex items-center gap-1`}>
              <Sparkles className="w-3 h-3" />
              {featuredBadgeLabels[product.featuredType]}
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch({ 
              type: isInWishlist ? 'REMOVE_FROM_WISHLIST' : 'ADD_TO_WISHLIST', 
              payload: product.id 
            });
          }}
          className={`absolute top-3 right-3 rounded-full backdrop-blur-md transition-all ${
            isInWishlist 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-black/50 text-white hover:bg-primary'
          }`}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </Button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          <span className="text-white font-semibold text-sm">Details ansehen →</span>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span>{product.number}</span>
          <span>•</span>
          <span className="uppercase">{product.type}</span>
        </div>
        
        <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{product.set}</p>
        
        <div className="flex items-end justify-between pt-4 border-t border-border">
          <div>
            <div className="text-2xl font-bold text-yellow-500">
              €{product.price.toFixed(2)}
            </div>
            <div className={`flex items-center gap-1 text-xs ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
              {isPriceUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(priceChange).toFixed(1)}%
            </div>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product.id })}
            className="rounded-xl"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
