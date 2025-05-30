import React, { useState, useContext, createContext, useEffect } from 'react';
import './App.css';

// Mock data
const mockProducts = [
  {
    id: 1,
    name: "African Wax Print Dress",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1533234944761-2f5337579079",
    category: "Fashion",
    seller: "Amara's Boutique",
    rating: 4.8
  },
  {
    id: 2,
    name: "Handcrafted Wooden Bowl",
    price: 28.50,
    image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg",
    category: "Home & Living",
    seller: "Kofi's Crafts",
    rating: 4.9
  },
  {
    id: 3,
    name: "Solar Power Bank",
    price: 67.00,
    image: "https://images.unsplash.com/photo-1624207616837-6d115cef5276",
    category: "Electronics",
    seller: "Tech Solutions",
    rating: 4.7
  },
  {
    id: 4,
    name: "Organic Shea Butter",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1556740714-a8395b3bf30f",
    category: "Beauty",
    seller: "Natural Glow",
    rating: 4.9
  },
  {
    id: 5,
    name: "Business Consulting Package",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f",
    category: "Services",
    seller: "Growth Partners",
    rating: 5.0
  }
];

const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechFlow Africa",
    location: "Nairobi, Kenya",
    salary: "$2,500/month",
    type: "Full-time"
  },
  {
    id: 2,
    title: "Digital Marketing Specialist",
    company: "Growth Hub",
    location: "Lagos, Nigeria",
    salary: "$1,800/month",
    type: "Remote"
  }
];

// Context for unified state management
const EverySingContext = createContext();

const EverySingProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "Kemi Adebayo",
    email: "kemi@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332446c?w=150",
    isLoggedIn: false
  });

  const [wallet, setWallet] = useState({
    balance: 1250.75,
    currency: "USD",
    transactions: [
      { id: 1, type: "purchase", amount: -45.99, description: "African Wax Print Dress", date: "2025-03-15" },
      { id: 2, type: "deposit", amount: 500.00, description: "Mobile Money Deposit", date: "2025-03-14" },
      { id: 3, type: "payment", amount: -28.50, description: "Handcrafted Wooden Bowl", date: "2025-03-13" }
    ]
  });

  const [cart, setCart] = useState([]);
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "purchase",
      message: "Purchased African Wax Print Dress",
      timestamp: "2 hours ago",
      icon: "🛒"
    },
    {
      id: 2,
      type: "social",
      message: "Joined EverySing Community",
      timestamp: "1 day ago",
      icon: "👋"
    },
    {
      id: 3,
      type: "wallet",
      message: "Added $500 to wallet",
      timestamp: "2 days ago",
      icon: "💰"
    }
  ]);

  const [currentView, setCurrentView] = useState('dashboard');

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    // Add activity
    setActivities(prev => [{
      id: Date.now(),
      type: "cart",
      message: `Added ${product.name} to cart`,
      timestamp: "Just now",
      icon: "🛒"
    }, ...prev]);
  };

  const purchaseCart = () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (wallet.balance >= total) {
      // Update wallet
      setWallet(prev => ({
        ...prev,
        balance: prev.balance - total,
        transactions: [{
          id: Date.now(),
          type: "purchase",
          amount: -total,
          description: `Purchase of ${cart.length} items`,
          date: new Date().toISOString().split('T')[0]
        }, ...prev.transactions]
      }));

      // Add activity
      setActivities(prev => [{
        id: Date.now(),
        type: "purchase",
        message: `Purchased ${cart.length} items for $${total.toFixed(2)}`,
        timestamp: "Just now",
        icon: "✅"
      }, ...prev]);

      // Clear cart
      setCart([]);
      alert("Purchase successful! Check your activity feed.");
    } else {
      alert("Insufficient wallet balance!");
    }
  };

  const login = () => {
    setUser(prev => ({ ...prev, isLoggedIn: true }));
  };

  const logout = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    setCurrentView('dashboard');
  };

  return (
    <EverySingContext.Provider value={{
      user, setUser, login, logout,
      wallet, setWallet,
      cart, setCart, addToCart, purchaseCart,
      activities, setActivities,
      currentView, setCurrentView,
      mockProducts, mockJobs
    }}>
      {children}
    </EverySingContext.Provider>
  );
};

