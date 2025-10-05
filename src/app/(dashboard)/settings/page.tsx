'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks';
import { useTheme } from '@/contexts/ThemeContext';
import { Save, User, Lock, Palette, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { ChangePasswordModal } from '@/components/modals/ChangePasswordModal';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Settings Page
 */
export default function SettingsPage() {
  const { user } = useAuth();
  const { currentPalette, palettes, changePalette } = useTheme();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const { updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    // Validate form
    if (!formData.username || !formData.email) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSaving(true);
    try {
      const { userService } = await import('@/services/api');
      
      // Call API to update profile
      await userService.updateProfile({
        name: formData.username,
        email: formData.email,
      });

      // Update user in store and localStorage
      updateUser({ 
        name: formData.username, 
        email: formData.email 
      });
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePaletteChange = (paletteId: string) => {
    changePalette(paletteId);
    toast.success('Color palette updated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">Settings</h1>
        <p className="text-text-light mt-1">Manage your account preferences and appearance</p>
      </div>

      {/* Color Palette Settings */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-bold">Color Palette</h2>
              <p className="text-sm text-gray-500">Customize the sidebar and menu colors</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {palettes.map((palette) => (
              <div
                key={palette.id}
                onClick={() => handlePaletteChange(palette.id)}
                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-lg ${
                  currentPalette.id === palette.id
                    ? 'border-blue-500 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Selected indicator */}
                {currentPalette.id === palette.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}

                {/* Palette name */}
                <h3 className="font-semibold text-gray-800 mb-3">{palette.name}</h3>

                {/* Color preview */}
                <div className="space-y-2">
                  {/* Sidebar preview */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: palette.colors.sidebarBg }}
                      title="Sidebar Background"
                    />
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: palette.colors.sidebarActiveItemBg }}
                      title="Active Item"
                    />
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: palette.colors.titleIcon }}
                      title="Title Icon"
                    />
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: palette.colors.accentBorder }}
                      title="Accent"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Preview: Sidebar • Active • Icon • Accent
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Profile Settings */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Profile Information</h2>
          </div>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter your username"
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                disabled={saving}
              />
            </div>
            <div className="pt-4">
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="w-full md:w-auto"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-bold">Security</h2>
              <p className="text-sm text-gray-500">Manage your password and security settings</p>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={() => setShowPasswordModal(true)}
            className="gap-2"
          >
            <Lock className="h-4 w-4" />
            Change Password
          </Button>
        </div>
      </Card>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}
