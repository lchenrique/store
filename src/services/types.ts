export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export interface ReviewInput {
  rating: number;
  comment: string;
  productId: string;
}

export interface Address {
  id: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  userId: string;
}

export interface AddressInput {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Order {
  id: string;
  created_at: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      images: string[];
    };
  }[];
}

export interface OrderInput {
  items: {
    productId: string;
    quantity: number;
  }[];
  addressId: string;
  paymentMethodId: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface FavoriteItem {
  id: string;
  product: Product;
}

// Admin Types
export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  featured?: boolean;
}

export interface AdminCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategoryInput {
  name: string;
  description?: string;
  slug: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: Order[];
  topProducts: {
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }[];
  salesByDay: {
    date: string;
    orders: number;
    revenue: number;
  }[];
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  palette?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface ProfileData {
  name?: string;
  phone?: string;
  avatar?: string;
}
