import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Clapperboard,
  Send,
} from 'lucide-react';
import {
  footerShopLinks,
  footerHelpLinks,
  footerAboutLinks,
} from '../../data/navigation';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="container-kh">
        {/* Newsletter */}
        <div className="border-b border-neutral-800 py-14">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
                Join The Movement
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                Subscribe for new drops, exclusive offers and early access.
              </p>
            </div>
            <form onSubmit={subscribe} className="flex w-full max-w-lg flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-neutral-700 bg-transparent px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-white"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="shrink-0 bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-neutral-200"
              >
                Subscribe
              </button>
            </form>
          </div>
          {subscribed && (
            <p className="mt-4 text-sm text-neutral-300" role="status">
              Thanks for subscribing!
            </p>
          )}
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-white">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerShopLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.path}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-white">
              Help
            </h4>
            <ul className="space-y-3">
              {footerHelpLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.path}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-white">
              About
            </h4>
            <ul className="space-y-3">
              {footerAboutLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.path}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-white">
              Social
            </h4>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Facebook', icon: Facebook },
                { label: 'Instagram', icon: Instagram },
                { label: 'TikTok', icon: Clapperboard },
                { label: 'Telegram', icon: Send },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center border border-neutral-700 text-neutral-400 transition-all duration-200 hover:border-white hover:text-black hover:bg-white"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-800 py-7 sm:flex-row">
          <img src="/logo.svg" alt="KhShop" className="h-6 w-auto opacity-80" />
          <p className="text-xs text-neutral-500">
            © 2026 KHSHOP. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">
              Terms
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
