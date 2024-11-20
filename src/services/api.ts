import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { getAuthMessage } from '@/lib/supabase/auth-messages';
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
  baseURL: typeof window === 'undefined' 
    ? process.env.NEXT_PUBLIC_APP_URL 
    : '/api',
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

let isRefreshing = false;
let failedQueue: { resolve: Function; reject: Function }[] = [];
let isRedirecting = false;

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  
  failedQueue = [];
};

const clearSession = async () => {
  // Limpa os cookies
  if (typeof document !== 'undefined') {
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }
  
  // Limpa o localStorage
  if (typeof window !== 'undefined') {
    localStorage.clear();
  }
};

// Interceptor para tratamento de erros
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;

    // Log detalhado do erro apenas se não for um erro de negócio esperado
    if (!error.response?.data || error.response.status >= 500) {
      console.error('API Error:', {
        url: error?.config?.url,
        method: error?.config?.method,
        status: error?.response?.status,
        data: error?.response?.data,
        error: error?.message
      });
    }

    // Se for erro 401 e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já estiver refreshing, adiciona à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Tenta fazer refresh da sessão
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) throw refreshError;
        
        if (session) {
          // Atualiza o token no request original
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
          
          // Processa a fila de requests que falharam
          processQueue(null);
          
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError);
        await clearSession();
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    // Para outros erros, retorna a mensagem da API se disponível
    if (error.response?.data) {
      console.log('Error data:', error.response.data);
      throw new Error(getAuthMessage(error.response.data));
    }
    
    throw error;
  }
);

