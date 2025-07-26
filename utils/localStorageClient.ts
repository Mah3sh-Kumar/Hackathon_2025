import { v4 as uuidv4 } from 'uuid';
import { Product } from '../components/seller/ProductForm';

// Define types for localStorage data
type User = {
  id: string;
  email: string;
  password: string; // Note: In a real app, never store plain passwords
  created_at: string;
  user_metadata?: any;
};

type Seller = {
  id: string;
  user_id: string;
  store_name: string;
  description?: string;
  created_at: string;
};

type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
};

type Order = {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shipping_address: string;
  created_at: string;
};

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
};

type Review = {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

// LocalStorage keys
const KEYS = {
  USERS: 'bazarlink_users',
  SELLERS: 'bazarlink_sellers',
  PRODUCTS: 'bazarlink_products',
  CART_ITEMS: 'bazarlink_cart_items',
  ORDERS: 'bazarlink_orders',
  ORDER_ITEMS: 'bazarlink_order_items',
  REVIEWS: 'bazarlink_reviews',
  CURRENT_USER: 'bazarlink_current_user',
};

// Helper function to get data from localStorage
const getFromStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Helper function to save data to localStorage
const saveToStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// LocalStorage client implementation
const localStorageClient = {
  init: () => {
    // Initialize storage with empty arrays if they don't exist
    Object.values(KEYS).forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    });
    
    // Create a dummy seller for testing if none exists
    const sellers = getFromStorage<Seller>(KEYS.SELLERS);
    const users = getFromStorage<User>(KEYS.USERS);
    
    if (users.length === 0) {
      // Create a test user
      const testUser: User = {
        id: uuidv4(),
        email: 'test@example.com',
        password: 'password123',
        created_at: new Date().toISOString(),
      };
      saveToStorage(KEYS.USERS, [testUser]);
      
      // Create a test seller
      const testSeller: Seller = {
        id: uuidv4(),
        user_id: testUser.id,
        store_name: 'Test Store',
        description: 'This is a test store for development purposes',
        created_at: new Date().toISOString(),
      };
      saveToStorage(KEYS.SELLERS, [testSeller]);
      
      // Create some test products
      const testProducts: Product[] = [
        {
          id: uuidv4(),
          title: 'Test Product 1',
          description: 'This is a test product with a detailed description. The product is made with high-quality materials and is perfect for everyday use.',
          price: 1999,
          category: 'Electronics',
          inventory: 10,
          image_urls: ['https://via.placeholder.com/300x300?text=Product+1'],
          seller_id: testSeller.id,
          created_at: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          title: 'Test Product 2',
          description: 'Another test product with different specifications. Great for gifting to friends and family.',
          price: 2999,
          category: 'Home & Garden',
          inventory: 5,
          image_urls: ['https://via.placeholder.com/300x300?text=Product+2'],
          seller_id: testSeller.id,
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
        {
          id: uuidv4(),
          title: 'Test Product 3',
          description: 'Premium test product with advanced features. Limited edition with special packaging.',
          price: 4999,
          category: 'Fashion',
          inventory: 2,
          image_urls: ['https://via.placeholder.com/300x300?text=Product+3'],
          seller_id: testSeller.id,
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        },
      ];
      saveToStorage(KEYS.PRODUCTS, testProducts);
    }
  },
  
  // Authentication methods
  getSession: async () => {
    const currentUser = localStorage.getItem(KEYS.CURRENT_USER);
    if (!currentUser) {
      return { data: { session: null }, error: null };
    }
    
    const user = JSON.parse(currentUser);
    return {
      data: {
        session: {
          user
        }
      },
      error: null
    };
  },
  
  signIn: async (email: string, password: string) => {
    const users = getFromStorage<User>(KEYS.USERS);
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return {
        data: { user: null },
        error: new Error('Invalid login credentials')
      };
    }
    
    const { password: _, ...safeUser } = user;
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(safeUser));
    
    return {
      data: { user: safeUser },
      error: null
    };
  },
  
  signUp: async (email: string, password: string, userData?: any) => {
    const users = getFromStorage<User>(KEYS.USERS);
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return {
        data: { user: null },
        error: new Error('User with this email already exists')
      };
    }
    
    // Create new user
    const newUser: User = {
      id: uuidv4(),
      email,
      password,
      created_at: new Date().toISOString(),
      user_metadata: userData
    };
    
    users.push(newUser);
    saveToStorage(KEYS.USERS, users);
    
    const { password: _, ...safeUser } = newUser;
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(safeUser));
    
    return {
      data: { user: safeUser },
      error: null
    };
  },
  
  signOut: async () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
    return { error: null };
  },
  
  getSellerProfile: async (userId: string) => {
    const sellers = getFromStorage<Seller>(KEYS.SELLERS);
    const seller = sellers.find(s => s.user_id === userId);
    
    return {
      data: seller || null,
      error: null
    };
  },
  
  // Product management
  createProduct: async (product: Product) => {
    const products = getFromStorage<Product>(KEYS.PRODUCTS);
    const newProduct: Product = {
      ...product,
      id: uuidv4(),
      created_at: new Date().toISOString(),
    };
    
    products.push(newProduct);
    saveToStorage(KEYS.PRODUCTS, products);
    
    return {
      data: newProduct,
      error: null
    };
  },
  
  getSellerProducts: async (sellerId: string) => {
    const products = getFromStorage<Product>(KEYS.PRODUCTS);
    const sellerProducts = products.filter(p => p.seller_id === sellerId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return {
      data: sellerProducts,
      error: null
    };
  },
  
  updateProduct: async (product: Product) => {
    const products = getFromStorage<Product>(KEYS.PRODUCTS);
    const index = products.findIndex(p => p.id === product.id);
    
    if (index === -1) {
      return {
        data: null,
        error: new Error('Product not found')
      };
    }
    
    products[index] = {
      ...product,
      updated_at: new Date().toISOString(),
    };
    
    saveToStorage(KEYS.PRODUCTS, products);
    
    return {
      data: products[index],
      error: null
    };
  },
  
  deleteProduct: async (productId: string) => {
    const products = getFromStorage<Product>(KEYS.PRODUCTS);
    const filteredProducts = products.filter(p => p.id !== productId);
    
    if (filteredProducts.length === products.length) {
      return {
        error: new Error('Product not found')
      };
    }
    
    saveToStorage(KEYS.PRODUCTS, filteredProducts);
    
    return {
      error: null
    };
  },
  
  // Product browsing
  getProducts: async () => {
    const products = getFromStorage<Product>(KEYS.PRODUCTS);
    return {
      data: products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
      error: null
    };
  },
  
  getProductById: async (id: string) => {
    const products = getFromStorage<Product>(KEYS.PRODUCTS);
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return {
        data: null,
        error: new Error('Product not found')
      };
    }
    
    return {
      data: product,
      error: null
    };
  },
  
  searchProducts: async (query: string, category?: string) => {
    const products = getFromStorage<Product>(KEYS.PRODUCTS);
    const lowerQuery = query.toLowerCase();
    
    const filtered = products.filter(product => {
      const titleMatch = product.title.toLowerCase().includes(lowerQuery);
      const descriptionMatch = product.description.toLowerCase().includes(lowerQuery);
      const categoryMatch = category ? product.category === category : true;
      
      return (titleMatch || descriptionMatch) && categoryMatch;
    });
    
    return {
      data: filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
      error: null
    };
  },
  
  // Cart management
  addToCart: async (userId: string, productId: string, quantity: number) => {
    const cartItems = getFromStorage<CartItem>(KEYS.CART_ITEMS);
    const existingItem = cartItems.find(item => item.user_id === userId && item.product_id === productId);
    
    if (existingItem) {
      // Update quantity if item already exists
      existingItem.quantity += quantity;
      saveToStorage(KEYS.CART_ITEMS, cartItems);
      
      return {
        data: existingItem,
        error: null
      };
    }
    
    // Create new cart item
    const newItem: CartItem = {
      id: uuidv4(),
      user_id: userId,
      product_id: productId,
      quantity,
      created_at: new Date().toISOString(),
    };
    
    cartItems.push(newItem);
    saveToStorage(KEYS.CART_ITEMS, cartItems);
    
    return {
      data: newItem,
      error: null
    };
  },
  
  getCart: async (userId: string) => {
    const cartItems = getFromStorage<CartItem>(KEYS.CART_ITEMS);
    const products = getFromStorage<Product>(KEYS.PRODUCTS);
    
    const userCart = cartItems
      .filter(item => item.user_id === userId)
      .map(item => {
        const product = products.find(p => p.id === item.product_id);
        return {
          ...item,
          product
        };
      });
    
    return {
      data: userCart,
      error: null
    };
  },
  
  updateCartItem: async (userId: string, productId: string, quantity: number) => {
    const cartItems = getFromStorage<CartItem>(KEYS.CART_ITEMS);
    const index = cartItems.findIndex(item => item.user_id === userId && item.product_id === productId);
    
    if (index === -1) {
      return {
        data: null,
        error: new Error('Cart item not found')
      };
    }
    
    cartItems[index].quantity = quantity;
    saveToStorage(KEYS.CART_ITEMS, cartItems);
    
    return {
      data: cartItems[index],
      error: null
    };
  },
  
  removeCartItem: async (userId: string, productId: string) => {
    const cartItems = getFromStorage<CartItem>(KEYS.CART_ITEMS);
    const filteredItems = cartItems.filter(item => !(item.user_id === userId && item.product_id === productId));
    
    if (filteredItems.length === cartItems.length) {
      return {
        error: new Error('Cart item not found')
      };
    }
    
    saveToStorage(KEYS.CART_ITEMS, filteredItems);
    
    return {
      error: null
    };
  },
  
  // Order management
  createOrder: async (userId: string, orderData: any) => {
    // Get cart items for the user
    const cartItems = getFromStorage<CartItem>(KEYS.CART_ITEMS)
      .filter(item => item.user_id === userId);
    
    // Get products to calculate total
    const products = getFromStorage<Product>(KEYS.PRODUCTS);
    const orders = getFromStorage<Order>(KEYS.ORDERS);
    const orderItems = getFromStorage<OrderItem>(KEYS.ORDER_ITEMS);
    
    // Calculate total
    let total = 0;
    for (const item of cartItems) {
      const product = products.find(p => p.id === item.product_id);
      if (product) {
        total += product.price * item.quantity;
      }
    }
    
    // Create order
    const newOrder: Order = {
      id: uuidv4(),
      user_id: userId,
      total,
      status: 'pending',
      shipping_address: orderData.shipping_address || '',
      created_at: new Date().toISOString(),
    };
    
    orders.push(newOrder);
    saveToStorage(KEYS.ORDERS, orders);
    
    // Create order items
    for (const item of cartItems) {
      const product = products.find(p => p.id === item.product_id);
      if (product) {
        const newOrderItem: OrderItem = {
          id: uuidv4(),
          order_id: newOrder.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: product.price,
        };
        
        orderItems.push(newOrderItem);
        
        // Update inventory
        product.inventory -= item.quantity;
      }
    }
    
    // Save order items and updated products
    saveToStorage(KEYS.ORDER_ITEMS, orderItems);
    saveToStorage(KEYS.PRODUCTS, products);
    
    // Clear cart
    const filteredCartItems = getFromStorage<CartItem>(KEYS.CART_ITEMS)
      .filter(item => item.user_id !== userId);
    saveToStorage(KEYS.CART_ITEMS, filteredCartItems);
    
    return {
      data: newOrder,
      error: null
    };
  },
  
  getOrders: async (userId: string) => {
    const orders = getFromStorage<Order>(KEYS.ORDERS);
    const userOrders = orders.filter(order => order.user_id === userId);
    
    return {
      data: userOrders,
      error: null
    };
  },
  
  getOrderById: async (orderId: string) => {
    const orders = getFromStorage<Order>(KEYS.ORDERS);
    const orderItems = getFromStorage<OrderItem>(KEYS.ORDER_ITEMS);
    const products = getFromStorage<Product>(KEYS.PRODUCTS);
    
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      return {
        data: null,
        error: new Error('Order not found')
      };
    }
    
    // Get items for this order with product details
    const items = orderItems
      .filter(item => item.order_id === orderId)
      .map(item => {
        const product = products.find(p => p.id === item.product_id);
        return {
          ...item,
          product
        };
      });
    
    return {
      data: {
        ...order,
        items
      },
      error: null
    };
  },
  
  // Reviews
  addReview: async (userId: string, productId: string, review: any) => {
    const reviews = getFromStorage<Review>(KEYS.REVIEWS);
    
    // Check if user already reviewed this product
    if (reviews.some(r => r.user_id === userId && r.product_id === productId)) {
      return {
        data: null,
        error: new Error('You have already reviewed this product')
      };
    }
    
    const newReview: Review = {
      id: uuidv4(),
      user_id: userId,
      product_id: productId,
      rating: review.rating,
      comment: review.comment,
      created_at: new Date().toISOString(),
    };
    
    reviews.push(newReview);
    saveToStorage(KEYS.REVIEWS, reviews);
    
    return {
      data: newReview,
      error: null
    };
  },
  
  getProductReviews: async (productId: string) => {
    const reviews = getFromStorage<Review>(KEYS.REVIEWS);
    const users = getFromStorage<User>(KEYS.USERS);
    
    const productReviews = reviews
      .filter(review => review.product_id === productId)
      .map(review => {
        const user = users.find(u => u.id === review.user_id);
        return {
          ...review,
          user: user ? { id: user.id, email: user.email } : null
        };
      });
    
    return {
      data: productReviews,
      error: null
    };
  },
};

export default localStorageClient;