import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { label: 'Dashboard', path: '/account', icon: LayoutDashboard, end: true },
  { label: 'Profile', path: '/account/profile', icon: User },
  { label: 'Orders', path: '/account/orders', icon: Package },
  { label: 'Addresses', path: '/account/addresses', icon: MapPin },
  { label: 'Wishlist', path: '/wishlist', icon: Heart },
];

export default function AccountLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <main className="bg-neutral-50">
      <div className="container-kh py-12 sm:py-16">
        <h1 className="heading-display text-4xl sm:text-5xl">My Account</h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside>
            <div className="sticky top-28">
              <div className="mb-6 border border-neutral-200 bg-white p-6 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </span>
                <p className="mt-3 font-display font-bold text-neutral-900">
                  {user?.name || 'Guest'}
                </p>
                <p className="text-sm text-neutral-500">{user?.email}</p>
              </div>

              <nav className="border border-neutral-200 bg-white" aria-label="Account">
                <ul>
                  {links.map((l) => (
                    <li key={l.path} className="border-b border-neutral-100 last:border-0">
                      <NavLink
                        to={l.path}
                        end={l.end}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-black text-white'
                              : 'text-neutral-700 hover:bg-neutral-50'
                          }`
                        }
                      >
                        <l.icon size={17} />
                        {l.label}
                      </NavLink>
                    </li>
                  ))}
                  <li className="border-t border-neutral-100">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

          <div>{children}</div>
        </div>
      </div>
    </main>
  );
}
