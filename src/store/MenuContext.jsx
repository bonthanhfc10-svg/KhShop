import { createContext, useContext } from 'react';

const MenuContext = createContext({ navigation: [], rawMenus: [], menuLoading: true });

export function MenuProvider({ value, children }) {
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenus() {
  return useContext(MenuContext);
}

export default MenuContext;
