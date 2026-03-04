import { Link } from 'react-router-dom';
import { Flame, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <Flame className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">
                DI-TRADE
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Dein One Piece TCG Marketplace. Verwalte deine Sammlung, tracke Preise und finde die besten Deals.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/collection" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Meine Sammlung
                </Link>
              </li>
              <li>
                <span className="text-sm text-muted-foreground/50 cursor-not-allowed">
                  Preise (bald)
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground/50 cursor-not-allowed">
                  Deals (bald)
                </span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Mehr</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/Magaloko/di-trade-onepiece"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub
                </a>
              </li>
              <li>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Anmelden
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} DI-TRADE. Alle Rechte vorbehalten.
          </p>
          <p className="text-xs text-muted-foreground">
            One Piece TCG ist ein Markenzeichen von Bandai.
          </p>
        </div>
      </div>
    </footer>
  );
}
