'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit,
  Trash2,
  UserCircle,
  ChevronUp,
  ChevronDown,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ownersService } from '@/services/api';
import { useAuth } from '@/hooks';
import { getOwnerPhotoUrl } from '@/utils/imageUrl';
import { formatDate } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';
import toast from 'react-hot-toast';

import { OwnerDto } from '@/types';

export function OwnersList() {
  const [owners, setOwners] = useState<OwnerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const router = useRouter();

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const response = await ownersService.getOwners();
      setOwners(response.items || []);
    } catch (error) {
      toast.error('Failed to load owners');
    } finally {
      setLoading(false);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const sortedOwners = useMemo(() => {
    const sorted = [...owners];
    sorted.sort((a, b) => {
      const nameA = a.name?.toLowerCase() || '';
      const nameB = b.name?.toLowerCase() || '';
      return sortOrder === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
    return sorted;
  }, [owners, sortOrder]);

  const handleEdit = (id: string) => router.push(`${ROUTES.OWNERS}/${id}/edit`);
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this owner?')) return;
    try {
      await ownersService.deleteOwner(id);
      toast.success('Owner deleted');
      fetchOwners();
    } catch {
      toast.error('Failed to delete owner');
    }
  };

  return (
    <Card className="shadow-md border border-gray-200 rounded-xl bg-white">
      {/* Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-t-xl border-b border-gray-100">
        <div>
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <User className="text-blue-600 h-6 w-6" />
            Owners
          </CardTitle>
          <p className="text-gray-500 text-sm mt-1">
            Manage property owners ({owners.length} total)
          </p>
        </div>
        <Button
          onClick={() => router.push(`${ROUTES.OWNERS}/create`)}
          className="bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Owner
        </Button>
      </CardHeader>

      {/* Table */}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="px-6 py-3 text-left w-[60px] font-semibold">#</th>
                <th
                  className="px-6 py-3 cursor-pointer select-none font-semibold"
                  onClick={toggleSortOrder}
                >
                  <div className="flex items-center gap-1">
                    Name
                    {sortOrder === 'asc' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left font-semibold">Address</th>
                <th className="px-6 py-3 text-left font-semibold">Birthday</th>
                <th className="px-6 py-3 text-right pr-8 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-400"
                  >
                    Loading owners...
                  </td>
                </tr>
              ) : sortedOwners.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-gray-500"
                  >
                    No owners found
                  </td>
                </tr>
              ) : (
                sortedOwners.map((row, index) => (
                  <tr
                    key={row.idOwner}
                    className="hover:bg-blue-50 border-b border-gray-100 transition"
                  >
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3 text-gray-800">
                      {row.photo ? (
                        <img
                          src={getOwnerPhotoUrl(row.photo)}
                          alt={row.name}
                          className="h-9 w-9 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                          {row.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      )}
                      <button
                        onClick={() =>
                          router.push(`${ROUTES.OWNERS}/${row.idOwner}`)
                        }
                        className="font-semibold text-blue-600 hover:underline transition"
                      >
                        {row.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {row.address || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {row.birthday ? formatDate(row.birthday) : '—'}
                    </td>
                    <td className="px-6 py-4 text-right pr-8">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`${ROUTES.OWNERS}/${row.idOwner}`)
                          }
                          className="hover:bg-blue-50"
                        >
                          <UserCircle className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(row.idOwner)}
                          className="hover:bg-yellow-50"
                        >
                          <Edit className="h-4 w-4 text-amber-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(row.idOwner)}
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
