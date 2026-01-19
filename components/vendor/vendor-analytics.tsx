'use client';

import { VendorAnalytics } from '@/types/vendor';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  Eye,
  BarChart3,
} from 'lucide-react';

interface VendorAnalyticsProps {
  analytics: VendorAnalytics;
}

export function VendorAnalyticsDisplay({ analytics }: VendorAnalyticsProps) {
  const statCards = [
    {
      title: 'Total Sales',
      value: analytics.totalSales.toLocaleString(),
      icon: ShoppingBag,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Orders',
      value: analytics.totalOrders.toLocaleString(),
      icon: BarChart3,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Revenue',
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Average Order Value',
      value: `$${analytics.averageOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Total Products',
      value: analytics.totalProducts.toLocaleString(),
      icon: Package,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Active Products',
      value: analytics.activeProducts.toLocaleString(),
      icon: Package,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
    },
    {
      title: 'Total Views',
      value: analytics.totalViews.toLocaleString(),
      icon: Eye,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.conversionRate.toFixed(2)}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg p-6 border border-gray-200`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">
                  {stat.title}
                </h3>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Sales Chart */}
      {analytics.salesByPeriod.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sales Over Time
          </h3>
          <div className="space-y-4">
            {analytics.salesByPeriod.map((period, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600">{period.period}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-primary-600 h-4 rounded-full"
                        style={{
                          width: `${
                            (period.revenue /
                              Math.max(
                                ...analytics.salesByPeriod.map((p) => p.revenue)
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-20 text-right">
                      ${period.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {period.orders} orders • {period.sales} sales
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Products */}
      {analytics.topProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Products
          </h3>
          <div className="space-y-3">
            {analytics.topProducts.map((product, index) => (
              <div
                key={product.productId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {product.productName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {product.views} views • {product.sales} sales
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${product.revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
