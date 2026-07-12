'use client';

import { createContext, useContext } from 'react';

// The slice of catalog taxonomy the desktop navbar mega-menu needs. Fetched once
// in the root layout (like SiteSettingsProvider) and shared with every Navbar so
// the dropdowns work on any page without threading props through each wrapper.
export type NavCategory = {
  id: string;
  name: string;
  image: string;
  hasProducts: boolean;
  comingSoon?: boolean;
};

export type NavCollection = {
  id: string;
  name: string;
  description?: string;
  image: string;
  hasProducts: boolean;
};

export type CatalogNav = {
  categories: NavCategory[];
  collections: NavCollection[];
};

const CatalogNavContext = createContext<CatalogNav>({ categories: [], collections: [] });

export function CatalogNavProvider({
  value,
  children,
}: {
  value: CatalogNav;
  children: React.ReactNode;
}) {
  return <CatalogNavContext.Provider value={value}>{children}</CatalogNavContext.Provider>;
}

/** Categories + collections for the navbar dropdowns (empty until Sanity is wired). */
export function useCatalogNav(): CatalogNav {
  return useContext(CatalogNavContext);
}
