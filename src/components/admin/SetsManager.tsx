import { useState } from 'react';
import type { TcgSet, SetTag } from '@/types';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

const emptySet: Omit<TcgSet, 'id'> = {
  code: '',
  name: '',
  emoji: '🃏',
  bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
  tags: [{ label: 'Neu', style: 'primary' }],
  description: '',
  cardCount: 0,
  specialCount: 0,
  specialLabel: 'Secrets',
  boxPrice: 0,
  inStock: true,
};

interface SetFormProps {
  initialData: Omit<TcgSet, 'id'>;
  onSave: (data: Omit<TcgSet, 'id'>) => void;
  onCancel: () => void;
  title: string;
}

function SetForm({ initialData, onSave, onCancel, title }: SetFormProps) {
  const [form, setForm] = useState<Omit<TcgSet, 'id'>>(initialData);
  const [tagInput, setTagInput] = useState('');

  const update = (field: keyof Omit<TcgSet, 'id'>, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const addTag = () => {
    if (!tagInput.trim()) return;
    const newTag: SetTag = { label: tagInput.trim(), style: 'primary' };
    setForm(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
    setTagInput('');
  };

  const removeTag = (index: number) =>
    setForm(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));

  return (
    <DialogContent className="max-w-2xl" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.1)', color: '#e4e4e7' }}>
      <DialogHeader>
        <DialogTitle style={{ color: '#e4e4e7' }}>{title}</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4 py-4">
        <div className="space-y-2">
          <Label style={{ color: '#a1a1aa' }}>Set-Code (z.B. OP-08)</Label>
          <Input
            value={form.code}
            onChange={e => update('code', e.target.value)}
            placeholder="OP-08"
            style={{ background: '#050508', borderColor: 'rgba(255,255,255,0.1)', color: '#e4e4e7' }}
          />
        </div>
        <div className="space-y-2">
          <Label style={{ color: '#a1a1aa' }}>Emoji</Label>
          <Input
            value={form.emoji}
            onChange={e => update('emoji', e.target.value)}
            placeholder="🏴‍☠️"
            style={{ background: '#050508', borderColor: 'rgba(255,255,255,0.1)', color: '#e4e4e7' }}
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label style={{ color: '#a1a1aa' }}>Name</Label>
          <Input
            value={form.name}
            onChange={e => update('name', e.target.value)}
            placeholder="Wings of Captain"
            style={{ background: '#050508', borderColor: 'rgba(255,255,255,0.1)', color: '#e4e4e7' }}
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label style={{ color: '#a1a1aa' }}>Beschreibung</Label>
          <Input
            value={form.description}
            onChange={e => update('description', e.target.value)}
            placeholder="Kurze Beschreibung des Sets..."
            style={{ background: '#050508', borderColor: 'rgba(255,255,255,0.1)', color: '#e4e4e7' }}
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label style={{ color: '#a1a1aa' }}>CSS Hintergrund-Gradient</Label>
          <Input
            value={form.bgGradient}
            onChange={e => update('bgGradient', e.target.value)}
            placeholder="linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)"
            style={{ background: '#050508', borderColor: 'rgba(255,255,255,0.1)', color: '#e4e4e7' }}
          />
        </div>

        <div className="space-y-2">
          <Label style={{ color: '#a1a1aa' }}>Anzahl Karten</Label>
          <Input
            type="number"
            value={form.cardCount}
            onChange={e => update('cardCount', Number(e.target.value))}
            style={{ background: '#050508', borderColor: 'rgba(255,255,255,0.1)', color: '#e4e4e7' }}
          />
        </div>
        <div className="space-y-2">
          <Label style={{ color: '#a1a1aa' }}>Booster Box Preis (€)</Label>
          <Input
            type="number"
            value={form.boxPrice}
            onChange={e => update('boxPrice', Number(e.target.value))}
            style={{ background: '#050508', borderColor: 'rgba(255,255,255,0.1)', color: '#e4e4e7' }}
          />
        </div>

        <div className="space-y-2">
          <Label style={{ color: '#a1a1aa' }}>Anzahl Specials</Label>
          <Input
            type="number"
            value={form.specialCount}
            onChange={e => update('specialCount', Number(e.target.value))}
            style={{ background: '#050508', borderColor: 'rgba(255,255,255,0.1)', color: '#e4e4e7' }}
          />
        </div>
        <div className="space-y-2">
          <Label style={{ color: '#a1a1aa' }}>Special Label (z.B. Secrets)</Label>
          <Input
            value={form.specialLabel}
            onChange={e => update('specialLabel', e.target.value)}
            style={{ background: '#050508', borderColor: 'rgba(255,255,255,0.1)', color: '#e4e4e7' }}
          />
        </div>

        {/* Tags */}
        <div className="col-span-2 space-y-2">
          <Label style={{ color: '#a1a1aa' }}>Tags</Label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTag()}
              placeholder="Tag hinzufügen..."
              style={{ background: '#050508', borderColor: 'rgba(255,255,255,0.1)', color: '#e4e4e7' }}
            />
            <Button onClick={addTag} size="sm" style={{ background: '#ff3d3d', color: '#fff', border: 'none' }}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {form.tags.map((tag, i) => (
              <Badge
                key={i}
                className="cursor-pointer gap-1"
                style={{ background: 'rgba(255,61,61,0.15)', color: '#ff3d3d', border: 'none' }}
                onClick={() => removeTag(i)}
              >
                {tag.label} <XCircle className="w-3 h-3" />
              </Badge>
            ))}
          </div>
        </div>

        {/* In Stock */}
        <div className="col-span-2 flex items-center gap-3">
          <Label style={{ color: '#a1a1aa' }}>Auf Lager:</Label>
          <button
            onClick={() => update('inStock', !form.inStock)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            style={{
              background: form.inStock ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
              color: form.inStock ? '#22c55e' : '#ef4444',
              border: `1px solid ${form.inStock ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}
          >
            {form.inStock ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {form.inStock ? 'Auf Lager' : 'Ausverkauft'}
          </button>
        </div>
      </div>

      <DialogFooter>
        <Button variant="ghost" onClick={onCancel} style={{ color: '#71717a' }}>Abbrechen</Button>
        <Button
          onClick={() => onSave(form)}
          style={{ background: '#ff3d3d', color: '#fff', border: 'none' }}
        >
          Speichern
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

/* ─── Main SetsManager ────────────────────────────────── */
export default function SetsManager() {
  const { sets, addSet, updateSet, deleteSet } = useAdmin();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<TcgSet | null>(null);

  const handleAdd = (data: Omit<TcgSet, 'id'>) => {
    addSet(data);
    setIsAddOpen(false);
  };

  const handleEdit = (data: Omit<TcgSet, 'id'>) => {
    if (!editingSet) return;
    updateSet(editingSet.id, data);
    setEditingSet(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('Set wirklich löschen?')) deleteSet(id);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold" style={{ color: '#e4e4e7' }}>Sets verwalten</h3>
          <p className="text-sm mt-1" style={{ color: '#71717a' }}>
            {sets.length} Sets insgesamt · {sets.filter(s => s.inStock).length} auf Lager
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          style={{ background: '#ff3d3d', color: '#fff', border: 'none' }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Set hinzufügen
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Code', 'Name', 'Karten', 'Specials', 'Preis', 'Status', 'Aktionen'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#71717a' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sets.map((set, i) => (
              <tr
                key={set.id}
                style={{
                  borderBottom: i < sets.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                }}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{set.emoji}</span>
                    <span className="font-orbitron font-bold text-sm" style={{ color: '#ff3d3d' }}>
                      {set.code}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium" style={{ color: '#e4e4e7' }}>{set.name}</span>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {set.tags.map((t, ti) => (
                      <span key={ti} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,61,61,0.1)', color: '#ff3d3d' }}>
                        {t.label}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm" style={{ color: '#e4e4e7' }}>{set.cardCount}</td>
                <td className="px-4 py-4 text-sm" style={{ color: '#e4e4e7' }}>
                  {set.specialCount} {set.specialLabel}
                </td>
                <td className="px-4 py-4 text-sm font-bold" style={{ color: '#ffd700' }}>
                  ab {set.boxPrice}€
                </td>
                <td className="px-4 py-4">
                  <span
                    className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={
                      set.inStock
                        ? { background: 'rgba(34,197,94,0.15)', color: '#22c55e' }
                        : { background: 'rgba(239,68,68,0.15)', color: '#ef4444' }
                    }
                  >
                    {set.inStock ? 'Auf Lager' : 'Ausverkauft'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingSet(set)}
                      style={{ color: '#71717a' }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(set.id)}
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SetForm
          title="Neues Set hinzufügen"
          initialData={emptySet}
          onSave={handleAdd}
          onCancel={() => setIsAddOpen(false)}
        />
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingSet} onOpenChange={open => { if (!open) setEditingSet(null); }}>
        {editingSet && (
          <SetForm
            title={`Set bearbeiten: ${editingSet.code}`}
            initialData={editingSet}
            onSave={handleEdit}
            onCancel={() => setEditingSet(null)}
          />
        )}
      </Dialog>
    </div>
  );
}
