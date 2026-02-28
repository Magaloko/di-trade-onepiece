import { createContext, useContext, useState, useCallback } from 'react';
import type { Product, FeaturedType } from '@/types';
import { products, updateProduct as updateProductData, addProduct as addProductData, deleteProduct as deleteProductData } from '@/data/products';

interface AdminContextType {
  // Product Management
  products: Product[];
  updateProduct: (id: number, updates: Partial<Product>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: number) => void;
  toggleFeatured: (id: number, featured: boolean, featuredType?: FeaturedType, featuredOrder?: number) => void;
  
  // Price Management
  updatePrice: (id: number, newPrice: number) => void;
  bulkUpdatePrices: (percentageChange: number) => void;
  
  // Stats
  getDashboardStats: () => {
    totalProducts: number;
    totalValue: number;
    featuredCount: number;
    avgPrice: number;
    priceUpCount: number;
    priceDownCount: number;
  };
  
  // UI State
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [productList, setProductList] = useState<Product[]>(products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleUpdateProduct = useCallback((id: number, updates: Partial<Product>) => {
    const updated = updateProductData(id, updates);
    if (updated) {
      setProductList(prev => prev.map(p => p.id === id ? updated : p));
    }
  }, []);

  const handleAddProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct = addProductData(product);
    setProductList(prev => [...prev, newProduct]);
  }, []);

  const handleDeleteProduct = useCallback((id: number) => {
    const success = deleteProductData(id);
    if (success) {
      setProductList(prev => prev.filter(p => p.id !== id));
    }
  }, []);

  const handleToggleFeatured = useCallback((id: number, featured: boolean, featuredType?: FeaturedType, featuredOrder?: number) => {
    const updates: Partial<Product> = { featured };
    if (featured) {
      updates.featuredType = featuredType || 'promo';
      updates.featuredOrder = featuredOrder || 999;
    } else {
      updates.featuredType = undefined;
      updates.featuredOrder = undefined;
    }
    handleUpdateProduct(id, updates);
  }, [handleUpdateProduct]);

  const handleUpdatePrice = useCallback((id: number, newPrice: number) => {
    const product = productList.find(p => p.id === id);
    if (product) {
      handleUpdateProduct(id, { 
        price: newPrice,
        oldPrice: product.price,
        trend: newPrice > product.price ? 'up' : newPrice < product.price ? 'down' : 'stable'
      });
    }
  }, [productList, handleUpdateProduct]);

  const handleBulkUpdatePrices = useCallback((percentageChange: number) => {
    productList.forEach(product => {
      const newPrice = product.price * (1 + percentageChange / 100);
      handleUpdatePrice(product.id, Number(newPrice.toFixed(2)));
    });
  }, [productList, handleUpdatePrice]);

  const getDashboardStats = useCallback(() => {
    const totalProducts = productList.length;
    const totalValue = productList.reduce((sum, p) => sum + p.price, 0);
    const featuredCount = productList.filter(p => p.featured).length;
    const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;
    const priceUpCount = productList.filter(p => p.trend === 'up').length;
    const priceDownCount = productList.filter(p => p.trend === 'down').length;

    return {
      totalProducts,
      totalValue,
      featuredCount,
      avgPrice,
      priceUpCount,
      priceDownCount
    };
  }, [productList]);

  return (
    <AdminContext.Provider value={{
      products: productList,
      updateProduct: handleUpdateProduct,
      addProduct: handleAddProduct,
      deleteProduct: handleDeleteProduct,
      toggleFeatured: handleToggleFeatured,
      updatePrice: handleUpdatePrice,
      bulkUpdatePrices: handleBulkUpdatePrices,
      getDashboardStats,
      selectedProduct,
      setSelectedProduct,
      isEditModalOpen,
      setIsEditModalOpen,
      isAddModalOpen,
      setIsAddModalOpen
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};
