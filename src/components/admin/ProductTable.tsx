import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, ExternalLink, Star, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { Product } from '@/types';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/components/Toaster';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

export default function ProductTable({ products, onEdit }: ProductTableProps) {
  const { deleteProduct, toggleFeatured } = useAdmin();
  const { showToast } = useToast();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState<string>('all');

  const handleDelete = (id: number) => {
    deleteProduct(id);
    showToast('Produkt erfolgreich gelöscht', 'success');
    setDeleteId(null);
  };

  const handleToggleFeatured = (product: Product) => {
    toggleFeatured(product.id, !product.featured, product.featuredType, product.featuredOrder);
    showToast(product.featured ? 'Aus Featured entfernt' : 'Zu Featured hinzugefügt', 'success');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.set.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = filterRarity === 'all' || product.rarity === filterRarity;
    return matchesSearch && matchesRarity;
  });

  const rarityColors: Record<string, string> = {
    secret: 'bg-red-500',
    manga: 'bg-yellow-500 text-black',
    super: 'bg-purple-500',
    rare: 'bg-blue-500',
    uncommon: 'bg-green-500',
    common: 'bg-gray-500',
    alternative: 'bg-pink-500'
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Suche nach Name, Nummer oder Set..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={filterRarity} onValueChange={setFilterRarity}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Alle Seltenheiten" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Seltenheiten</SelectItem>
            <SelectItem value="common">Common</SelectItem>
            <SelectItem value="uncommon">Uncommon</SelectItem>
            <SelectItem value="rare">Rare</SelectItem>
            <SelectItem value="super">Super Rare</SelectItem>
            <SelectItem value="secret">Secret Rare</SelectItem>
            <SelectItem value="manga">Manga Rare</SelectItem>
            <SelectItem value="alternative">Alternative Art</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bild</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Nummer</TableHead>
              <TableHead>Set</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Seltenheit</TableHead>
              <TableHead>Preis</TableHead>
              <TableHead>Trend</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.number}</TableCell>
                <TableCell className="max-w-[150px] truncate">{product.set}</TableCell>
                <TableCell className="capitalize">{product.type}</TableCell>
                <TableCell>
                  <Badge className={`${rarityColors[product.rarity] || 'bg-gray-500'} text-white text-xs`}>
                    {product.rarity}
                  </Badge>
                </TableCell>
                <TableCell className="font-bold text-yellow-500">
                  €{product.price.toFixed(2)}
                </TableCell>
                <TableCell>{getTrendIcon(product.trend)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleFeatured(product)}
                    className={product.featured ? 'text-yellow-500' : 'text-muted-foreground'}
                  >
                    <Star className={`w-5 h-5 ${product.featured ? 'fill-current' : ''}`} />
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/product/${product.id}`}>
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => setDeleteId(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Keine Produkte gefunden.
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Produkt löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie dieses Produkt wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
