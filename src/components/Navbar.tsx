import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, User, LayoutDashboard, Menu, X, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCollection } from '@/context/CollectionContext';
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
  useLocation(); // used for future active link tracking
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '#sets', label: 'Sets', internal: false },
    { href: '#database', label: 'Karten-DB', internal: false },
    { href: '#sealed', label: 'Sealed Products', internal: false },
    { href: '#singles', label: 'Singles', internal: false },
    { href: '#accessories', label: 'Zubehör', internal: false },
  ];

  return (
    <nav
      className="fixed top-0 w-full z-50 border-b transition-all duration-300"
      style={{
        background: 'rgba(10, 10, 15, 0.92)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255,255,255,0.05)',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span style={{ color: '#ff3d3d', fontSize: '1.4rem' }}>
            <i className="fas fa-fire" />
          </span>
          <span
            className="font-orbitron font-black text-[1.8rem] leading-none"
            style={{
              background: 'linear-gradient(135deg, #ff3d3d 0%, #ff6b6b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            DI-TRADE
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex gap-10 list-none m-0 p-0">
          {navLinks.map(link => (
            <li key={link.label}>
              <a
                href={link.href}
                className="relative font-medium text-[0.95rem] no-underline transition-colors duration-300 group"
                style={{ color: '#e4e4e7' }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
                <span
                  className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #ff3d3d 0%, #ff6b6b 100%)' }}
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Wishlist */}
          <Link to="/collection" className="relative">
            <button
              className="flex items-center justify-center w-11 h-11 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#e4e4e7',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#ff3d3d';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#ff3d3d';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(255,61,61,0.3)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              <Heart className="w-5 h-5" />
            </button>
            {state.wishlist.length > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: '#ffd700', color: '#0a0a0f' }}
              >
                {state.wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <div className="relative">
            <button
              className="flex items-center justify-center w-11 h-11 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#e4e4e7',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#ff3d3d';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#ff3d3d';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(255,61,61,0.3)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            {state.cart.length > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: '#ffd700', color: '#0a0a0f' }}
              >
                {state.cart.length}
              </span>
            )}
          </div>

          {/* User */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center justify-center w-11 h-11 rounded-xl border-0 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #ff3d3d 0%, #ff6b6b 100%)',
                    color: 'white',
                  }}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-xl object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56"
                style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.1)', color: '#e4e4e7' }}
              >
                <div className="px-2 py-1.5">
                  <p className="text-sm font-semibold" style={{ color: '#e4e4e7' }}>{user.name}</p>
                  <p className="text-xs" style={{ color: '#71717a' }}>{user.email}</p>
                </div>
                <DropdownMenuSeparator style={{ background: 'rgba(255,255,255,0.1)' }} />
                {user.isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 cursor-pointer no-underline"
                        style={{ color: '#e4e4e7' }}
                      >
                        <LayoutDashboard className="w-4 h-4" style={{ color: '#ff3d3d' }} />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator style={{ background: 'rgba(255,255,255,0.1)' }} />
                  </>
                )}
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer"
                  style={{ color: '#ff3d3d' }}
                >
                  Ausloggen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className="no-underline">
              <button
                className="flex items-center justify-center w-11 h-11 rounded-xl border-0 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #ff3d3d 0%, #ff6b6b 100%)',
                  color: 'white',
                }}
              >
                <User className="w-5 h-5" />
              </button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl border cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderColor: 'rgba(255,255,255,0.1)',
              color: '#e4e4e7',
            }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t"
          style={{ background: '#0a0a0f', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="max-w-[1400px] mx-auto px-8 py-6 flex flex-col gap-4">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-base font-medium no-underline transition-colors duration-200"
                style={{ color: '#e4e4e7' }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {user ? (
              <>
                <Link
                  to="/collection"
                  className="text-base font-medium no-underline"
                  style={{ color: '#e4e4e7' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Meine Sammlung
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-base font-medium no-underline flex items-center gap-2"
                    style={{ color: '#ff3d3d' }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="text-base font-medium no-underline flex items-center gap-2"
                style={{ color: '#ff3d3d' }}
                onClick={() => setMobileOpen(false)}
              >
                <Zap className="w-4 h-4" />
                Anmelden
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
