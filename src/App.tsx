import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CollectionProvider } from '@/context/CollectionContext';
import { AdminProvider } from '@/context/AdminContext';
import { ToastProvider } from '@/components/Toaster';
import Navbar from '@/components/Navbar';
import AchievementToast from '@/components/AchievementToast';
import Home from '@/pages/Home';
import Collection from '@/pages/Collection';
import ProductDetail from '@/pages/ProductDetail';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CollectionProvider>
        <AdminProvider>
          <ToastProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/collection" element={<Collection />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </Router>
            <AchievementToast />
          </ToastProvider>
        </AdminProvider>
      </CollectionProvider>
    </AuthProvider>
  );
}

export default App;
