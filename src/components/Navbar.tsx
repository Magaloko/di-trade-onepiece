import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Flame, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCollection } from '@/context/CollectionContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { state } = useCollection();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Marketplace' },
    { path: '/collection', label: 'Meine Sammlung' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <Flame className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-bold text-2xl bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">
              DI-TRADE
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.path) ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {link.label}
              </Link>
            ))}
            <span className="text-muted-foreground/50 cursor-not-allowed text-sm font-medium">
              Preise
            </span>
            <span className="text-muted-foreground/50 cursor-not-allowed text-sm font-medium">
              Deals
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="rounded-xl hidden sm:flex">
              <Search className="w-5 h-5" />
            </Button>

            <Link to="/collection">
              <Button variant="outline" size="icon" className="rounded-xl relative">
                <Heart className="w-5 h-5" />
                {state.wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
                    {state.wishlist.length}
                  </span>
                )}
              </Button>
            </Link>

            <Button variant="outline" size="icon" className="rounded-xl relative">
              <ShoppingCart className="w-5 h-5" />
              {state.cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
                  {state.cart.length}
                </span>
              )}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-4 rounded-xl">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-muted" />
                    <span className="hidden lg:inline text-sm font-medium">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {user.isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                    Ausloggen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button className="rounded-xl gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Anmelden</span>
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-in fade-in slide-in-from-right">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 py-3 text-sm text-muted-foreground/50">Preise (bald)</div>
            <div className="px-4 py-3 text-sm text-muted-foreground/50">Deals (bald)</div>
          </div>
        </div>
      )}
    </nav>
  );
}
