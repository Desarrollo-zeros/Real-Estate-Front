'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Building2,
  Calendar,
  DollarSign,
  Receipt,
  MapPin,
  Home,
  ShieldCheck,
  FileText,
  User,
  Globe,
  Gift,
} from 'lucide-react';
import { tracesService, propertyService, ownerService } from '@/services/api';
import { guestAuthService } from '@/services/api/guestAuthService';
import { PropertyTraceDto, PropertyDto, OwnerDto } from '@/types';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { getPropertyImageUrl } from '@/utils/imageUrl';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';

export default function PublicTracePage() {
  const params = useParams();
  const id = params?.id as string;
  const [trace, setTrace] = useState<PropertyTraceDto | null>(null);
  const [property, setProperty] = useState<PropertyDto | null>(null);
  const [owner, setOwner] = useState<OwnerDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ip, setIp] = useState<string>('Fetching...');

  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();

    const fetchIP = async () => {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        if (isMounted) {
          setIp(data.ip);
        }
      } catch {
        if (isMounted) {
          setIp('Unavailable');
        }
      }
    };

    const loadTraceData = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        
        // Get guest token for public access
        const guestToken = await guestAuthService.getGuestToken();
        // Store in localStorage so apiClient interceptor can use it
        localStorage.setItem('realestate_auth_token', guestToken);
        
        const traceData = await tracesService.getPublicTraceById(id);
        if (!isMounted || controller.signal.aborted) return;
        setTrace(traceData);

        if (traceData.idProperty) {
          const propertyData = await propertyService.getPropertyById(traceData.idProperty);
          if (!isMounted || controller.signal.aborted) return;
          setProperty(propertyData);

          // Fetch Owner info
          if (propertyData.idOwner) {
            try {
              const ownerData = await ownerService.getOwnerById(propertyData.idOwner);
              if (isMounted && !controller.signal.aborted) {
                setOwner(ownerData);
              }
            } catch (err) {
              console.warn('Owner not found or failed to load');
            }
          }
        }
      } catch (err: any) {
        if (!controller.signal.aborted && isMounted) {
          setError(err.message || 'Failed to load trace');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTraceData();
    fetchIP();

    return () => {
      isMounted = false;
      controller.abort();
      // Clear guest token when leaving the page
      // This ensures it doesn't interfere with normal user authentication
      const token = localStorage.getItem('realestate_auth_token');
      const guestToken = localStorage.getItem('realestate_guest_token');
      if (token === guestToken) {
        localStorage.removeItem('realestate_auth_token');
      }
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !trace) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white p-6">
        <Card className="max-w-md w-full shadow-2xl border border-red-100">
          <CardContent className="p-10 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Trace Not Found</h1>
            <p className="text-gray-600">{error || 'The requested trace could not be loaded.'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-14 px-4">
      <motion.div
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#001F3D] via-[#003366] to-[#012D5A] text-white py-16 text-center overflow-hidden">
          {/* Textured overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-5">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/40 blur-md rounded-full"></div>
              <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-500 p-4 rounded-full shadow-lg ring-4 ring-white/10">
                <ShieldCheck className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
            </div>

            <h1 className="text-4xl font-extrabold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white drop-shadow-sm">
              Property Trace Certificate
            </h1>

            <p className="text-sm text-gray-200 font-medium tracking-wide">
              Official Record of Real Estate Transaction
            </p>

            <div className="w-24 h-[2px] bg-gradient-to-r from-yellow-400 to-transparent mx-auto mt-2 rounded-full" />
          </div>
        </div>

        {/* Property Image */}
        {property?.images?.[0] && (
          <div className="relative">
            <img
              src={getPropertyImageUrl(property.images[0].file)}
              alt={property.name}
              className="w-full h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-10">
          {/* Property Info */}
          <Card className="shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="border-b pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-700 font-semibold text-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
                Property Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Home className="h-4 w-4" /> Property Name
                </p>
                <p className="font-semibold text-gray-800 text-lg">{property?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Address
                </p>
                <p className="font-semibold text-gray-800">{property?.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Code</p>
                  <p className="font-semibold text-gray-800">{property?.codeInternal}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-semibold text-gray-800">{property?.year}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Info */}
          <Card className="shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="border-b pb-3">
              <CardTitle className="flex items-center gap-2 text-green-700 font-semibold text-lg">
                <FileText className="h-5 w-5 text-green-600" />
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div>
                <p className="text-sm text-gray-500">Transaction Name</p>
                <p className="font-semibold text-gray-800 text-lg">{trace.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Sale Date
                </p>
                <p className="font-semibold text-gray-800">{formatDate(trace.dateSale)}</p>
              </div>
              <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4" /> Sale Value
                </p>
                <p className="font-bold text-green-700 text-2xl">{formatCurrency(trace.value)}</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                  <Receipt className="h-4 w-4" /> Tax Amount
                </p>
                <p className="font-bold text-amber-600 text-2xl">{formatCurrency(trace.tax)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Owner Info */}
          <Card className="shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="border-b pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-700 font-semibold text-lg">
                <User className="h-5 w-5 text-purple-600" />
                Owner Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {owner ? (
                <>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <User className="h-4 w-4" /> Full Name
                    </p>
                    <p className="font-semibold text-gray-800 text-lg">{owner.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Address
                    </p>
                    <p className="font-semibold text-gray-800">{owner.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Gift className="h-4 w-4" /> Birthday
                    </p>
                    <p className="font-semibold text-gray-800">{formatDate(owner.birthday)}</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 italic">Owner information unavailable</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Info */}
          <div className="flex flex-col items-start gap-3 w-full md:w-1/2">
            <div>
              <p className="text-sm text-gray-500">Trace ID</p>
              <p className="font-mono text-xs text-gray-700 bg-white border px-4 py-2 rounded shadow-inner inline-block">
                {trace.id}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Globe className="h-4 w-4 text-gray-400" />
              <span>
                Accessed from: <b>{ip}</b>
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Certified by{' '}
              <span className="text-primary font-semibold">Real Estate Management System</span>
            </p>
          </div>

          {/* Right Section: Barcode + QR */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-md border border-gray-200 shadow-sm">
                <Barcode value={trace.id} height={50} width={1.3} displayValue={false} />
              </div>
              <div className="bg-white p-3 rounded-xl shadow-md border border-gray-200">
                <QRCodeSVG
                  value={typeof window !== 'undefined' ? window.location.href : ''}
                  size={110}
                  level="H"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 font-semibold tracking-wider mt-1">
              SCAN OR SCAN CODE TO VERIFY
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
