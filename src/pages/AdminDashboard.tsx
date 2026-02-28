import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import AdminStats from '@/components/admin/AdminStats';
import ProductTable from '@/components/admin/ProductTable';
import ProductEditModal from '@/components/admin/ProductEditModal';
import AddProductModal from '@/components/admin/AddProductModal';
import PriceManager from '@/components/admin/PriceManager';
import SetsManager from '@/components/admin/SetsManager';
import type { FeaturedType } from '@/types';
import {
  LayoutDashboard, Plus, Package, Euro, Settings,
  Layers, Star, TrendingUp, TrendingDown, Minus,
} from 'lucide-react';

type Tab = 'products' | 'prices' | 'sets' | 'featured' | 'settings';

const featuredTypeOptions: { value: FeaturedType; label: string }[] = [
  { value: 'new', label: 'Neu' },
  { value: 'sale', label: 'Sale' },
  { value: 'rare', label: 'Rare' },
  { value: 'promo', label: 'Promo' },
];

function TabButton({ id, label, icon, activeTab, setActiveTab }: {
  id: Tab; label: string; icon: React.ReactNode;
  activeTab: Tab; setActiveTab: (t: Tab) => void;
}) {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border-0"
      style={
        isActive
          ? { background: 'linear-gradient(135deg,#ff3d3d,#ff6b6b)', color: '#fff' }
          : { background: 'rgba(255,255,255,0.04)', color: '#71717a' }
      }
    >
      {icon}
      {label}
    </button>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    products,
    selectedProduct, setSelectedProduct,
    isEditModalOpen, setIsEditModalOpen,
    isAddModalOpen, setIsAddModalOpen,
    toggleFeatured,
    getDashboardStats,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<Tab>('products');

  useEffect(() => {
    if (!user?.isAdmin) navigate('/');
  }, [user, navigate]);

  if (!user?.isAdmin) return null;

  const handleEdit = (product: typeof selectedProduct) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const stats = getDashboardStats();
  const featuredProducts = products.filter(p => p.featured).sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999));
  const nonFeaturedProducts = products.filter(p => !p.featured);

  return (
    <div
      className="min-h-screen pt-24 pb-16"
      style={{ background: '#050508' }}
    >
      <div className="max-w-[1400px] mx-auto px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1
              className="font-orbitron font-black text-4xl mb-2 flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg,#ff3d3d,#ff6b6b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              <LayoutDashboard style={{ color: '#ff3d3d', WebkitTextFillColor: '#ff3d3d' }} />
              Admin Dashboard
            </h1>
            <p style={{ color: '#71717a' }}>Verwalte Karten, Preise, Sets und Featured-Produkte</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white border-0 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#ff3d3d,#ff6b6b)', boxShadow: '0 4px 15px rgba(255,61,61,0.4)' }}
          >
            <Plus className="w-5 h-5" />
            Neue Karte
          </button>
        </div>

        {/* Stats */}
        <div className="mb-10">
          <AdminStats />
        </div>

        {/* Extra Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Sets gesamt', value: stats.totalSets, icon: <Layers className="w-5 h-5" />, color: '#a78bfa' },
            { label: 'Sets auf Lager', value: stats.inStockSets, icon: <Package className="w-5 h-5" />, color: '#22c55e' },
            { label: 'Preis gestiegen', value: stats.priceUpCount, icon: <TrendingUp className="w-5 h-5" />, color: '#22c55e' },
            { label: 'Preis gefallen', value: stats.priceDownCount, icon: <TrendingDown className="w-5 h-5" />, color: '#ef4444' },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 border"
              style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm" style={{ color: '#71717a' }}>{s.label}</span>
                <span style={{ color: s.color }}>{s.icon}</span>
              </div>
              <span className="font-orbitron font-black text-3xl" style={{ color: s.color }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <TabButton id="products" label="Produkte" icon={<Package className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="prices" label="Preise" icon={<Euro className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="sets" label="Sets" icon={<Layers className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="featured" label="Featured" icon={<Star className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="settings" label="Einstellungen" icon={<Settings className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Tab Content */}
        <div
          className="rounded-2xl p-8 border"
          style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.07)' }}
        >

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              <h2 className="text-xl font-bold mb-6" style={{ color: '#e4e4e7' }}>Produktverwaltung</h2>
              <ProductTable products={products} onEdit={handleEdit} />
            </div>
          )}

          {/* Prices Tab */}
          {activeTab === 'prices' && (
            <div className="grid md:grid-cols-2 gap-8">
              <PriceManager />
              <div>
                <h3 className="text-lg font-bold mb-4" style={{ color: '#e4e4e7' }}>Preis-Statistiken</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Höchster Preis', value: `€${Math.max(...products.map(p => p.price)).toFixed(2)}`, color: '#22c55e' },
                    { label: 'Niedrigster Preis', value: `€${Math.min(...products.map(p => p.price)).toFixed(2)}`, color: '#e4e4e7' },
                    { label: 'Durchschnittspreis', value: `€${(products.reduce((s, p) => s + p.price, 0) / products.length).toFixed(2)}`, color: '#ffd700' },
                    { label: 'Gesamtwert', value: `€${products.reduce((s, p) => s + p.price, 0).toFixed(2)}`, color: '#ff3d3d' },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-4 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                      <span style={{ color: '#71717a' }}>{row.label}</span>
                      <span className="font-bold" style={{ color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sets Tab */}
          {activeTab === 'sets' && <SetsManager />}

          {/* Featured Tab */}
          {activeTab === 'featured' && (
            <div>
              <h2 className="text-xl font-bold mb-6" style={{ color: '#e4e4e7' }}>
                Featured Karten verwalten
              </h2>

              {/* Currently Featured */}
              <div className="mb-8">
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: '#ffd700' }}>
                  <Star className="w-4 h-4" />
                  Aktuell featured ({featuredProducts.length})
                </h3>
                <div className="space-y-3">
                  {featuredProducts.map(p => (
                    <div
                      key={p.id}
                      className="flex items-center gap-4 p-4 rounded-xl border"
                      style={{ background: 'rgba(255,215,0,0.05)', borderColor: 'rgba(255,215,0,0.15)' }}
                    >
                      <img src={p.image} alt={p.name} className="w-12 h-16 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate" style={{ color: '#e4e4e7' }}>{p.name}</p>
                        <p className="text-xs" style={{ color: '#71717a' }}>{p.number} · Platz #{p.featuredOrder}</p>
                      </div>
                      {/* Type selector */}
                      <select
                        value={p.featuredType || 'promo'}
                        onChange={e => toggleFeatured(p.id, true, e.target.value as FeaturedType, p.featuredOrder)}
                        className="text-sm rounded-lg px-3 py-1.5 border cursor-pointer"
                        style={{ background: '#050508', borderColor: 'rgba(255,255,255,0.15)', color: '#e4e4e7' }}
                      >
                        {featuredTypeOptions.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => toggleFeatured(p.id, false)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer"
                        style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
                      >
                        <Minus className="w-3 h-3" />
                        Entfernen
                      </button>
                    </div>
                  ))}
                  {featuredProducts.length === 0 && (
                    <p className="text-sm" style={{ color: '#71717a' }}>Keine featured Karten.</p>
                  )}
                </div>
              </div>

              {/* Add to featured */}
              <div>
                <h3 className="text-base font-semibold mb-4" style={{ color: '#a1a1aa' }}>
                  Als Featured hinzufügen ({nonFeaturedProducts.length} verfügbar)
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {nonFeaturedProducts.map(p => (
                    <div
                      key={p.id}
                      className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      <img src={p.image} alt={p.name} className="w-10 h-14 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" style={{ color: '#e4e4e7' }}>{p.name}</p>
                        <p className="text-xs" style={{ color: '#71717a' }}>
                          {p.number} · €{p.price}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleFeatured(p.id, true, 'promo', featuredProducts.length + 1)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all"
                        style={{ background: 'rgba(255,215,0,0.1)', color: '#ffd700' }}
                      >
                        <Star className="w-3 h-3" />
                        Featured
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-bold mb-6" style={{ color: '#e4e4e7' }}>Dashboard Einstellungen</h2>

              <div className="space-y-4">
                {[
                  { title: 'Admin-Zugangsdaten', desc: 'Änderungen am Admin-Passwort und Benutzerdaten', badge: 'Bald verfügbar' },
                  { title: 'Benachrichtigungen', desc: 'E-Mail Alerts bei Preisänderungen und neuen Bestellungen', badge: 'Bald verfügbar' },
                  { title: 'Export / Import', desc: 'Karten-Datenbank als CSV exportieren oder importieren', badge: 'Bald verfügbar' },
                  { title: 'API Konfiguration', desc: 'Externe APIs für automatisches Preis-Tracking verbinden', badge: 'Bald verfügbar' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-5 rounded-xl border"
                    style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    <div>
                      <p className="font-semibold" style={{ color: '#e4e4e7' }}>{item.title}</p>
                      <p className="text-sm mt-1" style={{ color: '#71717a' }}>{item.desc}</p>
                    </div>
                    <span
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ background: 'rgba(255,61,61,0.1)', color: '#ff3d3d' }}
                    >
                      {item.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProductEditModal
        product={selectedProduct}
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedProduct(null); }}
      />
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
