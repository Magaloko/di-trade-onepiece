import { Package, Euro, TrendingUp, TrendingDown, Sparkles, BarChart3 } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminStats() {
  const { getDashboardStats } = useAdmin();
  const stats = getDashboardStats();

  const statCards = [
    {
      title: 'Gesamte Produkte',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Gesamtwert',
      value: `€${stats.totalValue.toFixed(0)}`,
      icon: Euro,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Featured Karten',
      value: stats.featuredCount,
      icon: Sparkles,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Ø Preis',
      value: `€${stats.avgPrice.toFixed(2)}`,
      icon: BarChart3,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'Preis ↑',
      value: stats.priceUpCount,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Preis ↓',
      value: stats.priceDownCount,
      icon: TrendingDown,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
