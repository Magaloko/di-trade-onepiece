import { useState } from 'react';
import { Percent, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/components/Toaster';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function PriceManager() {
  const { bulkUpdatePrices } = useAdmin();
  const { showToast } = useToast();
  const [percentage, setPercentage] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [changeType, setChangeType] = useState<'increase' | 'decrease'>('increase');

  const handleBulkUpdate = (type: 'increase' | 'decrease') => {
    const value = parseFloat(percentage);
    if (isNaN(value) || value <= 0) {
      showToast('Bitte geben Sie einen gültigen Prozentsatz ein', 'error');
      return;
    }
    setChangeType(type);
    setShowConfirmDialog(true);
  };

  const confirmBulkUpdate = () => {
    const value = parseFloat(percentage);
    const change = changeType === 'increase' ? value : -value;
    bulkUpdatePrices(change);
    showToast(`Alle Preise wurden um ${value}% ${changeType === 'increase' ? 'erhöht' : 'gesenkt'}`, 'success');
    setPercentage('');
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            Preisanpassung (Bulk)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="percentage">Prozentsatz (%)</Label>
            <Input
              id="percentage"
              type="number"
              min="0"
              max="100"
              placeholder="z.B. 10"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Alle Preise werden um diesen Prozentsatz angepasst.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="default"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleBulkUpdate('increase')}
              disabled={!percentage}
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Preise erhöhen
            </Button>
            <Button
              variant="default"
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={() => handleBulkUpdate('decrease')}
              disabled={!percentage}
            >
              <ArrowDown className="w-4 h-4 mr-2" />
              Preise senken
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Preisanpassung bestätigen
            </AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie wirklich alle Preise um {percentage}% {changeType === 'increase' ? 'erhöhen' : 'senken'}?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmBulkUpdate}
              className={changeType === 'increase' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              Bestätigen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
