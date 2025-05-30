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
    rating: 4.8,
    tags: ["fashion", "traditional", "colorful", "dress"]
  },
  {
    id: 2,
    name: "Handcrafted Wooden Bowl",
    price: 28.50,
    image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg",
    category: "Home & Living",
    seller: "Kofi's Crafts",
    rating: 4.9,
    tags: ["handmade", "wood", "kitchen", "artisan"]
  },
  {
    id: 3,
    name: "Solar Power Bank",
    price: 67.00,
    image: "https://images.unsplash.com/photo-1624207616837-6d115cef5276",
    category: "Electronics",
    seller: "Tech Solutions",
    rating: 4.7,
    tags: ["solar", "portable", "tech", "sustainable"]
  },
  {
    id: 4,
    name: "Organic Shea Butter",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1556740714-a8395b3bf30f",
    category: "Beauty",
    seller: "Natural Glow",
    rating: 4.9,
    tags: ["organic", "skincare", "natural", "moisturizer"]
  },
  {
    id: 5,
    name: "Business Consulting Package",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f",
    category: "Services",
    seller: "Growth Partners",
    rating: 5.0,
    tags: ["consulting", "business", "growth", "strategy"]
  },
  {
    id: 6,
    name: "Bluetooth Headphones",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1533234944761-2f5337579079",
    category: "Electronics",
    seller: "AudioTech",
    rating: 4.6,
    tags: ["audio", "wireless", "music", "technology"]
  }
];

const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechFlow Africa",
    location: "Nairobi, Kenya",
    salary: "$2,500/month",
    type: "Full-time",
    skills: ["React", "JavaScript", "CSS"],
    matchScore: 85
  },
  {
    id: 2,
    title: "Digital Marketing Specialist",
    company: "Growth Hub",
    location: "Lagos, Nigeria",
    salary: "$1,800/month",
    type: "Remote",
    skills: ["Marketing", "Analytics", "Social Media"],
    matchScore: 72
  },
  {
    id: 3,
    title: "UX Designer",
    company: "Design Studio",
    location: "Cape Town, SA",
    salary: "$2,200/month",
    type: "Full-time",
    skills: ["Design", "Figma", "User Research"],
    matchScore: 68
  }
];

// AI Mock Responses
const generateAIResponse = (message, userContext) => {
  const { wallet, cart, activities, user } = userContext;
  const lowerMessage = message.toLowerCase();

  // Contextual responses based on user data
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
    if (lowerMessage.includes('job') || lowerMessage.includes('career')) {
      return {
        text: `Based on your interests in ${user.interests || 'technology and design'}, I recommend focusing on Frontend Developer roles. Your marketplace activity shows an eye for design - companies like TechFlow Africa would be perfect! Your current spending patterns suggest you're tech-savvy, which aligns well with these positions.`,
        suggestions: ['View Frontend Developer Jobs', 'Update Your Skills', 'Connect with Tech Network']
      };
    }
    if (lowerMessage.includes('product') || lowerMessage.includes('buy')) {
      const spentAmount = Math.abs(wallet.transactions.reduce((sum, t) => t.amount < 0 ? sum + t.amount : sum, 0));
      return {
        text: `Looking at your purchase history (you've spent $${spentAmount.toFixed(2)} recently), I notice you enjoy quality artisan products and sustainable tech. I'd recommend the Bluetooth Headphones - they complement your tech purchases and work great for remote jobs!`,
        suggestions: ['View Recommended Products', 'Set Budget Alert', 'Compare Prices']
      };
    }
  }

  if (lowerMessage.includes('budget') || lowerMessage.includes('money') || lowerMessage.includes('spend')) {
    const avgSpending = Math.abs(wallet.transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)) / 3;
    return {
      text: `Your spending pattern shows you invest about $${avgSpending.toFixed(2)} per transaction, mostly on quality items. Your wallet balance of $${wallet.balance.toFixed(2)} is healthy! Consider setting aside 20% for career development - maybe investing in that Business Consulting Package to boost your professional growth.`,
      suggestions: ['Create Savings Goal', 'View Spending Analytics', 'Investment Options']
    };
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return {
      text: `Hi ${user.name}! 👋 I'm Mosso, your AI companion across EverySing. I've been analyzing your activity - you have ${cart.length} items in your cart and your last purchase shows great taste in sustainable products! How can I help you make smarter decisions today?`,
      suggestions: ['Get Recommendations', 'Analyze My Spending', 'Find Career Opportunities']
    };
  }

  if (lowerMessage.includes('insight') || lowerMessage.includes('analytics') || lowerMessage.includes('trend')) {
    return {
      text: `Here are some personalized insights: Your purchasing behavior suggests you value quality over quantity - 87% of your purchases are from highly-rated sellers. Your activity timing shows you're most active during business hours, indicating potential for remote work opportunities. Your interests align with 73% of the tech community on our platform!`,
      suggestions: ['Deep Dive Analytics', 'Community Connections', 'Trend Predictions']
    };
  }

  // Default intelligent response
  return {
    text: `I understand you're asking about "${message}". As your AI assistant, I'm constantly learning from your activities across marketplace, wallet, social feed, and job searches. Your unified profile helps me provide personalized insights. What specific area would you like me to analyze for you?`,
    suggestions: ['Marketplace Insights', 'Career Guidance', 'Financial Planning']
  };
};

