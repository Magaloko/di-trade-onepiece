import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, DollarSign, TrendingUp, Star, Trash2, Check, Plus } from 'lucide-react';
import { products } from '@/data/products';
import { useCollection } from '@/context/CollectionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Collection() {
  const { state, dispatch, getCollectionStats } = useCollection();
  const [activeTab, setActiveTab] = useState('owned');
  
  const stats = getCollectionStats();
  
  const ownedProducts = state.owned.map(id => products.find(p => p.id === id)).filter(Boolean);
  const wishlistProducts = state.wishlist.map(id => products.find(p => p.id === id)).filter(Boolean);

  const statCards = [
    { icon: Package, label: 'Gesamte Karten', value: stats.totalCards, color: 'text-blue-500' },
    { icon: DollarSign, label: 'Marktwert', value: `€${stats.value.toFixed(0)}`, color: 'text-green-500' },
    { icon: TrendingUp, label: '30 Tage Trend', value: `${stats.change > 0 ? '+' : ''}${stats.change.toFixed(1)}%`, color: stats.change >= 0 ? 'text-green-500' : 'text-red-500' },
    { icon: Star, label: 'Secret Rares', value: stats.rareCards, color: 'text-yellow-500' },
  ];

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meine Sammlung</h1>
          <p className="text-muted-foreground">Verwalte deine Karten und tracke den Wert</p>
        </div>
        <Link to="/">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Karten hinzufügen
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="owned">
            Besitze ich ({state.owned.length})
          </TabsTrigger>
          <TabsTrigger value="wishlist">
            Wunschliste ({state.wishlist.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="owned">
          {ownedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {ownedProducts.map(product => product && (
                <div key={product.id} className="group relative aspect-[2.5/3.5] rounded-xl overflow-hidden border bg-muted">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      variant="destructive"
                      size="icon"
                      onClick={() => dispatch({ type: 'REMOVE_FROM_OWNED', payload: product.id })}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <p className="font-semibold text-sm truncate text-white">{product.name}</p>
                    <p className="text-yellow-500 text-sm">€{product.price}</p>
                  </div>
                  <Badge className="absolute top-2 left-2" variant="secondary">
                    {product.rarity}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Noch keine Karten in deiner Sammlung.</p>
              <Link to="/" className="inline-block mt-4">
                <Button>Jetzt Karten hinzufügen</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="wishlist">
          {wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {wishlistProducts.map(product => product && (
                <div key={product.id} className="group relative aspect-[2.5/3.5] rounded-xl overflow-hidden border bg-muted">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      variant="default"
                      size="icon"
                      onClick={() => dispatch({ type: 'MOVE_TO_OWNED', payload: product.id })}
                    >
                      <Check className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="destructive"
                      size="icon"
                      onClick={() => dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id })}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <p className="font-semibold text-sm truncate text-white">{product.name}</p>
                    <p className="text-yellow-500 text-sm">€{product.price}</p>
                  </div>
                  <Badge className="absolute top-2 left-2" variant="secondary">
                    {product.rarity}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <Star className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Deine Wunschliste ist leer.</p>
              <Link to="/" className="inline-block mt-4">
                <Button>Jetzt Karten entdecken</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
