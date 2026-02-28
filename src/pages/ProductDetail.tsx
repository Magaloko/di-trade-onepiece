import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Check, TrendingUp, TrendingDown } from 'lucide-react';
import { getProductById } from '@/data/products';
import { useCollection } from '@/context/CollectionContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch, state } = useCollection();
  
  const product = getProductById(id || '');
  
  if (!product) {
    return (
      <div className="pt-32 text-center">
        <p className="text-muted-foreground">Karte nicht gefunden</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Zurück
        </Button>
      </div>
    );
  }

  const isInWishlist = state.wishlist.includes(product.id);
  const isOwned = state.owned.includes(product.id);
  
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

  // Mock chart data
  const chartData = [
    { day: 'Tag 1', price: product.stats.low },
    { day: 'Tag 10', price: product.stats.low + (product.stats.avg - product.stats.low) * 0.3 },
    { day: 'Tag 20', price: product.stats.avg },
    { day: 'Tag 30', price: product.price },
  ];

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Button 
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-8"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Zurück
      </Button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative">
          <div className="aspect-[2.5/3.5] rounded-3xl overflow-hidden bg-gradient-to-br from-muted to-background border shadow-2xl">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 blur-[80px] rounded-full" />
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge className={`${rarityColors[product.rarity] || 'bg-gray-500'} text-white text-sm font-bold uppercase`}>
                {product.rarity}
              </Badge>
              <span className="text-muted-foreground">{product.number}</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{product.name}</h1>
            <p className="text-xl text-muted-foreground mb-6">{product.set}</p>
            
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Price Box */}
          <Card>
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-muted-foreground mb-1">Aktueller Marktpreis</p>
                  <div className="text-5xl font-bold text-yellow-500">
                    €{product.price.toFixed(2)}
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${isPriceUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {isPriceUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(priceChange).toFixed(1)}%
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <div className="text-xl font-bold">€{product.stats.high}</div>
                  <div className="text-xs text-muted-foreground mt-1">30T Hoch</div>
                </div>
                <div className="text-center border-x">
                  <div className="text-xl font-bold">€{product.stats.low}</div>
                  <div className="text-xs text-muted-foreground mt-1">30T Tief</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">€{product.stats.avg}</div>
                  <div className="text-xs text-muted-foreground mt-1">Ø Preis</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            {!isOwned ? (
              <Button 
                size="lg"
                onClick={() => dispatch({ type: 'ADD_TO_OWNED', payload: product.id })}
                className="flex-1"
              >
                <Check className="w-5 h-5 mr-2" />
                Habe ich
              </Button>
            ) : (
              <Button 
                size="lg"
                variant="default"
                className="flex-1 bg-green-600 hover:bg-green-700 cursor-default"
                disabled
              >
                <Check className="w-5 h-5 mr-2" />
                In Sammlung
              </Button>
            )}
            
            <Button 
              variant={isInWishlist ? 'default' : 'outline'}
              size="icon"
              className={`h-14 w-14 ${isInWishlist ? 'bg-primary' : ''}`}
              onClick={() => dispatch({ type: isInWishlist ? 'REMOVE_FROM_WISHLIST' : 'ADD_TO_WISHLIST', payload: product.id })}
            >
              <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
            </Button>
            
            <Button 
              variant="outline"
              size="icon"
              className="h-14 w-14"
              onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product.id })}
            >
              <ShoppingCart className="w-6 h-6" />
            </Button>
          </div>

          {/* Attributes */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Power</p>
                <p className="text-2xl font-bold">{product.attributes.power}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Farbe</p>
                <p className="text-2xl font-bold">{product.attributes.color}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Kosten</p>
                <p className="text-2xl font-bold">{product.attributes.cost}</p>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <div className="h-64">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Preisverlauf (30 Tage)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="day" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a23', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#eab308' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 4 }}
                  activeDot={{ r: 6, fill: '#eab308' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
