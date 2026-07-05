import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from './lib/api';
import { getRoleHomePath } from './lib/auth';
import { RoleRoute } from './components/RoleRoute';

import GuestLayout from './layouts/GuestLayout';
import CustomerLayout from './layouts/CustomerLayout';
import WorkshopLayout from './layouts/WorkshopLayout';
import DeliveryLayout from './layouts/DeliveryLayout';
import AdminLayout from './layouts/AdminLayout';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import CustomerDashboard from './pages/customer/Dashboard';
import CustomerOrders from './pages/customer/Orders';
import CustomerWishlist from './pages/customer/Wishlist';
import CustomerProfile from './pages/customer/Profile';

import WorkshopDashboard from './pages/workshop/Dashboard';
import WorkshopQueue from './pages/workshop/Queue';
import WorkshopAnalytics from './pages/workshop/Analytics';

import DeliveryDashboard from './pages/delivery/Dashboard';
import DeliveryAssigned from './pages/delivery/Assigned';

import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';

function App() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const res = await api.get('/auth/me');
        return res.data;
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

  const getLayout = (role) => {
    switch (role) {
      case 'CUSTOMER':
        return CustomerLayout;
      case 'WORKSHOP':
        return WorkshopLayout;
      case 'DELIVERY':
        return DeliveryLayout;
      case 'ADMINISTRATOR':
        return AdminLayout;
      default:
        return GuestLayout;
    }
  };

  const Layout = getLayout(user?.role);

  return (
    <Routes>
      <Route element={<Layout user={user} />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="product/:slug" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={!user ? <LoginPage /> : <Navigate to={getRoleHomePath(user.role)} replace />} />
        <Route path="register" element={!user ? <RegisterPage /> : <Navigate to={getRoleHomePath(user.role)} replace />} />

        <Route path="customer" element={<RoleRoute user={user} role="CUSTOMER"><CustomerDashboard /></RoleRoute>} />
        <Route path="customer/orders" element={<RoleRoute user={user} role="CUSTOMER"><CustomerOrders /></RoleRoute>} />
        <Route path="customer/wishlist" element={<RoleRoute user={user} role="CUSTOMER"><CustomerWishlist /></RoleRoute>} />
        <Route path="customer/profile" element={<RoleRoute user={user} role="CUSTOMER"><CustomerProfile /></RoleRoute>} />

        <Route path="workshop" element={<RoleRoute user={user} role="WORKSHOP"><WorkshopDashboard /></RoleRoute>} />
        <Route path="workshop/queue" element={<RoleRoute user={user} role="WORKSHOP"><WorkshopQueue /></RoleRoute>} />
        <Route path="workshop/analytics" element={<RoleRoute user={user} role="WORKSHOP"><WorkshopAnalytics /></RoleRoute>} />

        <Route path="delivery" element={<RoleRoute user={user} role="DELIVERY"><DeliveryDashboard /></RoleRoute>} />
        <Route path="delivery/assigned" element={<RoleRoute user={user} role="DELIVERY"><DeliveryAssigned /></RoleRoute>} />

        <Route path="admin" element={<RoleRoute user={user} role="ADMINISTRATOR"><AdminDashboard /></RoleRoute>} />
        <Route path="admin/products" element={<RoleRoute user={user} role="ADMINISTRATOR"><AdminProducts /></RoleRoute>} />
        <Route path="admin/orders" element={<RoleRoute user={user} role="ADMINISTRATOR"><AdminOrders /></RoleRoute>} />
        <Route path="admin/users" element={<RoleRoute user={user} role="ADMINISTRATOR"><AdminUsers /></RoleRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
