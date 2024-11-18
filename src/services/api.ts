import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import {
  Review,
  ReviewInput,
  Address,
  AddressInput,
  Order,
  OrderInput,
  CartItem,
  FavoriteItem,
  AdminDashboardStats,
  AdminProduct,
  AdminProductInput,
  AdminCategory,
  AdminCategoryInput,
  AdminUser,
  Store,
  StoreProductsParams,
  Product,
  UserProfile,
  ProfileData,
} from './types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
axiosInstance.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Interceptor para tratamento de erros
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detalhado do erro
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      error: error.message
    });

    // Customiza o erro baseado na resposta
    if (error.response) {
      // Erro com resposta do servidor (4xx, 5xx)
      const message = error.response.data?.message || 'Ocorreu um erro inesperado';
      const status = error.response.status;

      // Trata erros específicos
      switch (status) {
        case 401:
          return Promise.reject(new Error('Sessão expirada. Por favor, faça login novamente.'));
        case 403:
          return Promise.reject(new Error('Você não tem permissão para realizar esta ação.'));
        case 404:
          return Promise.reject(new Error('O recurso solicitado não foi encontrado.'));
        case 422:
          return Promise.reject(new Error(message || 'Dados inválidos. Verifique os campos e tente novamente.'));
        case 429:
          return Promise.reject(new Error('Muitas requisições. Por favor, aguarde um momento.'));
        default:
          if (status >= 500) {
            return Promise.reject(new Error('Erro no servidor. Por favor, tente novamente mais tarde.'));
          }
          return Promise.reject(new Error(message));
      }
    } else if (error.request) {
      // Erro sem resposta (problemas de rede)
      return Promise.reject(new Error('Não foi possível conectar ao servidor. Verifique sua conexão.'));
    }

    // Outros erros
    return Promise.reject(error);
  }
);

