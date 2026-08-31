import { NavLink } from 'react-router-dom';
import { navigation } from '../../data/navigation';

export default function Navbar() {
  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-7 xl:gap-9">
        {navigation.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `group relative py-2 text-[13px] font-bold uppercase tracking-[0.15em] transition-colors duration-200 ${
                  isActive
                    ? 'text-black'
                    : 'text-neutral-700 hover:text-black'
                } ${
                  item.isSale
                    ? 'text-accent hover:text-accent'
                    : ''
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 w-full origin-left bg-black transition-transform duration-300 ${
                      isActive
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
