import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { cartCount, openCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowSearch(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-sm' : 'border-b border-neutral-200'
      }`}
    >
      <div className="container-kh">
        <div className="flex h-16 items-center justify-between gap-4 sm:h-20">
          {/* Left: logo + mobile menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 text-black lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center" aria-label="KhShop home">
              <img
                src="/logo.svg"
                alt="KhShop"
                className="h-8 w-auto sm:h-9"
                width={120}
                height={36}
              />
            </Link>
          </div>

          {/* Center: nav */}
          <Navbar />

          {/* Right: icons */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              onClick={() => {
                setShowSearch((s) => !s);
              }}
              className="relative flex h-11 w-11 items-center justify-center text-black transition-colors hover:text-neutral-500"
              aria-label={showSearch ? 'Close search' : 'Open search'}
              aria-expanded={showSearch}
            >
              {showSearch ? <X size={21} /> : <Search size={21} />}
            </button>

            <Link
              to={user ? '/account' : '/login'}
              className="hidden h-11 w-11 items-center justify-center text-black transition-colors hover:text-neutral-500 sm:flex"
              aria-label={user ? 'Account' : 'Sign in'}
            >
              <User size={21} />
            </Link>

            <Link
              to="/wishlist"
              className="hidden h-11 w-11 items-center justify-center text-black transition-colors hover:text-neutral-500 sm:flex"
              aria-label="Wishlist"
            >
              <Heart size={21} />
            </Link>

            <button
              onClick={openCart}
              className="relative flex h-11 w-11 items-center justify-center text-black transition-colors hover:text-neutral-500"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={21} />
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 animate-pop items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold leading-none text-white shadow-sm"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="border-t border-neutral-200 bg-white px-4">
          <form
            onSubmit={submitSearch}
            className="container-kh flex items-center gap-3 py-4"
          >
            <Search size={20} className="shrink-0 text-neutral-400" />
            <input
              autoFocus
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shoes, clothing, accessories, sport…"
              className="w-full bg-transparent text-base outline-none placeholder:text-neutral-400"
              aria-label="Search products"
            />
            <kbd className="hidden shrink-0 rounded border border-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-400 sm:block">
              Esc
            </kbd>
            <button type="submit" className="btn-primary shrink-0 px-6 py-2.5">
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
