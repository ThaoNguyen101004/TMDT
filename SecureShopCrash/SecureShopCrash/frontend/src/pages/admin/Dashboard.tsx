import React, { useMemo } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  UserPlus, 
  AlertTriangle, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

type Props = { 
  data?: any;
  onReload?: () => void;
};

const Dashboard: React.FC<Props> = ({ data }) => {
  const analytics = data?.analytics || {};
  const recentOrders = data?.recentOrders || [];
  const recentUsers = data?.recentUsers || [];
  const inventories = data?.inventories || [];

  // Calculate stats
  const totalRevenue = analytics.totalRevenue || 0;
  const pendingOrders = analytics.pendingOrders || 0;
  
  // Get today's stats from revenue trend
  const revenueTrend = analytics.revenueTrend || [];
  const todayStats = revenueTrend.length > 0 ? revenueTrend[revenueTrend.length - 1] : { orderCount: 0 };
  const ordersToday = todayStats.orderCount || 0;

  // New users today
  const today = new Date().toDateString();
  const newUsersToday = recentUsers.filter((u: any) => new Date(u.createdAt).toDateString() === today).length;

  // Inventory stats
  const activeProducts = inventories.length;
  const lowStockProducts = inventories.filter((i: any) => i.quantity > 0 && i.quantity < 10);
  const topProducts = analytics.topProducts || [];

  // Sort recent users
  const latestUsers = [...recentUsers]
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-1 text-[11px] font-medium bg-yellow-100 text-yellow-800 rounded-full flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> Chờ xử lý</span>;
      case 'WAITING_FOR_DELIVERY':
      case 'IN_TRANSIT':
        return <span className="px-2 py-1 text-[11px] font-medium bg-blue-100 text-blue-800 rounded-full flex items-center gap-1 w-fit"><Truck className="w-3 h-3"/> Đang giao</span>;
      case 'DELIVERED':
        return <span className="px-2 py-1 text-[11px] font-medium bg-green-100 text-green-800 rounded-full flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/> Hoàn thành</span>;
      case 'CANCELLED':
        return <span className="px-2 py-1 text-[11px] font-medium bg-red-100 text-red-800 rounded-full flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/> Đã hủy</span>;
      default:
        return <span className="px-2 py-1 text-[11px] font-medium bg-gray-100 text-gray-800 rounded-full w-fit">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-800">Tổng quan hệ thống</h2>
      
      {/* 1. Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-green-50 to-green-100 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Tổng doanh thu</p>
            <h3 className="text-xl font-bold text-gray-900">{totalRevenue.toLocaleString()} ₫</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Đơn hàng hôm nay</p>
            <h3 className="text-xl font-bold text-gray-900">{ordersToday}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <UserPlus className="w-5 h-5" />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Người dùng mới</p>
            <h3 className="text-xl font-bold text-gray-900">{newUsersToday}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Sản phẩm đang bán</p>
            <h3 className="text-xl font-bold text-gray-900">{activeProducts}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-orange-50 to-orange-100 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Đơn chờ xử lý</p>
            <h3 className="text-xl font-bold text-gray-900">{pendingOrders}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-100 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-red-50 to-red-100 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Sắp hết hàng</p>
            <h3 className="text-xl font-bold text-red-600">{lowStockProducts.length}</h3>
          </div>
        </div>
      </div>

      {/* 2. Charts & Tables Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Chart & Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Doanh thu 7 ngày gần đây</h3>
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrend} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(val) => {
                      const date = new Date(val);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(val) => `${val / 1000000}M`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`${value.toLocaleString()} ₫`, 'Doanh thu']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('vi-VN')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Đơn hàng gần đây</h3>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Xem tất cả</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Mã đơn</th>
                    <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Khách hàng</th>
                    <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Tổng tiền</th>
                    <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentOrders.slice(0, 5).map((order: any) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 font-medium text-indigo-600">#{order.id.slice(-6)}</td>
                      <td className="py-3 text-gray-800">{order.user?.name || 'Khách vãng lai'}</td>
                      <td className="py-3 font-semibold text-gray-900">{order.grandTotal?.toLocaleString()} ₫</td>
                      <td className="py-3">{getOrderStatusBadge(order.status)}</td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">Không có đơn hàng nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Top Products, Low Stock, New Users */}
        <div className="space-y-6">
          
          {/* Top Products */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Top bán chạy</h3>
            <div className="space-y-4">
              {topProducts.slice(0, 4).map((prod: any, idx: number) => (
                <div key={prod.id} className="flex items-center gap-3 group">
                  <div className="relative">
                    <img src={prod.thumbnailUrl} alt={prod.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-100" />
                    <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{prod.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Đã bán: <span className="font-medium text-gray-900">{prod.totalQuantitySold}</span></p>
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">Chưa có dữ liệu</p>
              )}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-bold text-gray-800">Sắp hết hàng</h3>
              {lowStockProducts.length > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{lowStockProducts.length}</span>
              )}
            </div>
            <div className="space-y-3">
              {lowStockProducts.slice(0, 4).map((inv: any) => (
                <div key={inv.id} className="flex justify-between items-center p-3 bg-red-50/50 rounded-xl border border-red-100/50">
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-sm font-medium text-gray-900 truncate">{inv.product?.name || `SKU: ${inv.productId}`}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-lg">Còn {inv.quantity}</span>
                  </div>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-4 text-green-600 gap-2">
                  <CheckCircle className="w-8 h-8 opacity-50" />
                  <p className="text-sm font-medium">Tồn kho ổn định</p>
                </div>
              )}
            </div>
          </div>

          {/* New Users */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Người dùng mới</h3>
            <div className="space-y-4">
              {latestUsers.map((user: any) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0 border border-white shadow-sm text-indigo-600 font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              ))}
              {latestUsers.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">Chưa có người dùng mới</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;

export async function loadData() {
  try {
    const { analyticsApi, orderApi, userApi, InventoryApi } = await import('../../utils/api');
    
    // Calculate 7 days ago
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    // Fetch Analytics data
    const analyticsData = await analyticsApi.getAnalyticsData({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }).catch(err => {
      console.error('Analytics API error:', err);
      return {};
    });

    // Fetch supporting data
    const [ordersResponse, usersResponse, inventoriesResponse] = await Promise.all([
      orderApi.getAll({ page: 0, size: 20 }),
      userApi.getAllUsers(),
      InventoryApi.getAll().catch(err => {
        console.error('Inventory API error:', err);
        return [];
      })
    ]);

    return {
      analytics: analyticsData,
      recentOrders: ordersResponse.content || ordersResponse || [],
      recentUsers: usersResponse.content || usersResponse || [],
      inventories: inventoriesResponse.content || inventoriesResponse || []
    };
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    return {
      analytics: {},
      recentOrders: [],
      recentUsers: [],
      inventories: []
    };
  }
}
