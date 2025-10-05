'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ColorPalette {
  id: string;
  name: string;
  colors: {
    sidebarBg: string;
    sidebarText: string;
    sidebarActiveItemBg: string;
    sidebarActiveItemText: string;
    sidebarHoverBg: string;
    sidebarHoverText: string;
    titleText: string;
    titleIcon: string;
    menuIcon: string;
    accentBorder: string;
  };
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'default',
    name: 'Default Blue',
    colors: {
      sidebarBg: '#ffffff',
      sidebarText: '#003366',
      sidebarActiveItemBg: '#003366',
      sidebarActiveItemText: '#ffffff',
      sidebarHoverBg: '#0055a5',
      sidebarHoverText: '#ffffff',
      titleText: '#1f2937',
      titleIcon: '#003366',
      menuIcon: '#6b7280',
      accentBorder: '#FFCC00',
    },
  },
  {
    id: 'green',
    name: 'Green Nature',
    colors: {
      sidebarBg: '#ffffff',
      sidebarText: '#065f46',
      sidebarActiveItemBg: '#059669',
      sidebarActiveItemText: '#ffffff',
      sidebarHoverBg: '#10b981',
      sidebarHoverText: '#ffffff',
      titleText: '#065f46',
      titleIcon: '#10b981',
      menuIcon: '#6b7280',
      accentBorder: '#34d399',
    },
  },
  {
    id: 'purple',
    name: 'Purple Dreams',
    colors: {
      sidebarBg: '#ffffff',
      sidebarText: '#5b21b6',
      sidebarActiveItemBg: '#7c3aed',
      sidebarActiveItemText: '#ffffff',
      sidebarHoverBg: '#8b5cf6',
      sidebarHoverText: '#ffffff',
      titleText: '#5b21b6',
      titleIcon: '#8b5cf6',
      menuIcon: '#6b7280',
      accentBorder: '#a78bfa',
    },
  },
  {
    id: 'orange',
    name: 'Orange Sunset',
    colors: {
      sidebarBg: '#ffffff',
      sidebarText: '#c2410c',
      sidebarActiveItemBg: '#ea580c',
      sidebarActiveItemText: '#ffffff',
      sidebarHoverBg: '#f97316',
      sidebarHoverText: '#ffffff',
      titleText: '#c2410c',
      titleIcon: '#f97316',
      menuIcon: '#6b7280',
      accentBorder: '#fb923c',
    },
  },
  {
    id: 'teal',
    name: 'Teal Ocean',
    colors: {
      sidebarBg: '#ffffff',
      sidebarText: '#115e59',
      sidebarActiveItemBg: '#0f766e',
      sidebarActiveItemText: '#ffffff',
      sidebarHoverBg: '#14b8a6',
      sidebarHoverText: '#ffffff',
      titleText: '#115e59',
      titleIcon: '#14b8a6',
      menuIcon: '#6b7280',
      accentBorder: '#2dd4bf',
    },
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      sidebarBg: '#1f2937',
      sidebarText: '#e5e7eb',
      sidebarActiveItemBg: '#374151',
      sidebarActiveItemText: '#ffffff',
      sidebarHoverBg: '#4b5563',
      sidebarHoverText: '#ffffff',
      titleText: '#f3f4f6',
      titleIcon: '#60a5fa',
      menuIcon: '#9ca3af',
      accentBorder: '#3b82f6',
    },
  },
  {
    id: 'red',
    name: 'Red Energy',
    colors: {
      sidebarBg: '#ffffff',
      sidebarText: '#991b1b',
      sidebarActiveItemBg: '#dc2626',
      sidebarActiveItemText: '#ffffff',
      sidebarHoverBg: '#ef4444',
      sidebarHoverText: '#ffffff',
      titleText: '#991b1b',
      titleIcon: '#ef4444',
      menuIcon: '#6b7280',
      accentBorder: '#f87171',
    },
  },
];

const STORAGE_KEY = 'realestate_theme_palette';

interface ThemeContextType {
  currentPalette: ColorPalette;
  palettes: ColorPalette[];
  changePalette: (paletteId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>(COLOR_PALETTES[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load from localStorage on mount
    const savedPaletteId = localStorage.getItem(STORAGE_KEY);
    if (savedPaletteId) {
      const palette = COLOR_PALETTES.find((p) => p.id === savedPaletteId);
      if (palette) {
        setCurrentPalette(palette);
      }
    }
  }, []);

  const changePalette = (paletteId: string) => {
    const palette = COLOR_PALETTES.find((p) => p.id === paletteId);
    if (palette) {
      setCurrentPalette(palette);
      localStorage.setItem(STORAGE_KEY, paletteId);
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ currentPalette, palettes: COLOR_PALETTES, changePalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
