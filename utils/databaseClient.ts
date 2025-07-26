import { createClient, Session, User } from '@supabase/supabase-js';
import { supabaseClient } from './supabaseClient';
import localStorageClient from './localStorageClient';
import { Product } from '../components/seller/ProductForm';

interface DatabaseClient {
  isUsingSupabase: () => boolean;
  init: () => Promise<void>;
  getSession: () => Promise<{ data: { session: Session | null }, error: Error | null }>;
  getSellerProfile: (userId: string) => Promise<{ data: any, error: Error | null }>;
  createSellerProfile: (sellerData: any) => Promise<{ data: any, error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ data: { user: User | null }, error: Error | null }>;
  signUp: (email: string, password: string, userData?: object) => Promise<{ data: { user: User | null }, error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  
  // Product management
  createProduct: (product: Product) => Promise<{ data: any, error: Error | null }>;
  getSellerProducts: (sellerId: string) => Promise<{ data: Product[], error: Error | null }>;
  updateProduct: (product: Product) => Promise<{ data: any, error: Error | null }>;
  deleteProduct: (productId: string) => Promise<{ error: Error | null }>;
  
  // Product browsing
  getProducts: () => Promise<{ data: Product[], error: Error | null }>;
  getProductById: (id: string) => Promise<{ data: Product | null, error: Error | null }>;
  searchProducts: (query: string, category?: string) => Promise<{ data: Product[], error: Error | null }>;
  
  // Cart management (to be implemented)
  addToCart: (userId: string, productId: string, quantity: number) => Promise<{ data: any, error: Error | null }>;
  getCart: (userId: string) => Promise<{ data: any, error: Error | null }>;
  updateCartItem: (userId: string, productId: string, quantity: number) => Promise<{ data: any, error: Error | null }>;
  removeCartItem: (userId: string, productId: string) => Promise<{ error: Error | null }>;
  
  // Order management (to be implemented)
  createOrder: (userId: string, orderData: any) => Promise<{ data: any, error: Error | null }>;
  getOrders: (userId: string) => Promise<{ data: any, error: Error | null }>;
  getOrderById: (orderId: string) => Promise<{ data: any, error: Error | null }>;
  
  // Reviews (to be implemented)
  addReview: (userId: string, productId: string, review: any) => Promise<{ data: any, error: Error | null }>;
  getProductReviews: (productId: string) => Promise<{ data: any, error: Error | null }>;
}

class SupabaseDatabaseClient implements DatabaseClient {
  private client = supabaseClient;
  private initialized = false;
  
  isUsingSupabase = () => true;
  
  init = async () => {
    if (this.initialized) return;
    
    try {
      // Verify connection by checking auth status instead of querying a non-existent table
      const { error } = await this.client.auth.getSession();
      if (error) throw error;
      this.initialized = true;
      console.log('Supabase connection successful');
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      throw err;
    }
  };
  
  getSession = async () => {
    const { data, error } = await this.client.auth.getSession();
    return {
      data: { session: data?.session || null },
      error
    };
  };
  
  getSellerProfile = async (userId: string) => {
    return await this.client
      .from('sellers')
      .select('*')
      .eq('user_id', userId)
      .single();
  };

  createSellerProfile = async (sellerData: any) => {
    return await this.client
      .from('sellers')
      .insert(sellerData)
      .select()
      .single();
  };
  
  signIn = async (email: string, password: string) => {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });
    
