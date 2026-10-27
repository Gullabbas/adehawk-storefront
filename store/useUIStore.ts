import { create } from 'zustand';

export type CursorVariant = 'default' | 'drag' | 'view' | 'explore' | 'hidden';

interface UIState {
  isSearchOpen: boolean;
  isMenuOpen: boolean;
  is3DViewerOpen: boolean;
  cursorVariant: CursorVariant;
  cursorText: string;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  open3DViewer: () => void;
  close3DViewer: () => void;
  toggle3DViewer: () => void;
  setCursor: (variant: CursorVariant, text?: string) => void;
}

export const useUIStore = create<UIState>(set => ({
  isSearchOpen: false,
  isMenuOpen: false,
  is3DViewerOpen: false,
  cursorVariant: 'default',
  cursorText: '',
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set(state => ({ isSearchOpen: !state.isSearchOpen })),
  openMenu: () => set({ isMenuOpen: true }),
  closeMenu: () => set({ isMenuOpen: false }),
  toggleMenu: () => set(state => ({ isMenuOpen: !state.isMenuOpen })),
  open3DViewer: () => set({ is3DViewerOpen: true, isMenuOpen: false }),
  close3DViewer: () => set({ is3DViewerOpen: false }),
  toggle3DViewer: () => set(state => ({ is3DViewerOpen: !state.is3DViewerOpen, isMenuOpen: false })),
  setCursor: (cursorVariant, cursorText = '') => set({ cursorVariant, cursorText }),
}));