// API Client
const apiClient = {
  // Reviews
  getProductReviews: async (productId: string) => {
    const response = await axiosInstance.get<Review[]>(`/products/${productId}/reviews`);
    return response.data;
  },
  
  canReviewProduct: async (productId: string) => {
    const response = await axiosInstance.get<{ canReview: boolean }>(`/products/${productId}/can-review`);
    return response.data;
  },
  
  createReview: async (data: ReviewInput) => {
    const response = await axiosInstance.post<Review>(`/products/${data.productId}/reviews`, data);
    return response.data;
  },

  // Favorites
  getFavorites: async () => {
    const response = await axiosInstance.get<FavoriteItem[]>('/favorites');
    return response.data;
  },
  
  addFavorite: async (productId: string) => {
    const response = await axiosInstance.post('/favorites', { productId });
    return response.data;
  },
  
  removeFavorite: async (favoriteId: string) => {
    const response = await axiosInstance.delete(`/favorites/${favoriteId}`);
    return response.data;
  },

  getFavoriteStatus: async (productId: string) => {
    const response = await axiosInstance.get<{ isFavorite: boolean }>(`/favorites`, { params: { productId } });
    return response.data;
  },

  toggleFavorite: async (productId: string) => {
    const response = await axiosInstance.post<{ isFavorite: boolean }>('/favorites', { productId });
    return response.data;
  },

  // Cart
  getCart: async () => {
    const response = await axiosInstance.get<{ items: CartItem[] }>('/cart');
    return response.data;
  },
  
  updateCart: async (items: CartItem[]) => {
    const response = await axiosInstance.put('/cart', { items });
    return response.data;
  },
  
  addToCart: async (productId: string, quantity: number) => {
    const response = await axiosInstance.post('/cart', { productId, quantity });
    return response.data;
  },
  
  removeFromCart: async (productId: string) => {
    const response = await axiosInstance.delete(`/cart/${productId}`);
    return response.data;
  },
  
  updateCartItemQuantity: async (productId: string, quantity: number) => {
    const response = await axiosInstance.patch(`/cart/${productId}`, { quantity });
    return response.data;
  },
  
  checkout(cart: CartItem[]) {
    return axiosInstance.post<{ checkoutUrl: string; orderId: string }>('/checkout', cart);
  },

  // Address
  getAddresses: async () => {
    const response = await axiosInstance.get<Address[]>('/addresses');
    return response.data;
  },
  
  createAddress: async (address: AddressInput) => {
    const response = await axiosInstance.post<Address>('/addresses', address);
    return response.data;
  },
  
  updateAddress: async (id: string, address: AddressInput) => {
    const response = await axiosInstance.put<Address>(`/addresses/${id}`, address);
    return response.data;
  },
  
  deleteAddress: async (id: string) => {
    const response = await axiosInstance.delete(`/addresses/${id}`);
    return response.data;
  },
  
  getAddressByCep: async (cep: string) => {
    const response = await axiosInstance.get<Address>(`/address/cep?cep=${cep}`);
    return response.data;
  },

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
  getOrders: async () => {
    const response = await axiosInstance.get<Order[]>('/orders');
    return response.data;
  },
  
  createOrder: async (orderData: OrderInput) => {
    const response = await axiosInstance.post<Order>('/orders', orderData);
    return response.data;
  },
  
  cancelOrder: async (orderId: string) => {
    const response = await axiosInstance.post(`/orders/${orderId}/cancel`);
    return response.data;
  },
  
  // Upload
  upload: async (file: File, path: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    
    const response = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Store
  getStore: async () => {
    const response = await axiosInstance.get<Store>('/store');
    return response.data;
  },

  getPalette: async () => {
    const response = await axiosInstance.get<Store["palette"]>('/store/palette');
    return response.data;
  },

  updateStore: async (data: Partial<Store>) => {
    const response = await axiosInstance.patch<Store>('/store', data);
    return response.data;
  },

  updateStorePalette: async (palette: string) => {
    const response = await axiosInstance.patch<Store>('/store', { palette });
    return response.data;
  },

  updateStoreLogo: async (logo: File) => {
    const formData = new FormData();
    formData.append('logo', logo);
    const response = await axiosInstance.patch<Store>('/store', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Store Products
  getStoreProduct: async (id: string) => {
    const response = await axiosInstance.get<Product>(`/products/${id}`);
    return response.data;
  },

  getStoreProducts: async (params?: StoreProductsParams) => {
    const response = await axiosInstance.get<{ items: Product[]; total: number }>('/products', { params });
    return response.data;
  },

  // Profile
  getProfile: async () => {
    const response = await axiosInstance.get<UserProfile>('/user/profile');
    return response.data;
  },

  updateProfile: async (data: ProfileData) => {
    const response = await axiosInstance.put<UserProfile>('/user/profile', data);
    return response.data;
  },

  // Import/Export
  importProducts: async (products: any[]) => {
    const response = await axiosInstance.post('/admin/products/import', { products });
    return response.data;
  },

  exportProducts: async () => {
    const response = await axiosInstance.get('/admin/products/export');
    return response.data;
  },

  // Auth
  auth: {
    getSession: async () => {
      const response = await axiosInstance.get('/auth/session');
      return response.data;
    },
    signIn: async (credentials: { email: string; password: string }) => {
      const response = await axiosInstance.post('/auth/signin', credentials);
      return response.data;
    },
    signUp: async (credentials: { email: string; password: string; name: string }) => {
      const response = await axiosInstance.post('/auth/register', credentials);
      return response.data;
    },
    signOut: async () => {
      const response = await axiosInstance.post('/auth/signout');
      return response.data;
    },
    resetPassword: async (email: string) => {
      const response = await axiosInstance.post('/auth/reset-password', { email });
      return response.data;
    },
    updatePassword: async (password: string) => {
      const response = await axiosInstance.post('/auth/update-password', { password });
      return response.data;
    },
  },

  // Admin API
  admin: {
    // Dashboard
    getDashboardStats: async () => {
      const response = await axiosInstance.get<AdminDashboardStats>('/admin/dashboard');
      return response.data;
    },

    // Products
    getProducts: async (params?: { page?: number; limit?: number; search?: string; category?: string; sort?: string; order?: 'asc' | 'desc' }) => {
      const response = await axiosInstance.get<{ items: AdminProduct[]; total: number }>('/admin/products', { params });
      return response.data;
    },
    
    getProduct: async (id: string) => {
      const response = await axiosInstance.get<AdminProduct>(`/admin/products/${id}`);
      return response.data;
    },
    
    createProduct: async (data: AdminProductInput) => {
      const response = await axiosInstance.post<AdminProduct>('/admin/products', data);
      return response.data;
    },
    
    updateProduct: async (id: string, data: Partial<AdminProductInput> & {images?: string[]}) => {
      const response = await axiosInstance.patch<AdminProduct>(`/admin/products/${id}`, data);
      return response.data;
    },
    
    deleteProduct: async (id: string) => {
      const response = await axiosInstance.delete(`/admin/products/${id}`);
      return response.data;
    },
    
    uploadProductImage: async (id: string, file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await axiosInstance.post(`/admin/products/${id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // Categories
    getCategories: async (params?: { page?: number; limit?: number; search?: string }) => {
      const response = await axiosInstance.get<{ items: AdminCategory[]; total: number }>('/admin/categories', { params });
      return response.data;
    },
    
    getCategory: async (id: string) => {
      const response = await axiosInstance.get<AdminCategory>(`/admin/categories/${id}`);
      return response.data;
    },
    
    createCategory: async (data: AdminCategoryInput) => {
      const response = await axiosInstance.post<AdminCategory>('/admin/categories', data);
      return response.data;
    },
    
    updateCategory: async (id: string, data: Partial<AdminCategoryInput>) => {
      const response = await axiosInstance.put<AdminCategory>(`/admin/categories/${id}`, data);
      return response.data;
    },
    
    deleteCategory: async (id: string) => {
      const response = await axiosInstance.delete(`/admin/categories/${id}`);
      return response.data;
    },

    // Orders
    getOrders: async (params?: { 
      page?: number; 
      limit?: number; 
      status?: Order['status']; 
      startDate?: string;
      endDate?: string;
    }) => {
      const response = await axiosInstance.get<{ items: Order[]; total: number }>('/admin/orders', { params });
      return response.data;
    },
    
    getOrder: async (id: string) => {
      const response = await axiosInstance.get<Order>(`/admin/orders/${id}`);
      return response.data;
    },
    
    updateOrderStatus: async (orderId: string, status: string) => {
      const response = await axiosInstance.patch(`/orders/${orderId}/status`, { status });
      return response.data;
    },

    // Users
    getUsers: async (params?: { page?: number; limit?: number; search?: string; role?: AdminUser['role'] }) => {
      const response = await axiosInstance.get<{ items: AdminUser[]; total: number }>('/admin/users', { params });
      return response.data;
    },
    
    getUser: async (id: string) => {
      const response = await axiosInstance.get<AdminUser>(`/admin/users/${id}`);
      return response.data;
    },
    
    updateUserRole: async (id: string, role: AdminUser['role']) => {
      const response = await axiosInstance.patch(`/admin/users/${id}/role`, { role });
      return response.data;
    },
    
    deleteUser: async (id: string) => {
      const response = await axiosInstance.delete(`/admin/users/${id}`);
      return response.data;
    },

    // Analytics
    getOrderAnalytics: async (params: { startDate: string; endDate: string }) => {
      const response = await axiosInstance.get<{
        totalOrders: number;
        totalRevenue: number;
        averageOrderValue: number;
        ordersByStatus: Record<Order['status'], number>;
      }>('/admin/analytics/orders', { params });
      return response.data;
    },
    
    getProductAnalytics: async (params: { startDate: string; endDate: string }) => {
      const response = await axiosInstance.get<{
        totalSales: number;
        topProducts: { id: string; name: string; sales: number; revenue: number }[];
        salesByCategory: { category: string; sales: number; revenue: number }[];
      }>('/admin/analytics/products', { params });
      return response.data;
    },
    
    getUserAnalytics: async (params: { startDate: string; endDate: string }) => {
      const response = await axiosInstance.get<{
        newUsers: number;
        activeUsers: number;
        usersByRole: Record<AdminUser['role'], number>;
      }>('/admin/analytics/users', { params });
      return response.data;
    },
  },
};

export default apiClient;
