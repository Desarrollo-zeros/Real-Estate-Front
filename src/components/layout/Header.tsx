import { Menu, Bell, Search } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useAuth } from '../../hooks';

/**
 * Header Component
 */
export const Header = () => {
  const { toggleSidebar } = useUIStore();
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-text-light hover:text-text transition-colors lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search bar */}
          <div className="hidden md:flex items-center gap-2 bg-neutral-100 rounded-lg px-4 py-2 w-96">
            <Search className="h-5 w-5 text-text-light" />
            <input
              type="text"
              placeholder="Search properties, owners..."
              className="bg-transparent border-none outline-none flex-1 text-sm"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative text-text-light hover:text-text transition-colors">
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* User menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-text">{user?.username}</p>
              <p className="text-xs text-text-light">{user?.roles[0]}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {user?.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
