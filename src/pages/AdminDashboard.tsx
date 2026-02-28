import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plus, Package, Euro, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import AdminStats from '@/components/admin/AdminStats';
import ProductTable from '@/components/admin/ProductTable';
import ProductEditModal from '@/components/admin/ProductEditModal';
import AddProductModal from '@/components/admin/AddProductModal';
import PriceManager from '@/components/admin/PriceManager';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    products, 
    selectedProduct, 
    setSelectedProduct,
    isEditModalOpen, 
    setIsEditModalOpen,
    isAddModalOpen,
    setIsAddModalOpen
  } = useAdmin();

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleEdit = (product: typeof selectedProduct) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Verwalte Karten, Preise und Featured-Produkte</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Neue Karte
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <AdminStats />
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">
            <Package className="w-4 h-4 mr-2" />
            Produkte
          </TabsTrigger>
          <TabsTrigger value="prices">
            <Euro className="w-4 h-4 mr-2" />
            Preise
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Einstellungen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Produktverwaltung</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductTable 
                products={products} 
                onEdit={handleEdit}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prices" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <PriceManager />
            
            <Card>
              <CardHeader>
                <CardTitle>Preis-Statistiken</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span>Höchster Preis</span>
                  <span className="font-bold text-green-500">
                    €{Math.max(...products.map(p => p.price)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span>Niedrigster Preis</span>
                  <span className="font-bold">
                    €{Math.min(...products.map(p => p.price)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span>Durchschnittspreis</span>
                  <span className="font-bold text-yellow-500">
                    €{(products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span>Gesamtwert aller Karten</span>
                  <span className="font-bold text-primary">
                    €{products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Einstellungen</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Weitere Einstellungen werden in zukünftigen Updates hinzugefügt.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ProductEditModal 
        product={selectedProduct}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
      />

      <AddProductModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