// API Client
const apiClient = {
  // Reviews
  getProductReviews: (productId: string) => 
    axiosInstance.get<Review[]>(`/products/${productId}/reviews`).then(response => response.data),
  
  canReviewProduct: (productId: string) =>
    axiosInstance.get<{ canReview: boolean }>(`/products/${productId}/can-review`).then(response => response.data),
  
  createReview: (data: ReviewInput) =>
    axiosInstance.post<Review>(`/products/${data.productId}/reviews`, data).then(response => response.data),

  // Favorites
  getFavorites: () =>
    axiosInstance.get<FavoriteItem[]>('/favorites').then(response => response.data),
  
  addFavorite: (productId: string) =>
    axiosInstance.post('/favorites', { productId }).then(response => response.data),
  
  removeFavorite: (favoriteId: string) =>
    axiosInstance.delete(`/favorites/${favoriteId}`).then(response => response.data),

  getFavoriteStatus: (productId: string) =>
    axiosInstance.get<{ isFavorite: boolean }>(`/favorites/status`, { params: { productId } }).then(response => response.data),

  toggleFavorite: (productId: string) =>
    axiosInstance.post<{ isFavorite: boolean }>('/favorites/toggle', { productId }).then(response => response.data),

  // Cart
  getCart: () =>
    axiosInstance.get<{ items: CartItem[] }>('/cart').then(response => response.data),
  
  updateCart: (items: CartItem[]) =>
    axiosInstance.put('/cart', { items }).then(response => response.data),
  
  addToCart: (productId: string, quantity: number) =>
    axiosInstance.post('/cart', { productId, quantity }).then(response => response.data),
  
  removeFromCart: (productId: string) =>
    axiosInstance.delete(`/cart/${productId}`).then(response => response.data),
  
  updateCartItemQuantity: (productId: string, quantity: number) =>
    axiosInstance.patch(`/cart/${productId}`, { quantity }).then(response => response.data),

  // Address
  getAddresses: () =>
    axiosInstance.get<Address[]>('/addresses').then(response => response.data),
  
  createAddress: (address: AddressInput) =>
    axiosInstance.post<Address>('/addresses', address).then(response => response.data),
  
  updateAddress: (id: string, address: AddressInput) =>
    axiosInstance.put<Address>(`/addresses/${id}`, address).then(response => response.data),
  
  deleteAddress: (id: string) =>
    axiosInstance.delete(`/addresses/${id}`).then(response => response.data),
  
  getAddressByCep: (cep: string) =>
    axiosInstance.get<Address>(`/address/cep?cep=${cep}`).then(response => response.data),

  // CEP
  getAddressByCEP: async (cep: string): Promise<{
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    erro?: boolean;
  }> => {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    return response.json();
  },

  // Orders
  getOrders: () =>
    axiosInstance.get<Order[]>('/orders').then(response => response.data),
  
  createOrder: (orderData: OrderInput) =>
    axiosInstance.post<Order>('/orders', orderData).then(response => response.data),
  
  cancelOrder: (orderId: string) =>
    axiosInstance.post(`/orders/${orderId}/cancel`).then(response => response.data),
  
  // Upload
  upload: (file: File, path: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    
    return axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => response.data);
  },

  // Store
  getStore: () =>
    axiosInstance.get<Store>('/store').then(response => response.data),

  updateStore: (data: Partial<Store>) =>
    axiosInstance.patch<Store>('/store', data).then(response => response.data),

  updateStorePalette: (palette: string) =>
    axiosInstance.patch<Store>('/store', { palette }).then(response => response.data),

  updateStoreLogo: (logo: File) => {
    const formData = new FormData();
    formData.append('logo', logo);
    return axiosInstance.patch<Store>('/store', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(response => response.data);
  },

  // Store Products
  getStoreProduct: (id: string) =>
    axiosInstance.get<Product>(`/products/${id}`).then(response => response.data),

  getStoreProducts: (params?: StoreProductsParams) =>
    axiosInstance.get<{ items: Product[]; total: number }>('/products', { params }).then(response => response.data),

  // Profile
  getProfile: () =>
    axiosInstance.get<UserProfile>('/user/profile').then(response => response.data),

  updateProfile: (data: ProfileData) =>
    axiosInstance.put<UserProfile>('/user/profile', data).then(response => response.data),

  // Import/Export
  importProducts: (products: any[]) =>
    axiosInstance.post('/admin/products/import', { products }).then(response => response.data),

  exportProducts: () =>
    axiosInstance.get('/admin/products/export').then(response => response.data),

  // Auth
  auth: {
    getSession: () => axiosInstance.get('/auth/session').then(response => response.data),
    signIn: (credentials: { email: string; password: string }) =>
      axiosInstance.post('/auth/signin', credentials).then(response => response.data),
    signUp: (credentials: { email: string; password: string }) =>
      axiosInstance.post('/auth/signup', credentials).then(response => response.data),
    signOut: () => axiosInstance.post('/auth/signout').then(response => response.data),
    resetPassword: (email: string) =>
      axiosInstance.post('/auth/reset-password', { email }).then(response => response.data),
    updatePassword: (password: string) =>
      axiosInstance.post('/auth/update-password', { password }).then(response => response.data),
  },

  // Admin API
  admin: {
    // Dashboard
    getDashboardStats: () =>
      axiosInstance.get<AdminDashboardStats>('/admin/dashboard').then(response => response.data),

    // Products
    getProducts: (params?: { page?: number; limit?: number; search?: string; category?: string; sort?: string; order?: 'asc' | 'desc' }) =>
      axiosInstance.get<{ items: AdminProduct[]; total: number }>('/admin/products', { params }).then(response => response.data),
    
    getProduct: (id: string) =>
      axiosInstance.get<AdminProduct>(`/admin/products/${id}`).then(response => response.data),
    
    createProduct: (data: AdminProductInput) =>
      axiosInstance.post<AdminProduct>('/admin/products', data).then(response => response.data),
    
    updateProduct: (id: string, data: Partial<AdminProductInput> & {images?: string[]}) =>
      axiosInstance.patch<AdminProduct>(`/admin/products/${id}`, data).then(response => response.data),
    
    deleteProduct: (id: string) =>
      axiosInstance.delete(`/admin/products/${id}`).then(response => response.data),
    
    uploadProductImage: (id: string, file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      return axiosInstance.post(`/admin/products/${id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(response => response.data);
    },

    // Categories
    getCategories: (params?: { page?: number; limit?: number; search?: string }) =>
      axiosInstance.get<{ items: AdminCategory[]; total: number }>('/admin/categories', { params }).then(response => response.data),
    
    getCategory: (id: string) =>
      axiosInstance.get<AdminCategory>(`/admin/categories/${id}`).then(response => response.data),
    
    createCategory: (data: AdminCategoryInput) =>
      axiosInstance.post<AdminCategory>('/admin/categories', data).then(response => response.data),
    
    updateCategory: (id: string, data: Partial<AdminCategoryInput>) =>
      axiosInstance.put<AdminCategory>(`/admin/categories/${id}`, data).then(response => response.data),
    
    deleteCategory: (id: string) =>
      axiosInstance.delete(`/admin/categories/${id}`).then(response => response.data),

    // Orders
    getOrders: (params?: { 
      page?: number; 
      limit?: number; 
      status?: Order['status']; 
      startDate?: string;
      endDate?: string;
    }) =>
      axiosInstance.get<{ items: Order[]; total: number }>('/admin/orders', { params }).then(response => response.data),
    
    getOrder: (id: string) =>
      axiosInstance.get<Order>(`/admin/orders/${id}`).then(response => response.data),
    
    updateOrderStatus: (id: string, status: Order['status']) =>
      axiosInstance.patch(`/admin/orders/${id}/status`, { status }).then(response => response.data),

    // Users
    getUsers: (params?: { page?: number; limit?: number; search?: string; role?: AdminUser['role'] }) =>
      axiosInstance.get<{ items: AdminUser[]; total: number }>('/admin/users', { params }).then(response => response.data),
    
    getUser: (id: string) =>
      axiosInstance.get<AdminUser>(`/admin/users/${id}`).then(response => response.data),
    
    updateUserRole: (id: string, role: AdminUser['role']) =>
      axiosInstance.patch(`/admin/users/${id}/role`, { role }).then(response => response.data),
    
    deleteUser: (id: string) =>
      axiosInstance.delete(`/admin/users/${id}`).then(response => response.data),

    // Analytics
    getOrderAnalytics: (params: { startDate: string; endDate: string }) =>
      axiosInstance.get<{
        totalOrders: number;
        totalRevenue: number;
        averageOrderValue: number;
        ordersByStatus: Record<Order['status'], number>;
      }>('/admin/analytics/orders', { params }).then(response => response.data),
    
    getProductAnalytics: (params: { startDate: string; endDate: string }) =>
      axiosInstance.get<{
        totalSales: number;
        topProducts: { id: string; name: string; sales: number; revenue: number }[];
        salesByCategory: { category: string; sales: number; revenue: number }[];
      }>('/admin/analytics/products', { params }).then(response => response.data),
    
    getUserAnalytics: (params: { startDate: string; endDate: string }) =>
      axiosInstance.get<{
        newUsers: number;
        activeUsers: number;
        usersByRole: Record<AdminUser['role'], number>;
      }>('/admin/analytics/users', { params }).then(response => response.data),
  },
};

export default apiClient;
