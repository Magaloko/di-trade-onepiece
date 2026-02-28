import { useState } from 'react';
import { X, Plus } from 'lucide-react';
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

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormData: Omit<Product, 'id'> = {
  name: '',
  number: '',
  set: '',
  type: 'character',
  rarity: 'common',
  price: 0,
  oldPrice: 0,
  image: '',
  description: '',
  trend: 'stable',
  stats: { high: 0, low: 0, avg: 0 },
  attributes: { power: 0, color: 'Red', cost: 0 },
  featured: false,
  featuredType: undefined,
  featuredOrder: 1
};

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const { addProduct } = useAdmin();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(initialFormData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(formData);
    showToast('Produkt erfolgreich hinzugefügt', 'success');
    setFormData(initialFormData);
    onClose();
  };

  const handleChange = (field: keyof Product, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Neues Produkt hinzufügen
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="z.B. Monkey D. Luffy"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Kartennummer *</Label>
              <Input
                id="number"
                required
                value={formData.number}
                onChange={(e) => handleChange('number', e.target.value)}
                placeholder="z.B. OP08-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="set">Set *</Label>
              <Input
                id="set"
                required
                value={formData.set}
                onChange={(e) => handleChange('set', e.target.value)}
                placeholder="z.B. OP-08: Wings of Captain"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preis (€) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                required
                value={formData.price}
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
            <Label htmlFor="image">Bild URL *</Label>
            <Input
              id="image"
              required
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Beschreibung der Karte..."
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="featured">Als Featured anzeigen</Label>
              <p className="text-sm text-muted-foreground">Wird im Slider auf der Startseite angezeigt</p>
            </div>
            <Switch
              id="featured"
              checked={formData.featured}
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
                  value={formData.featuredOrder}
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
              <Plus className="w-4 h-4 mr-2" />
              Hinzufügen
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
