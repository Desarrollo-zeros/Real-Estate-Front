'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/Card';
import {
  ExternalLink,
  RefreshCcw,
  TrendingUp,
  CalendarDays,
  Building2,
  Printer,
  Eye,
  Pencil,
} from 'lucide-react';
import { tracesService, ownerService, propertyService } from '@/services/api';
import { PropertyTraceDto } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import toast from 'react-hot-toast';
import { PrintTraceModal } from './PrintTraceModal';

export function TracesList() {
  const router = useRouter();
  const [traces, setTraces] = useState<PropertyTraceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [printModal, setPrintModal] = useState(false);
  const [selectedTrace, setSelectedTrace] = useState<any>(null);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPages: 0,
    totalCount: 0,
  });

  useEffect(() => {
    fetchTraces();
  }, [pagination.page]);

  const fetchTraces = async () => {
    try {
      setLoading(true);
      const response = await tracesService.getAll(pagination.page, pagination.pageSize);
      setTraces(response.items || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages,
        totalCount: response.totalCount,
      }));
    } catch (error) {
      toast.error('Failed to load traces');
    } finally {
      setLoading(false);
    }
  };

  const getValueClass = (value: number) =>
    value > 0 ? 'text-green-600 font-semibold' : 'text-gray-500';

  const openPrintModal = async (trace: PropertyTraceDto) => {
    try {
      const property = await propertyService.getPropertyById(trace.idProperty);
      const owner = await ownerService.getOwnerById(property.idOwner);

      setSelectedTrace({ trace, property, owner });
      setPrintModal(true);
    } catch {
      toast.error('Error loading trace details');
    }
  };

  const columns = [
    {
      header: 'Property',
      accessorKey: 'propertyName',
      cell: (row: PropertyTraceDto) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">{row.propertyName || 'N/A'}</p>
            <p className="text-sm text-gray-500">{row.propertyAddress || '—'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Date Sale',
      accessorKey: 'dateSale',
      cell: (row: PropertyTraceDto) => (
        <div className="flex items-center gap-2 text-gray-700">
          <CalendarDays className="h-4 w-4 text-gray-400" />
          {formatDate(row.dateSale)}
        </div>
      ),
    },
    {
      header: 'Transaction',
      accessorKey: 'name',
      cell: (row: PropertyTraceDto) => (
        <span className="font-medium text-gray-700">{row.name}</span>
      ),
    },
    {
      header: 'Value',
      accessorKey: 'value',
      cell: (row: PropertyTraceDto) => (
        <span className={getValueClass(row.value)}>{formatCurrency(row.value)}</span>
      ),
    },
    {
      header: 'Tax',
      accessorKey: 'tax',
      cell: (row: PropertyTraceDto) => (
        <span className="text-gray-700">{formatCurrency(row.tax)}</span>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: PropertyTraceDto) => (
        <div className="flex items-center justify-start gap-2">
          <Button
            variant="ghost"
            size="sm"
            title="View Trace"
            onClick={() => router.push(`/properties/${row.idProperty}/traces/${row.id}/edit`)}
            className="hover:bg-blue-50 transition-colors"
          >
            <Pencil className="h-4 w-4 text-blue-600" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            title="Print Trace"
            onClick={() => openPrintModal(row)}
            className="hover:bg-blue-50 transition-colors"
          >
            <Printer className="h-4 w-4 text-blue-600" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            title="View Property"
            onClick={() => router.push(`/properties/${row.idProperty}`)}
            className="hover:bg-blue-50 transition-colors"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card className="shadow-md border border-neutral-200 rounded-xl bg-white">
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gradient-to-r from-blue-50 to-transparent rounded-t-xl border-b border-gray-200">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <TrendingUp className="text-blue-600 h-6 w-6" />
              Property Traces
            </CardTitle>
            <p className="text-gray-500 text-sm mt-1">
              Track sales history, transactions, and property updates
            </p>
          </div>
          <Button
            variant="outline"
            onClick={fetchTraces}
            className="flex items-center gap-2 border-gray-300 hover:border-blue-400"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin text-blue-500' : ''}`} />
            Refresh
          </Button>
        </CardHeader>

        {/* Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm border-b border-gray-200">
                  {columns.map((col) => (
                    <th key={col.header} className="px-6 py-3 text-left font-semibold">
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-6 text-gray-400"
                    >
                      Loading traces...
                    </td>
                  </tr>
                ) : traces.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-10 text-gray-500"
                    >
                      No traces found
                    </td>
                  </tr>
                ) : (
                  traces.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-blue-50 border-b border-gray-100 transition"
                    >
                      {columns.map((col, i) => (
                        <td key={i} className="px-6 py-4 text-sm">
                          {col.cell ? col.cell(row) : (row as any)[col.accessorKey]}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm text-gray-600 bg-white">
            <p>
              Page {pagination.page} of {pagination.totalPages || 1} ({pagination.totalCount} total)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Print Modal */}
      {printModal && selectedTrace && (
        <PrintTraceModal
          trace={selectedTrace.trace}
          property={selectedTrace.property}
          owner={selectedTrace.owner}
          onClose={() => setPrintModal(false)}
        />
      )}
    </>
  );
}
