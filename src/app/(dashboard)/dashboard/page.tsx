'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, DollarSign, TrendingUp, Calendar, ArrowRight, MapPin, Home } from 'lucide-react';
import { Card, Loading, Badge } from '@/components/ui';
import { propertyService } from '@/services/api';
import { formatCurrency, formatNumber } from '@/utils/helpers';
import { getPropertyImageUrl } from '@/utils/imageUrl';
import { ROUTES } from '@/utils/constants';
import type { PropertyDto } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { Header } from '@/components/layout/Header';
import { useRouter } from 'next/navigation';

/**
 * Dashboard Page with metrics and recent properties
 */
export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [recentProperties, setRecentProperties] = useState<PropertyDto[]>([]);
  const { user } = useAuthStore();
    const router = useRouter();
  const [metrics, setMetrics] = useState({
    totalProperties: 0,
    totalValue: 0,
    averagePrice: 0,
    recentCount: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('Loading dashboard data...');
      setIsLoading(true);
      const [allProperties, recent] = await Promise.all([
        propertyService.getProperties({ pageSize: 1000 }),
        propertyService.getRecentProperties(5),
      ]);

      const totalValue = allProperties.items.reduce((sum, p) => sum + p.price, 0);
      const avgPrice = allProperties.items.length > 0 ? totalValue / allProperties.items.length : 0;

      setMetrics({
        totalProperties: allProperties.totalCount,
        totalValue,
        averagePrice: avgPrice,
        recentCount: recent.length,
      });
      setRecentProperties(recent);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Header />
      <div>
        <h1 className="text-3xl font-bold text-text">Dashboard</h1>
        <p className="text-text-light mt-1">Welcome back! Here's an overview of your properties.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Properties"
          value={formatNumber(metrics.totalProperties)}
          icon={<Building2 className="h-6 w-6" />}
          color="primary"
        />
        <MetricCard
          title="Total Value"
          value={formatCurrency(metrics.totalValue)}
          icon={<DollarSign className="h-6 w-6" />}
          color="secondary"
        />
        <MetricCard
          title="Average Price"
          value={formatCurrency(metrics.averagePrice)}
          icon={<TrendingUp className="h-6 w-6" />}
          color="accent"
        />
        <MetricCard
          title="Recent Properties"
          value={metrics.recentCount.toString()}
          icon={<Calendar className="h-6 w-6" />}
          color="success"
        />
      </div>

      {/* Recent Properties */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-text">Recent Properties</h2>
              <p className="text-sm text-text-light mt-1">Your latest property additions</p>
            </div>
            <Link
              href={ROUTES.PROPERTIES}
              className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium">View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentProperties.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-text-light">No properties found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {recentProperties.map((property) => (
                <Link
                  key={property.id}
                  href={`${ROUTES.PROPERTIES}/${property.id}`}
                  className="group flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:border-primary hover:shadow-md transition-all duration-200 bg-white"
                >
                  {/* Image Thumbnail */}
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                    {property.images && property.images.length > 0 ? (
                      <>
                        <img
                          src={getPropertyImageUrl(property.images[0].file)}
                          alt={property.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {property.images.length > 1 && (
                          <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-[10px] rounded-full font-medium">
                            +{property.images.length - 1}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-neutral-300" />
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-text group-hover:text-primary transition-colors truncate">
                          {property.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5 text-sm text-text-light">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">{property.address}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(property.price)}
                        </p>
                        {property.codeInternal && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            {property.codeInternal}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Additional Info */}
                    <div className="flex items-center justify-between text-xs text-text-light">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{property.year}</span>
                        </div>
                        {property.name && (
                          <>
                            <span>•</span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(`/owners/${property.idOwner}`);
                              }}
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              <span>Owner: {property.name}</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'accent' | 'success';
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  const colorClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    accent: 'bg-accent text-primary',
    success: 'bg-green-500 text-white',
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-light mb-1">{title}</p>
            <p className="text-2xl font-bold text-text">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
}
