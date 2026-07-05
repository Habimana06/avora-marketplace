import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from './lib/api';
import { getRoleHomePath } from './lib/auth';
import RoleRoute from './components/RoleRoute';

import GuestLayout from './layouts/GuestLayout';
import CustomerLayout from './layouts/CustomerLayout';
import WorkshopLayout from './layouts/WorkshopLayout';
import AdminLayout from './layouts/AdminLayout';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CollectionsPage from './pages/CollectionsPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import CustomerOrders from './pages/customer/Orders';
import CustomerWishlist from './pages/customer/Wishlist';
import CustomerProfile from './pages/customer/Profile';

import WorkshopDashboard from './pages/workshop/Dashboard';
import WorkshopQueue from './pages/workshop/Queue';
import WorkshopOrderDetail from './pages/workshop/OrderDetail';
import WorkshopProducts from './pages/workshop/Products';
import WorkshopProductForm from './pages/workshop/ProductForm';
import WorkshopCompleted from './pages/workshop/Completed';
import WorkshopAnalytics from './pages/workshop/Analytics';
import WorkshopReports from './pages/workshop/Reports';
import WorkshopCalendar from './pages/workshop/Calendar';
import WorkshopProfile from './pages/workshop/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import AdminSales from './pages/admin/Sales';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminInventory from './pages/admin/Inventory';
import AdminUsers from './pages/admin/Users';
import AdminCoupons from './pages/admin/Coupons';
import AdminAnalytics from './pages/admin/Analytics';
import AdminPayments from './pages/admin/Payments';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';

function LayoutShell({ user }) {
  if (user?.role === 'CUSTOMER') return <CustomerLayout user={user} />;
  if (user?.role === 'WORKSHOP') return <WorkshopLayout />;
  if (user?.role === 'ADMINISTRATOR') return <AdminLayout />;
  return <GuestLayout />;
}

function App() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const res = await api.get('/auth/me');
        return res.data?.user ?? null;
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const home = getRoleHomePath(user?.role);

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={home} replace />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to={home} replace />} />

      <Route element={<LayoutShell user={user} />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="product/:slug" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />

        <Route path="customer" element={<Navigate to="/" replace />} />
        <Route path="customer/orders" element={<RoleRoute user={user} role="CUSTOMER"><CustomerOrders /></RoleRoute>} />
        <Route path="customer/wishlist" element={<RoleRoute user={user} role="CUSTOMER"><CustomerWishlist /></RoleRoute>} />
        <Route path="customer/profile" element={<RoleRoute user={user} role="CUSTOMER"><CustomerProfile user={user} /></RoleRoute>} />

        <Route path="workshop" element={<RoleRoute user={user} role="WORKSHOP"><WorkshopDashboard /></RoleRoute>} />
        <Route path="workshop/queue" element={<RoleRoute user={user} role="WORKSHOP"><WorkshopQueue /></RoleRoute>} />
        <Route path="workshop/orders/:orderId" element={<RoleRoute user={user} role="WORKSHOP"><WorkshopOrderDetail /></RoleRoute>} />
        <Route path="workshop/products" element={<RoleRoute user={user} role="WORKSHOP"><WorkshopProducts /></RoleRoute>} />
        <Route path="workshop/products/new" element={<RoleRoute user={user} role="WORKSHOP"><WorkshopProductForm /></RoleRoute>} />
        <Route path="workshop/products/:id/edit" element={<RoleRoute user={user} role="WORKSHOP"><WorkshopProductForm /></RoleRoute>} />
        <Route path="workshop/completed" element={<RoleRoute user={user} role="WORKSHOP"><WorkshopCompleted /></RoleRoute>} />
        <Route path="workshop/analytics" element={<RoleRoute user={user} role="WORKSHOP"><WorkshopAnalytics /></RoleRoute>} />
        <Route path="workshop/reports" element={<RoleRoute user={user} role="WORKSHOP"><WorkshopReports /></RoleRoute>} />
        <Route path="workshop/calendar" element={<RoleRoute user={user} role="WORKSHOP"><WorkshopCalendar /></RoleRoute>} />
        <Route path="workshop/profile" element={<RoleRoute user={user} role="WORKSHOP"><WorkshopProfile /></RoleRoute>} />

        <Route path="admin" element={<RoleRoute user={user} role="ADMINISTRATOR"><AdminDashboard /></RoleRoute>} />
        <Route path="admin/sales" element={<RoleRoute user={user} role="ADMINISTRATOR"><AdminSales /></RoleRoute>} />
        <Route path="admin/products" element={<RoleRoute user={user} role="ADMINISTRATOR"><AdminProducts /></RoleRoute>} />
        <Route path="admin/orders" element={<RoleRoute user={user} role="ADMINISTRATOR"><AdminOrders /></RoleRoute>} />
        <Route path="admin/inventory" element={<RoleRoute user={user} role="ADMINISTRATOR"><AdminInventory /></RoleRoute>} />
        <Route path="admin/users" element={<RoleRoute user={user} role="ADMINISTRATOR"><AdminUsers /></RoleRoute>} />
        <Route path="admin/coupons" element={<RoleRoute user={user} role="ADMINISTRATOR"><AdminCoupons /></RoleRoute>} />
        <Route path="admin/analytics" element={<RoleRoute user={user} role="ADMINISTRATOR"><AdminAnalytics /></RoleRoute>} />
        <Route path="admin/payments" element={<RoleRoute user={user} role="ADMINISTRATOR"><AdminPayments /></RoleRoute>} />
        <Route path="admin/reports" element={<RoleRoute user={user} role="ADMINISTRATOR"><AdminReports /></RoleRoute>} />
        <Route path="admin/settings" element={<RoleRoute user={user} role="ADMINISTRATOR"><AdminSettings /></RoleRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