// Context for unified state management
const EverySingContext = createContext();

const EverySingProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "Kemi Adebayo",
    email: "kemi@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332446c?w=150",
    isLoggedIn: false,
    interests: "technology, design, sustainable living",
    aiPersonality: "helpful, insightful, growth-oriented"
  });

  const [wallet, setWallet] = useState({
    balance: 1250.75,
    currency: "USD",
    transactions: [
      { id: 1, type: "purchase", amount: -45.99, description: "African Wax Print Dress", date: "2025-03-15", category: "Fashion" },
      { id: 2, type: "deposit", amount: 500.00, description: "Mobile Money Deposit", date: "2025-03-14", category: "Income" },
      { id: 3, type: "purchase", amount: -28.50, description: "Handcrafted Wooden Bowl", date: "2025-03-13", category: "Home" }
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
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      message: `Welcome ${user.name}! I'm Aya, your AI assistant. I've analyzed your activity and I'm ready to provide personalized insights across all your EverySing modules!`,
      timestamp: new Date(),
      suggestions: ['Get Smart Recommendations', 'Analyze My Behavior', 'Career Insights']
    }
  ]);

  const [recommendations, setRecommendations] = useState({
    products: [],
    jobs: [],
    insights: []
  });

  // Generate AI recommendations based on user behavior
  const generateRecommendations = () => {
    const userSpending = wallet.transactions.filter(t => t.amount < 0);
    const categories = [...new Set(userSpending.map(t => t.category))];
    
    // Product recommendations
    const productRecs = mockProducts.filter(p => 
      categories.includes(p.category) || 
      p.tags.some(tag => user.interests.includes(tag))
    ).slice(0, 3);

    // Job recommendations based on purchase patterns
    const jobRecs = mockJobs.map(job => ({
      ...job,
      aiReason: `Matches your ${categories.join(', ')} interests and spending pattern`
    })).slice(0, 2);

    // AI insights
    const insights = [
      `Your ${categories[0]} purchases show sophisticated taste - you prefer quality over quantity`,
      `Based on your wallet activity, you're a strategic spender with good financial habits`,
      `Your engagement patterns suggest you'd excel in remote work environments`
    ];

    setRecommendations({ products: productRecs, jobs: jobRecs, insights });
  };

  useEffect(() => {
    if (user.isLoggedIn) {
      generateRecommendations();
    }
  }, [user.isLoggedIn, wallet.transactions, activities]);

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
          date: new Date().toISOString().split('T')[0],
          category: cart[0]?.category || "General"
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

      // Clear cart and regenerate recommendations
      setCart([]);
      setTimeout(generateRecommendations, 1000);
      
      // Add AI insight about purchase
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'ai',
          message: `Great purchase! I noticed you bought items worth $${total.toFixed(2)}. Based on this pattern, you might also like our recommended products below. Your spending shows you value quality - keep it up!`,
          timestamp: new Date(),
          suggestions: ['View Similar Products', 'Set Budget Alert', 'Track Spending']
        }]);
      }, 2000);
      
      alert("Purchase successful! Check your activity feed and see what Aya thinks!");
    } else {
      alert("Insufficient wallet balance!");
    }
  };

  const sendAIMessage = (message) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      message,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Generate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message, { user, wallet, cart, activities });
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        message: aiResponse.text,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };

      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const login = () => {
    setUser(prev => ({ ...prev, isLoggedIn: true }));
  };

  const logout = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    setCurrentView('dashboard');
    setAiChatOpen(false);
  };

  return (
    <EverySingContext.Provider value={{
      user, setUser, login, logout,
      wallet, setWallet,
      cart, setCart, addToCart, purchaseCart,
      activities, setActivities,
      currentView, setCurrentView,
      aiChatOpen, setAiChatOpen,
      chatMessages, setChatMessages, sendAIMessage,
      recommendations, generateRecommendations,
      mockProducts, mockJobs
    }}>
      {children}
    </EverySingContext.Provider>
  );
};

