import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ChevronDown, ChevronRight, Heart, User } from 'lucide-react';
import { navigation } from '../../data/navigation';
import { useAuth } from '../../context/AuthContext';

export default function MobileMenu({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      setExpanded(null);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  if (!open) return null;

  const toggle = (name) =>
    setExpanded((cur) => (cur === name ? null : name));

  return (
    <div
      className="fixed inset-0 z-[90] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in-overlay"
        onClick={onClose}
      />
      <div className="absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white animate-slide-in-left">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <img src="/logo.svg" alt="KhShop" className="h-7 w-auto" />
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 transition-colors hover:text-black"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Mobile">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isOpen = expanded === item.name;
              return (
                <li key={item.name}>
                  <div className="flex items-center">
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`flex-1 px-2 py-3 text-base font-bold uppercase tracking-[0.15em] ${
                        item.isSale ? 'text-accent' : 'text-neutral-900'
                      }`}
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => toggle(item.name)}
                      className="flex h-10 w-12 items-center justify-center text-neutral-500 transition-colors hover:text-black"
                      aria-label={isOpen ? `Collapse ${item.name}` : `Expand ${item.name}`}
                      aria-expanded={isOpen}
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>

                  {isOpen && (
                    <ul className="ml-3 border-l border-neutral-200 pl-3">
                      {item.categories.map((cat) => (
                        <li key={cat.path}>
                          <Link
                            to={cat.path}
                            onClick={onClose}
                            className="flex items-center justify-between px-2 py-2.5 text-sm text-neutral-600 transition-colors hover:text-black"
                          >
                            {cat.name}
                            <ChevronRight size={14} className="text-neutral-300" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="my-6 h-px bg-neutral-200" />

          <ul className="space-y-1">
            <li>
              <Link
                to="/wishlist"
                onClick={onClose}
                className="flex items-center gap-3 px-2 py-3 text-base font-semibold uppercase tracking-widest text-neutral-700 hover:text-black"
              >
                <Heart size={18} /> Wishlist
              </Link>
            </li>
            <li>
              <Link
                to={user ? '/account' : '/login'}
                onClick={onClose}
                className="flex items-center gap-3 px-2 py-3 text-base font-semibold uppercase tracking-widest text-neutral-700 hover:text-black"
              >
                <User size={18} /> Account
              </Link>
            </li>
            {user && (
              <li>
                <button
                  onClick={handleLogout}
                  className="block w-full px-2 py-3 text-left text-base font-semibold uppercase tracking-widest text-neutral-700 hover:text-black"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>

        <div className="border-t border-neutral-200 px-5 py-4 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
            Move Different. Wear KhShop.
          </p>
        </div>
      </div>
    </div>
  );
}
