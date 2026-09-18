
import { useEffect, useState, useRef } from 'react';
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
} from 'lucide-react';

import Navbar from './Navbar';
import MobileMenu from './MobileMenu';
import { useCart } from '../../../store/CartContext';
import { useAuth } from '../../../store/AuthContext';

function getMenuSlugFromPath(pathname) {
  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] === 'products' && segments[1]) {
    return segments[1];
  }

  const slug = segments[0] || null;

  if (!slug || slug === 'product' || slug === 'products' || slug === 'search' || slug === 'cart' || slug === 'wishlist' || slug === 'checkout' || slug === 'login' || slug === 'register' || slug === 'account' || slug === 'admin' || slug === 'shop' || slug === 'category') {
    return null;
  }

  return slug;
}

export default function Header({ navigation = [], onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const { cartCount, openCart } = useCart();
  const { user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const currentMenuSlug = getMenuSlugFromPath(location.pathname);
  const prevPathname = useRef(location.pathname);

  /*
   * Close the search bar and clear the input when the user
   * navigates to a different page (different pathname).
   *
   * This does NOT fire when only the search query changes
   * on the same pathname (e.g. ?search=nike → ?search=shoe).
   */
  useEffect(() => {
    if (prevPathname.current !== location.pathname) {
      setShowSearch(false);
      setSearchQuery('');
      prevPathname.current = location.pathname;
    }
  }, [location.pathname]);

  /*
   * Search can exist as:
   * /products/women?search=nike
   * /search?q=nike
   */
  const searchFromUrl =
    searchParams.get('search') ||
    searchParams.get('q') ||
    '';

  /*
   * Keep search input synchronized with the URL.
   *
   * When the URL has a search value, sync it into the input.
   * When the URL loses the search param (e.g. navigating to
   * another menu), clear the input to match.
   */
  useEffect(() => {
    setSearchQuery(searchFromUrl);
  }, [searchFromUrl]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowSearch(false);
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  /*
   * Scroll to the product section.
   */
  const scrollToProducts = () => {
    setTimeout(() => {
      const section = document.getElementById('products');

      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 150);
  };

  /*
   * Submit search.
   *
   * IMPORTANT:
   * - Keep the search bar open.
   * - Keep searchQuery.
   * - Let Product List react to the URL and fetch.
   */
  const submitSearch = (e) => {
    e.preventDefault();

    const q = searchQuery.trim();

    if (!q) {
      const params = new URLSearchParams(location.search);

      params.delete('search');
      params.delete('q');

      const queryString = params.toString();

      navigate(
        queryString
          ? `${location.pathname}?${queryString}`
          : location.pathname
      );

      setSearchQuery('');
      scrollToProducts();
      return;
    }

    if (currentMenuSlug) {
      navigate(
        `/products/${currentMenuSlug}?search=${encodeURIComponent(q)}`
      );
    } else {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }

    // Keep search bar OPEN.
    // Do not clear searchQuery.

    scrollToProducts();
  };

  const toggleSearch = () => {
    setShowSearch((current) => !current);
  };

  const clearSearch = () => {
    setSearchQuery('');

    const params = new URLSearchParams(location.search);
    params.delete('search');
    params.delete('q');

    const queryString = params.toString();

    navigate(
      queryString
        ? `${location.pathname}?${queryString}`
        : location.pathname
    );

    scrollToProducts();
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white shadow-md transition-shadow duration-300 ${
        scrolled ? 'shadow-lg' : ''
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

            <Link
              to="/"
              className="flex items-center"
              aria-label="KhShop home"
            >
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
          <Navbar navigation={navigation} />

          {/* Right: icons */}
          <div className="flex items-center gap-0.5 sm:gap-1">

            {/* Search toggle */}
            <button
              onClick={toggleSearch}
              className="relative flex h-11 w-11 items-center justify-center text-black transition-colors hover:text-neutral-500"
              aria-label={showSearch ? 'Close search' : 'Open search'}
              aria-expanded={showSearch}
            >
              {showSearch ? (
                <X size={21} />
              ) : (
                <Search size={21} />
              )}
            </button>

            {/* Account */}
            <Link
              to={user ? '/account' : '/login'}
              className="hidden h-11 w-11 items-center justify-center text-black transition-colors hover:text-neutral-500 sm:flex"
              aria-label={user ? 'Account' : 'Sign in'}
            >
              <User size={21} />
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="hidden h-11 w-11 items-center justify-center text-black transition-colors hover:text-neutral-500 sm:flex"
              aria-label="Wishlist"
            >
              <Heart size={21} />
            </Link>

            {/* Cart */}
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
            <Search
              size={20}
              className="shrink-0 text-neutral-400"
            />

            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shoes, clothing, accessories, sport…"
              className="w-full bg-transparent text-base outline-none placeholder:text-neutral-400"
              aria-label="Search products"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="shrink-0 text-neutral-500 transition-colors hover:text-black"
              >
                <X size={18} />
              </button>
            )}

            <kbd className="hidden shrink-0 rounded border border-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-400 sm:block">
              Esc
            </kbd>

            <button
              type="submit"
              className="btn-primary shrink-0 px-6 py-2.5"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        navigation={navigation}
        onLogout={onLogout}
      />
    </header>
  );
}