// Components
const AIFloatingButton = () => {
  const { aiChatOpen, setAiChatOpen, user } = useContext(EverySingContext);

  if (!user.isLoggedIn) return null;

  return (
    <button
      onClick={() => setAiChatOpen(!aiChatOpen)}
      className={`fixed bottom-20 md:bottom-8 right-4 z-50 w-14 h-14 rounded-full shadow-lg transition-all transform hover:scale-110 ${
        aiChatOpen 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
      } text-white flex items-center justify-center`}
    >
      {aiChatOpen ? '✕' : '🤖'}
    </button>
  );
};

const AIChat = () => {
  const { aiChatOpen, chatMessages, sendAIMessage, user } = useContext(EverySingContext);
  const [inputMessage, setInputMessage] = useState('');

  if (!aiChatOpen || !user.isLoggedIn) return null;

  const handleSend = () => {
    if (inputMessage.trim()) {
      sendAIMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendAIMessage(suggestion);
  };

  return (
    <div className="fixed bottom-36 md:bottom-24 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl z-40 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="font-semibold">Aya AI Assistant</h3>
            <p className="text-xs opacity-90">Your unified intelligence</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-3 rounded-lg ${
              msg.sender === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <p className="text-sm">{msg.message}</p>
              {msg.suggestions && (
                <div className="mt-2 space-y-1">
                  {msg.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left text-xs bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded transition-colors"
                    >
                      💡 {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Aya anything..."
            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSend}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const AIRecommendations = ({ type = 'products' }) => {
  const { recommendations, setCurrentView, addToCart } = useContext(EverySingContext);

  if (type === 'products') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">🤖</span>
          <h3 className="text-lg font-semibold text-gray-800">AI Recommendations</h3>
        </div>
        
        <div className="space-y-4">
          {recommendations.products.map(product => (
            <div key={product.id} className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
              <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{product.name}</h4>
                <p className="text-sm text-purple-600">${product.price}</p>
              </div>
              <button
                onClick={() => addToCart(product)}
                className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

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
            <div className="hidden md:flex items-center space-x-2 bg-white bg-opacity-20 px-3 py-1 rounded-full">
              <span className="text-sm">🤖</span>
              <span className="text-xs">AI-Powered</span>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            {['dashboard', 'marketplace', 'social', 'wallet', 'jobs', 'ai-analytics'].map(view => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-3 py-2 rounded-lg transition-colors capitalize ${
                  currentView === view 
                    ? 'bg-white bg-opacity-20 font-semibold' 
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
              >
                {view === 'ai-analytics' ? '🧠 AI' : view}
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
          <p className="text-gray-600">Your AI-Powered Digital Ecosystem</p>
          <img 
            src="https://images.unsplash.com/photo-1556740714-a8395b3bf30f" 
            alt="Digital Platform"
            className="w-48 h-32 object-cover rounded-lg mx-auto mt-4"
          />
        </div>

        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">🤖 New AI Features:</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Aya AI Assistant with unified intelligence</li>
              <li>• Smart recommendations across all modules</li>
              <li>• Predictive analytics & insights</li>
              <li>• AI-powered job matching</li>
              <li>• Contextual spending analysis</li>
            </ul>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">Core Features:</h3>
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
            Try Demo with AI Features
          </button>

          <p className="text-xs text-gray-500 text-center">
            This is a demo with mock AI for showcasing intelligent platform features
          </p>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, wallet, activities, setCurrentView, recommendations } = useContext(EverySingContext);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user.name}! 👋</h2>
        <p className="text-gray-600">Your AI-powered unified digital life at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Wallet Card */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">💰 Smart Wallet</h3>
          <p className="text-3xl font-bold">${wallet.balance.toFixed(2)}</p>
          <p className="text-sm opacity-90 mt-2">🤖 AI suggests saving 20% monthly</p>
          <button 
            onClick={() => setCurrentView('wallet')}
            className="mt-4 bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
          >
            View AI Insights
          </button>
        </div>

        {/* Marketplace Card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">🛒 AI Marketplace</h3>
          <p className="text-sm mb-4">Personalized recommendations waiting!</p>
          <p className="text-xs opacity-90">🤖 {recommendations.products.length} AI-curated items</p>
          <button 
            onClick={() => setCurrentView('marketplace')}
            className="mt-4 bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
          >
            Shop Smart
          </button>
        </div>

        {/* AI Analytics Card */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">🧠 AI Analytics</h3>
          <p className="text-sm mb-4">Discover insights about your behavior</p>
          <p className="text-xs opacity-90">🤖 {recommendations.insights.length} new insights available</p>
          <button 
            onClick={() => setCurrentView('ai-analytics')}
            className="mt-4 bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
          >
            View Analytics
          </button>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AIRecommendations type="products" />
        
        {/* Quick Insights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">💡</span>
            <h3 className="text-lg font-semibold text-gray-800">AI Insights</h3>
          </div>
          <div className="space-y-3">
            {recommendations.insights.map((insight, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
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
  const { mockProducts, addToCart, recommendations } = useContext(EverySingContext);
  const [filter, setFilter] = useState('all');

  const filteredProducts = filter === 'ai-recommended' 
    ? recommendations.products 
    : filter === 'all' 
    ? mockProducts 
    : mockProducts.filter(p => p.category.toLowerCase() === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🛒 AI-Powered Marketplace</h2>
        <p className="text-gray-600">Discover products tailored to your interests and behavior</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {['all', 'ai-recommended', 'fashion', 'electronics', 'home & living', 'beauty', 'services'].map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-lg transition-colors capitalize ${
              filter === category 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {category === 'ai-recommended' ? '🤖 AI Picks' : category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
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
              
              {filter === 'ai-recommended' && (
                <div className="mb-3 p-2 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-600">🤖 AI: Matches your preferences</p>
                </div>
              )}
              
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

const AIAnalytics = () => {
  const { user, wallet, activities, recommendations } = useContext(EverySingContext);

  const spendingByCategory = wallet.transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const totalSpent = Object.values(spendingByCategory).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🧠 AI Analytics Dashboard</h2>
        <p className="text-gray-600">Discover intelligent insights about your EverySing journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Spending Intelligence */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">💳 Spending Intelligence</h3>
          <p className="text-3xl font-bold">${totalSpent.toFixed(2)}</p>
          <p className="text-sm opacity-90 mt-2">Total across all categories</p>
          <div className="mt-3 text-xs space-y-1">
            {Object.entries(spendingByCategory).map(([category, amount]) => (
              <div key={category} className="flex justify-between">
                <span>{category}:</span>
                <span>${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Behavior Score */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">📊 Behavior Score</h3>
          <p className="text-3xl font-bold">87/100</p>
          <p className="text-sm opacity-90 mt-2">Excellent financial habits</p>
          <div className="mt-3 text-xs">
            <div className="bg-white bg-opacity-20 rounded-full h-2 mb-2">
              <div className="bg-white h-2 rounded-full" style={{width: '87%'}}></div>
            </div>
            <p>Quality-focused purchases</p>
          </div>
        </div>

        {/* Prediction Engine */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">🔮 AI Predictions</h3>
          <p className="text-sm mb-2">Next month you'll likely:</p>
          <div className="text-xs space-y-1">
            <p>• Spend $180-220 on Fashion</p>
            <p>• Buy 2-3 Tech products</p>
            <p>• Save 23% of income</p>
            <p>• Apply to 5+ jobs</p>
          </div>
        </div>
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🤖 AI Insights</h3>
          <div className="space-y-4">
            {recommendations.insights.map((insight, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500">
                <p className="text-gray-700">{insight}</p>
              </div>
            ))}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-700">Your activity pattern suggests you're most productive during morning hours - perfect for remote work opportunities!</p>
            </div>
          </div>
        </div>

        {/* Activity Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📈 Activity Analysis</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Most Active Module</span>
              <span className="font-semibold text-orange-500">Marketplace</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Preferred Shopping Time</span>
              <span className="font-semibold text-green-500">Evenings</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Social Engagement</span>
              <span className="font-semibold text-blue-500">High</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Career Interest Level</span>
              <span className="font-semibold text-purple-500">Growing</span>
            </div>
          </div>
        </div>
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
            <div className="bg-purple-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-purple-700">🤖 AI will analyze this purchase to improve your recommendations!</p>
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
      <h2 className="text-3xl font-bold text-gray-800 mb-8">💰 AI-Powered Wallet</h2>
      
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-8 mb-8">
        <h3 className="text-xl font-semibold mb-2">Current Balance</h3>
        <p className="text-4xl font-bold">${wallet.balance.toFixed(2)} {wallet.currency}</p>
        <p className="text-sm opacity-90 mt-2">🤖 AI suggests saving $250 this month</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Transactions</h3>
        
        <div className="space-y-4">
          {wallet.transactions.map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  {transaction.category}
                </span>
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
      <h2 className="text-3xl font-bold text-gray-800 mb-8">💼 AI-Matched Job Opportunities</h2>
      
      <div className="space-y-4">
        {mockJobs.map(job => (
          <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-1">{job.company}</p>
                <p className="text-gray-500 text-sm mb-2">{job.location}</p>
                
                <div className="mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-purple-600">🤖 AI Match: {job.matchScore}%</span>
                  </div>
                  <p className="text-xs text-gray-600 bg-purple-50 p-2 rounded">
                    {job.aiReason || "Matches your interests and skills"}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 mb-3">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {job.salary}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {job.type}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {job.skills.map(skill => (
                    <span key={skill} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
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
    { id: 'ai-analytics', icon: '🧠', label: 'AI' },
    { id: 'wallet', icon: '💰', label: 'Wallet' }
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
                  {currentView === 'ai-analytics' && <AIAnalytics />}
                </main>
                <MobileNav />
                <AIFloatingButton />
                <AIChat />
              </>
            );
          }}
        </EverySingContext.Consumer>
      </div>
    </EverySingProvider>
  );
}

export default App;