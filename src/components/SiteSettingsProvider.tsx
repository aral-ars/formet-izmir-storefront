'use client';

import { createContext, useContext } from 'react';
import { CONTACT, type Contact } from '../data';

// Site-wide contact / showroom details, fetched once in the root layout and
// shared with the client components that render them (Location, MobileMenu,
// the WhatsApp order CTAs, locate-us). Defaults to the local CONTACT so any
// component used outside the provider (or inside Studio) still renders.
const SiteSettingsContext = createContext<Contact>(CONTACT);

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: Contact;
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

/** Site-wide contact / showroom details (Sanity, or local CONTACT fallback). */
export function useContact(): Contact {
  return useContext(SiteSettingsContext);
}
