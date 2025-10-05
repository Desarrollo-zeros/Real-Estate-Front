'use client';

import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/Button';
import { X, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { getPropertyImageUrl } from '@/utils/imageUrl';
import { PropertyDto, OwnerDto, PropertyTraceDto } from '@/types';
import { useRef } from 'react';

interface PrintTraceModalProps {
  trace: PropertyTraceDto;
  property: PropertyDto;
  owner: OwnerDto;
  onClose: () => void;
}

export function PrintTraceModal({ trace, property, owner, onClose }: PrintTraceModalProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  // react-to-print hook
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `PropertyTrace-${property.name}`,
    pageStyle: `
      @page { size: A4; margin: 1cm; }
      body { -webkit-print-color-adjust: exact !important; }
    `,
  });

  const publicUrl = `${window.location.origin}/traces/${trace.id}`;
  const barcodeValue = `TRACE-${trace.id.substring(0, 12).toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-[900px] max-w-[95vw] max-h-[90vh] overflow-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold text-gray-800">Print Property Trace</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* PRINTABLE SECTION */}
        <div ref={componentRef} className="p-8 print:p-0 bg-white">
          {/* Header */}
          <div className="text-center mb-8 border-b-4 border-primary pb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">
              PROPERTY TRACE CERTIFICATE
            </h1>
            <p className="text-gray-600 text-sm">Real Estate Management System</p>
            <p className="text-gray-500 text-xs mt-1">Transaction Record & Sale History</p>
          </div>

          {/* GRID CONTENT */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Left - Image + QR */}
            <div className="col-span-1">
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-md">
                {property.images?.length ? (
                  <img
                    src={getPropertyImageUrl(property.images[0].file)}
                    alt={property.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>
              <div className="mt-4 border-2 border-blue-200 rounded-lg p-4 bg-blue-50 text-center">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  SCAN TO VIEW ONLINE
                </p>
                <div className="flex justify-center bg-white p-3 rounded">
                  <QRCodeSVG value={publicUrl} size={120} level="H" />
                </div>
                <p className="text-xs text-gray-500 mt-2 break-all">{publicUrl}</p>
              </div>
            </div>

            {/* Right - Details */}
            <div className="col-span-2 space-y-6">
              {/* Owner Info */}
              <section className="bg-gradient-to-r from-green-50 to-white border-l-4 border-green-500 p-4 rounded-r-lg">
                <h3 className="text-sm font-bold text-green-700 uppercase mb-3">
                  Property Owner
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Name</p>
                    <p className="font-semibold text-gray-800">{owner.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Birthday</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(owner.birthday)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 text-xs">Address</p>
                    <p className="font-semibold text-gray-800">{owner.address}</p>
                  </div>
                </div>
              </section>

              {/* Property Info */}
              <section className="bg-gradient-to-r from-blue-50 to-white border-l-4 border-blue-500 p-4 rounded-r-lg">
                <h3 className="text-sm font-bold text-blue-700 uppercase mb-3">
                  Property Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Property Name</p>
                    <p className="font-semibold text-gray-800">{property.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Internal Code</p>
                    <p className="font-semibold text-gray-800">
                      {property.codeInternal}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Year Built</p>
                    <p className="font-semibold text-gray-800">{property.year}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Current Price</p>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(property.price)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 text-xs">Address</p>
                    <p className="font-semibold text-gray-800">{property.address}</p>
                  </div>
                </div>
              </section>

              {/* Transaction Info */}
              <section className="bg-gradient-to-r from-orange-50 to-white border-l-4 border-orange-500 p-4 rounded-r-lg">
                <h3 className="text-sm font-bold text-orange-700 uppercase mb-3">
                  Transaction Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Transaction Name</p>
                    <p className="font-semibold text-gray-800">{trace.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Sale Date</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(trace.dateSale)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Sale Value</p>
                    <p className="font-bold text-green-600 text-lg">
                      {formatCurrency(trace.value)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Tax Amount</p>
                    <p className="font-bold text-orange-600 text-lg">
                      {formatCurrency(trace.tax)}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Barcode */}
          <div className="border-t-2 border-gray-200 pt-6 mt-6 text-center">
            <p className="text-xs text-gray-500 mb-2">TRACE IDENTIFICATION CODE</p>
            <div className="flex justify-center">
              <Barcode value={barcodeValue} width={2} height={60} fontSize={12} />
            </div>
            <p className="text-xs text-gray-600 mt-2">Trace ID: {trace.id}</p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Generated on {new Date().toLocaleDateString()} at{' '}
              {new Date().toLocaleTimeString()}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              This is an official document from Real Estate Management System
            </p>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 print:hidden">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Document
          </Button>
        </div>
      </div>
    </div>
  );
}
  