// Components
const Header = () => {
  const { user, logout, currentView, setCurrentView, cart } = useContext(EverySingContext);

  if (!user.isLoggedIn) return null;

  return (
    <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">EverySing</h1>
            <span className="text-orange-100 text-sm">Your Unified Digital Life</span>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            {['dashboard', 'marketplace', 'social', 'wallet', 'jobs'].map(view => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-3 py-2 rounded-lg transition-colors capitalize ${
                  currentView === view 
                    ? 'bg-white bg-opacity-20 font-semibold' 
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
              >
                {view}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setCurrentView('cart')}
                className="bg-white bg-opacity-20 p-2 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                🛒 {cart.length > 0 && <span className="ml-1">({cart.length})</span>}
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden md:block">{user.name}</span>
              <button 
                onClick={logout}
                className="text-orange-200 hover:text-white text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const LoginScreen = () => {
  const { login } = useContext(EverySingContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">EverySing</h1>
          <p className="text-gray-600">Your Unified Digital Ecosystem</p>
          <img 
            src="https://images.unsplash.com/photo-1556740714-a8395b3bf30f" 
            alt="Digital Platform"
            className="w-48 h-32 object-cover rounded-lg mx-auto mt-4"
          />
        </div>

        <div className="space-y-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">Demo Features:</h3>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Unified Wallet & Profile</li>
              <li>• E-commerce Marketplace</li>
              <li>• Social Activity Feed</li>
              <li>• Job Opportunities</li>
              <li>• Seamless Integration</li>
            </ul>
          </div>

          <button
            onClick={login}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105"
          >
            Try Demo Login
          </button>

          <p className="text-xs text-gray-500 text-center">
            This is a demo with mock data for showcasing the unified platform concept
          </p>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, wallet, activities, setCurrentView } = useContext(EverySingContext);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user.name}! 👋</h2>
        <p className="text-gray-600">Your unified digital life at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Wallet Card */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">💰 Wallet Balance</h3>
          <p className="text-3xl font-bold">${wallet.balance.toFixed(2)}</p>
          <button 
            onClick={() => setCurrentView('wallet')}
            className="mt-4 bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
          >
            View Transactions
          </button>
        </div>

        {/* Marketplace Card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">🛒 Marketplace</h3>
          <p className="text-sm mb-4">Discover amazing products from local sellers</p>
          <button 
            onClick={() => setCurrentView('marketplace')}
            className="bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
          >
            Shop Now
          </button>
        </div>

        {/* Jobs Card */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">💼 Job Opportunities</h3>
          <p className="text-sm mb-4">Find your next career opportunity</p>
          <button 
            onClick={() => setCurrentView('jobs')}
            className="bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
          <button 
            onClick={() => setCurrentView('social')}
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {activities.slice(0, 3).map(activity => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-gray-800">{activity.message}</p>
                <p className="text-sm text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Marketplace = () => {
  const { mockProducts, addToCart } = useContext(EverySingContext);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🛒 Marketplace</h2>
        <p className="text-gray-600">Discover amazing products from local sellers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map(product => (
          <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-orange-500 font-medium">{product.category}</span>
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3">by {product.seller}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-800">${product.price}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Cart = () => {
  const { cart, setCart, purchaseCart } = useContext(EverySingContext);
  
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev => prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">🛒 Shopping Cart</h2>
      
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <button 
            onClick={() => setCurrentView('marketplace')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="bg-gray-200 w-8 h-8 rounded-full hover:bg-gray-300"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="bg-gray-200 w-8 h-8 rounded-full hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              <div className="text-lg font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold">Total: ${total.toFixed(2)}</span>
            </div>
            <button
              onClick={purchaseCart}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              Complete Purchase
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SocialFeed = () => {
  const { activities } = useContext(EverySingContext);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">📱 Activity Feed</h2>
      
      <div className="space-y-4">
        {activities.map(activity => (
          <div key={activity.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{activity.message}</p>
                <p className="text-sm text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Wallet = () => {
  const { wallet } = useContext(EverySingContext);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">💰 Digital Wallet</h2>
      
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-8 mb-8">
        <h3 className="text-xl font-semibold mb-2">Current Balance</h3>
        <p className="text-4xl font-bold">${wallet.balance.toFixed(2)} {wallet.currency}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Transactions</h3>
        
        <div className="space-y-4">
          {wallet.transactions.map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
              <div className={`text-lg font-semibold ${
                transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.amount > 0 ? '+' : ''}${transaction.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Jobs = () => {
  const { mockJobs } = useContext(EverySingContext);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">💼 Job Opportunities</h2>
      
      <div className="space-y-4">
        {mockJobs.map(job => (
          <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-1">{job.company}</p>
                <p className="text-gray-500 text-sm mb-2">{job.location}</p>
                <div className="flex items-center space-x-4">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {job.salary}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {job.type}
                  </span>
                </div>
              </div>
              <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MobileNav = () => {
  const { currentView, setCurrentView, cart } = useContext(EverySingContext);

  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Home' },
    { id: 'marketplace', icon: '🛒', label: 'Shop' },
    { id: 'social', icon: '📱', label: 'Feed' },
    { id: 'wallet', icon: '💰', label: 'Wallet' },
    { id: 'jobs', icon: '💼', label: 'Jobs' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              currentView === item.id ? 'text-orange-500 bg-orange-50' : 'text-gray-600'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

function App() {
  return (
    <EverySingProvider>
      <div className="min-h-screen bg-gray-50">
        <EverySingContext.Consumer>
          {({ user, currentView }) => {
            if (!user.isLoggedIn) {
              return <LoginScreen />;
            }

            return (
              <>
                <Header />
                <main className="pb-20 md:pb-8">
                  {currentView === 'dashboard' && <Dashboard />}
                  {currentView === 'marketplace' && <Marketplace />}
                  {currentView === 'cart' && <Cart />}
                  {currentView === 'social' && <SocialFeed />}
                  {currentView === 'wallet' && <Wallet />}
                  {currentView === 'jobs' && <Jobs />}
                </main>
                <MobileNav />
              </>
            );
          }}
        </EverySingContext.Consumer>
      </div>
    </EverySingProvider>
  );
}

export default App;