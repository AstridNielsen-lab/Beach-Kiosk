import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { AdminPanel } from './components/AdminPanel';
import { AdminAuth } from './components/AdminAuth';
import { Footer } from './components/Footer';
import { SplashScreen } from './components/SplashScreen';
import { GoogleAuthCallback } from './components/GoogleAuthCallback';
import { products } from './data/products';
import type { CartItem, Order, Product, User, Table } from './types';

const BACKUP_INTERVAL = 3 * 60 * 1000; // 3 minutes in milliseconds
const LOCAL_STORAGE_KEYS = {
  TABLES: 'beachKiosk_tables',
  ORDERS: 'beachKiosk_orders',
  BACKUP_TIME: 'beachKiosk_lastBackup',
  USER: 'beachKioskUser',
};

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isResting, setIsResting] = useState(false);
  const [isGoogleCallback, setIsGoogleCallback] = useState(() => {
    return window.location.pathname === '/signin-google' || window.location.search.includes('code=');
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
    return savedOrders ? JSON.parse(savedOrders) : [];
  });
  const [currentTable, setCurrentTable] = useState<number>(0);
  const [currentWaiter, setCurrentWaiter] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    if (savedUser) {
      const user = JSON.parse(savedUser, (key, value) => {
        if (key === 'timestamp') return new Date(value);
        return value;
      });
      const sessionAge = Date.now() - new Date(user.timestamp).getTime();
      // Sessões Google duram 24 horas, sessões locais 8 horas
      const maxSessionAge = user.authType === 'google' ? 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
      return sessionAge < maxSessionAge ? user : null;
    }
    return null;
  });
  const [tables, setTables] = useState<Table[]>(() => {
    const savedTables = localStorage.getItem(LOCAL_STORAGE_KEYS.TABLES);
    if (savedTables) {
      return JSON.parse(savedTables, (key, value) => {
        if (key === 'lastInteraction') return new Date(value);
        if (key === 'timestamp') return new Date(value);
        return value;
      });
    }
    return Array.from({ length: 100 }, (_, i) => ({
      number: i + 1,
      waiter: '',
      status: 'available',
      lastInteraction: new Date(),
      orders: [],
      total: 0,
      chat: []
    }));
  });

  // Automatic backup system
  useEffect(() => {
    const backupData = () => {
      if (!currentUser) return;

      const now = new Date().toISOString();
      localStorage.setItem(LOCAL_STORAGE_KEYS.TABLES, JSON.stringify(tables));
      localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      localStorage.setItem(LOCAL_STORAGE_KEYS.BACKUP_TIME, now);
      
      console.log(`Backup automático realizado em ${new Date().toLocaleTimeString()}`);
    };

    const backupInterval = setInterval(backupData, BACKUP_INTERVAL);

    // Backup on user actions that modify data
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        backupData();
      }
    };

    const handleBeforeUnload = () => {
      backupData();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(backupInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [tables, orders, currentUser]);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    if (savedUser) {
      const user = JSON.parse(savedUser, (key, value) => {
        if (key === 'timestamp') return new Date(value);
        return value;
      });
      const sessionAge = Date.now() - new Date(user.timestamp).getTime();
      const maxSessionAge = user.authType === 'google' ? 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
      
      if (sessionAge < maxSessionAge) {
        setCurrentUser(user);
        setShowAdmin(true);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
      }
    }

    // Listen for table order events
    const handleTableOrder = (event: CustomEvent<{ tableNumber: number; waiter: string }>) => {
      setCurrentTable(event.detail.tableNumber);
      setCurrentWaiter(event.detail.waiter);
      setShowAdmin(false);
      setCartItems([]);
    };

    window.addEventListener('openTableOrder', handleTableOrder as EventListener);

    return () => {
      window.removeEventListener('openTableOrder', handleTableOrder as EventListener);
    };
  }, []);

  const addToCart = (product: Product) => {
    if (currentTable === 0) {
      const tableNumber = prompt('Por favor, insira o número da mesa (1-100):');
      const waiterName = prompt('Nome do Garçom:');
      
      if (!tableNumber || isNaN(Number(tableNumber)) || Number(tableNumber) < 1 || Number(tableNumber) > 100) {
        alert('Por favor, insira um número de mesa válido (1-100)');
        return;
      }
      
      setCurrentTable(Number(tableNumber));
      setCurrentWaiter(waiterName || '');

      // Update table status
      setTables(tables.map(table =>
        table.number === Number(tableNumber)
          ? { ...table, status: 'occupied', waiter: waiterName || '', lastInteraction: new Date() }
          : table
      ));
    }

    setCartItems((items) => {
      const existingItem = items.find((item) => item.product.id === product.id);
      if (existingItem) {
        return items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...items, { product, quantity: 1 }];
    });
  };

  const updateCartItemQuantity = (productId: string, change: number) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleCheckout = () => {
    if (currentTable === 0) {
      alert('Por favor, selecione uma mesa antes de fazer o pedido');
      return;
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      items: [...cartItems],
      status: 'pending',
      total,
      timestamp: new Date(),
      table: currentTable,
      waiter: currentWaiter
    };

    setOrders((prev) => [...prev, newOrder]);
    
    // Update table information
    setTables(tables.map(table =>
      table.number === currentTable
        ? {
            ...table,
            orders: [...table.orders, newOrder],
            total: table.total + total,
            lastInteraction: new Date()
          }
        : table
    ));

    setCartItems([]);
    setShowCart(false);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((orders) =>
      orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const handleAdminClick = () => {
    if (currentUser) {
      setShowAdmin(true);
    } else {
      setShowAdminAuth(true);
    }
  };

  const handleAdminAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setShowAdminAuth(false);
    setShowAdmin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    setCurrentUser(null);
    setShowAdmin(false);
  };

  const handleOpenNewTable = (tableNumber: number, waiter: string) => {
    setCurrentTable(tableNumber);
    setCurrentWaiter(waiter);
    setTables(tables.map(table =>
      table.number === tableNumber
        ? { ...table, status: 'occupied', waiter, lastInteraction: new Date() }
        : table
    ));
    setShowAdmin(false);
    setCartItems([]);
  };

  const handleCloseTable = (table: Table) => {
    setTables(tables.map(t =>
      t.number === table.number
        ? {
            ...t,
            status: 'available',
            orders: [],
            total: 0,
            waiter: '',
            lastInteraction: new Date()
          }
        : t
    ));

    if (currentTable === table.number) {
      setCurrentTable(0);
      setCurrentWaiter('');
      setCartItems([]);
    }
  };

  if (isGoogleCallback) {
    return <GoogleAuthCallback onComplete={() => setIsGoogleCallback(false)} />;
  }

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (isResting) {
    return <SplashScreen onComplete={() => setIsResting(false)} isRest />;
  }

  const categories = {
    destilados: 'Destilados',
    cervejas: 'Cervejas',
    vinhos: 'Vinhos',
    nao_alcoolicas: 'Bebidas Não Alcoólicas',
    pratos_principais: 'Pratos Principais',
    porcoes: 'Porções',
    saladas: 'Saladas',
    molhos: 'Molhos Extras'
  } as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-yellow-50 flex flex-col">
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setShowCart(true)}
        onAdminClick={handleAdminClick}
        currentUser={currentUser}
        onLogout={handleLogout}
        onRestClick={() => setIsResting(true)}
      />

      <main className="container mx-auto p-6 flex-1">
        {currentTable > 0 && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <p className="text-lg font-semibold">
              Mesa atual: {currentTable} | Garçom: {currentWaiter}
            </p>
          </div>
        )}

        <h1 className="text-4xl font-bold mb-8 text-green-800 text-center">
          Cardápio
        </h1>
        
        {Object.entries(categories).map(([category, title]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-green-800 flex items-center gap-2 before:content-[''] before:h-1 before:flex-1 before:bg-gradient-to-r before:from-yellow-400 before:to-green-400 after:content-[''] after:h-1 after:flex-1 after:bg-gradient-to-r after:from-green-400 after:to-yellow-400">
              <span className="px-4">{title}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((product) => product.category === category)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
            </div>
          </div>
        ))}
      </main>

      <Footer />

      {showCart && (
        <Cart
          items={cartItems}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateCartItemQuantity}
          onCheckout={handleCheckout}
        />
      )}

      {showAdminAuth && (
        <AdminAuth
          onSuccess={handleAdminAuthSuccess}
          onClose={() => setShowAdminAuth(false)}
        />
      )}

      {showAdmin && (
        <AdminPanel
          orders={orders}
          onUpdateStatus={updateOrderStatus}
          onClose={() => setShowAdmin(false)}
          currentUser={currentUser}
          tables={tables}
          onUpdateTable={(tableNumber, updates) =>
            setTables(tables.map(table =>
              table.number === tableNumber ? { ...table, ...updates } : table
            ))
          }
          onCloseTable={handleCloseTable}
          onOpenNewTable={handleOpenNewTable}
        />
      )}
    </div>
  );
}

export default App;