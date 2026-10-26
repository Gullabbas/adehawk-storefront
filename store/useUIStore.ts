import { create } from 'zustand';

export type CursorVariant = 'default' | 'drag' | 'view' | 'explore' | 'hidden';

interface UIState {
  isSearchOpen: boolean;
  isMenuOpen: boolean;
  cursorVariant: CursorVariant;
  cursorText: string;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  setCursor: (variant: CursorVariant, text?: string) => void;
}

export const useUIStore = create<UIState>(set => ({
  isSearchOpen: false,
  isMenuOpen: false,
  cursorVariant: 'default',
  cursorText: '',
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set(state => ({ isSearchOpen: !state.isSearchOpen })),
  openMenu: () => set({ isMenuOpen: true }),
  closeMenu: () => set({ isMenuOpen: false }),
  toggleMenu: () => set(state => ({ isMenuOpen: !state.isMenuOpen })),
  setCursor: (cursorVariant, cursorText = '') => set({ cursorVariant, cursorText }),
}));