    return {
      data: { user: data?.user || null },
      error,
    };
  };
  
  signUp = async (email: string, password: string, userData?: object) => {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    
    return {
      data: { user: data?.user || null },
      error,
    };
  };
  
  signOut = async () => {
    const { error } = await this.client.auth.signOut();
    return { error };
  };
  
  // Product management
  createProduct = async (product: Product) => {
    return await this.client.from('products').insert(product).select().single();
  };
  
  getSellerProducts = async (sellerId: string) => {
    return await this.client
      .from('products')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });
  };
  
  updateProduct = async (product: Product) => {
    const { id, ...productData } = product;
    return await this.client
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();
  };
  
  deleteProduct = async (productId: string) => {
    return await this.client.from('products').delete().eq('id', productId);
  };
  
  // Product browsing
  getProducts = async () => {
    return await this.client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
  };
  
  getProductById = async (id: string) => {
    return await this.client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
  };
  
  searchProducts = async (query: string, category?: string) => {
    let queryBuilder = this.client
      .from('products')
      .select('*')
      .ilike('title', `%${query}%`);
    
    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }
    
    return await queryBuilder.order('created_at', { ascending: false });
  };
  
  // Cart management (stub implementations)
  addToCart = async (userId: string, productId: string, quantity: number) => {
    return { data: null, error: new Error('Not implemented') };
  };
  
  getCart = async (userId: string) => {
    return { data: null, error: new Error('Not implemented') };
  };
  
  updateCartItem = async (userId: string, productId: string, quantity: number) => {
    return { data: null, error: new Error('Not implemented') };
  };
  
  removeCartItem = async (userId: string, productId: string) => {
    return { error: new Error('Not implemented') };
  };
  
  // Order management (stub implementations)
  createOrder = async (userId: string, orderData: any) => {
    return { data: null, error: new Error('Not implemented') };
  };
  
  getOrders = async (userId: string) => {
    return { data: null, error: new Error('Not implemented') };
  };
  
  getOrderById = async (orderId: string) => {
    return { data: null, error: new Error('Not implemented') };
  };
  
  // Reviews (stub implementations)
  addReview = async (userId: string, productId: string, review: any) => {
    return { data: null, error: new Error('Not implemented') };
  };
  
  getProductReviews = async (productId: string) => {
    return { data: null, error: new Error('Not implemented') };
  };
}

class LocalStorageDatabaseClient implements DatabaseClient {
  private client = localStorageClient;
  private initialized = false;
  
  isUsingSupabase = () => false;
  
  init = async () => {
    if (this.initialized) return;
    this.client.init();
    this.initialized = true;
  };
  
  getSession = async () => {
    return this.client.getSession();
  };
  
  getSellerProfile = async (userId: string) => {
    return this.client.getSellerProfile(userId);
  };

  createSellerProfile = async (sellerData: any) => {
    return this.client.createSellerProfile(sellerData);
  };
  
  signIn = async (email: string, password: string) => {
    return this.client.signIn(email, password);
  };
  
  signUp = async (email: string, password: string, userData?: object) => {
    return this.client.signUp(email, password, userData);
  };
  
  signOut = async () => {
    return this.client.signOut();
  };
  
  // Product management
  createProduct = async (product: Product) => {
    return this.client.createProduct(product);
  };
  
  getSellerProducts = async (sellerId: string) => {
    return this.client.getSellerProducts(sellerId);
  };
  
  updateProduct = async (product: Product) => {
    return this.client.updateProduct(product);
  };
  
  deleteProduct = async (productId: string) => {
    return this.client.deleteProduct(productId);
  };
  
  // Product browsing
  getProducts = async () => {
    return this.client.getProducts();
  };
  
  getProductById = async (id: string) => {
    return this.client.getProductById(id);
  };
  
  searchProducts = async (query: string, category?: string) => {
    return this.client.searchProducts(query, category);
  };
  
  // Cart management
  addToCart = async (userId: string, productId: string, quantity: number) => {
    return this.client.addToCart(userId, productId, quantity);
  };
  
  getCart = async (userId: string) => {
    return this.client.getCart(userId);
  };
  
  updateCartItem = async (userId: string, productId: string, quantity: number) => {
    return this.client.updateCartItem(userId, productId, quantity);
  };
  
  removeCartItem = async (userId: string, productId: string) => {
    return this.client.removeCartItem(userId, productId);
  };
  
  // Order management
  createOrder = async (userId: string, orderData: any) => {
    return this.client.createOrder(userId, orderData);
  };
  
  getOrders = async (userId: string) => {
    return this.client.getOrders(userId);
  };
  
  getOrderById = async (orderId: string) => {
    return this.client.getOrderById(orderId);
  };
  
  // Reviews
  addReview = async (userId: string, productId: string, review: any) => {
    return this.client.addReview(userId, productId, review);
  };
  
  getProductReviews = async (productId: string) => {
    return this.client.getProductReviews(productId);
  };
}

class DatabaseClientFactory {
  static create(): DatabaseClient {
    try {
      // Import environment variables for Vite
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      // If Supabase URL and key are available, use Supabase
      if (supabaseUrl && supabaseKey && supabaseUrl !== 'your-supabase-url' && supabaseKey !== 'your-supabase-anon-key') {
        return new SupabaseDatabaseClient();
      } else {
        console.warn('Supabase credentials not found or using placeholder values, using localStorage.');
        return new LocalStorageDatabaseClient();
      }
    } catch (error) {
      console.error('Error initializing database client:', error);
      console.warn('Fallback to localStorage due to error.');
      return new LocalStorageDatabaseClient();
    }
  }
}

export const db = DatabaseClientFactory.create();