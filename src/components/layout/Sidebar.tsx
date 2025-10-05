'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Building2, Users, History, Settings, LogOut, X, Menu } from 'lucide-react';
import { useAuth } from '../../hooks';
import { useTheme } from '../../contexts/ThemeContext';
import { useUIStore } from '../../store/useUIStore';
import { ROUTES } from '../../utils/constants';
import { Button } from '../ui';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

/**
 * Sidebar Navigation Component
 */
export const Sidebar = ({ children }: { children: ReactNode }) => {
  const { logout, user } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { currentPalette } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: Home },
    { name: 'Properties', href: ROUTES.PROPERTIES, icon: Building2 },
    { name: 'Owners', href: ROUTES.OWNERS, icon: Users },
    { name: 'Traces', href: ROUTES.TRACES, icon: History },
    { name: 'Settings', href: ROUTES.SETTINGS, icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    // No need to router.push - logout already handles redirect
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          style={{ backgroundColor: currentPalette.colors.sidebarBg }}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-200">
              <Building2 
                className="h-8 w-8" 
                style={{ color: currentPalette.colors.titleIcon }}
              />
              <span 
                className="text-xl font-bold"
                style={{ color: currentPalette.colors.titleText }}
              >
                Real Estate
              </span>
              <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      router.push(item.href);
                      setSidebarOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200"
                    style={{
                      backgroundColor: isActive 
                        ? currentPalette.colors.sidebarActiveItemBg 
                        : 'transparent',
                      color: isActive 
                        ? currentPalette.colors.sidebarActiveItemText 
                        : currentPalette.colors.sidebarText,
                      borderLeft: isActive 
                        ? `4px solid ${currentPalette.colors.accentBorder}` 
                        : '4px solid transparent',
                      fontWeight: isActive ? 600 : 500,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = currentPalette.colors.sidebarHoverBg;
                        e.currentTarget.style.color = currentPalette.colors.sidebarHoverText;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = currentPalette.colors.sidebarText;
                      }
                    }}
                  >
                    <Icon 
                      className="h-5 w-5" 
                      style={{ color: isActive ? currentPalette.colors.sidebarActiveItemText : currentPalette.colors.menuIcon }}
                    />
                    {item.name}
                  </button>
                );
              })}
            </nav>

            {/* User section */}
            <div className="border-t border-gray-200 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div 
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: currentPalette.colors.titleIcon }}
                >
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p 
                    className="truncate text-sm font-medium"
                    style={{ color: currentPalette.colors.sidebarText }}
                  >
                    {user?.name || 'User'}
                  </p>
                  <p className="truncate text-xs text-gray-500">{user?.email || ''}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm lg:px-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1" />
          </div>

          {/* Page content */}
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </>
  );
};
