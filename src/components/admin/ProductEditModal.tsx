import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import type { Product } from '@/types';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/components/Toaster';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface ProductEditModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductEditModal({ product, isOpen, onClose }: ProductEditModalProps) {
  const { updateProduct } = useAdmin();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<Partial<Product>>({});

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product && formData) {
      updateProduct(product.id, formData);
      showToast('Produkt erfolgreich aktualisiert', 'success');
      onClose();
    }
  };

  const handleChange = (field: keyof Product, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Produkt bearbeiten: {product.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Kartennummer</Label>
              <Input
                id="number"
                value={formData.number || ''}
                onChange={(e) => handleChange('number', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="set">Set</Label>
              <Input
                id="set"
                value={formData.set || ''}
                onChange={(e) => handleChange('set', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preis (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price || 0}
                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Typ</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leader">Leader</SelectItem>
                  <SelectItem value="character">Character</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="stage">Stage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rarity">Seltenheit</Label>
              <Select 
                value={formData.rarity} 
                onValueChange={(value) => handleChange('rarity', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Bild URL</Label>
            <Input
              id="image"
              value={formData.image || ''}
              onChange={(e) => handleChange('image', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="featured">Als Featured anzeigen</Label>
              <p className="text-sm text-muted-foreground">Wird im Slider auf der Startseite angezeigt</p>
            </div>
            <Switch
              id="featured"
              checked={formData.featured || false}
              onCheckedChange={(checked) => handleChange('featured', checked)}
            />
          </div>

          {formData.featured && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="featuredType">Featured Typ</Label>
                <Select 
                  value={formData.featuredType} 
                  onValueChange={(value) => handleChange('featuredType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Angebot</SelectItem>
                    <SelectItem value="new">Neu</SelectItem>
                    <SelectItem value="rare">Selten</SelectItem>
                    <SelectItem value="promo">Promo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="featuredOrder">Reihenfolge</Label>
                <Input
                  id="featuredOrder"
                  type="number"
                  value={formData.featuredOrder || 1}
                  onChange={(e) => handleChange('featuredOrder', parseInt(e.target.value))}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Abbrechen
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Speichern
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
