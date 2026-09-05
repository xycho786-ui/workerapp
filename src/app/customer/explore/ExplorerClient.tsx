"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  ArrowLeft, Search, Star, ShieldCheck, Heart, ShoppingCart, 
  Trash2, Plus, Minus, X, Check, Loader2, Play, CreditCard, ExternalLink, Ship, Send
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import CustomerSidebarDrawer from "@/components/CustomerSidebarDrawer";
import ProductMedia from "@/components/ProductMedia";

interface ExplorerClientProps {
  initialFreelancers: any[];
  initialProducts: any[];
  initialCart: any[];
  initialWishlist: string[];
  initialTab: string;
  searchQuery: string;
  userId: string;
}

export default function ExplorerClient({
  initialFreelancers,
  initialProducts,
  initialCart,
  initialWishlist,
  initialTab,
  searchQuery,
  userId
}: ExplorerClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams && searchParams.get("openCart") === "true") {
      setIsCartOpen(true);
    }
  }, [searchParams]);

  // Core state
  const [activeTab, setActiveTab] = useState<"freelancers" | "projects" | "products">(initialTab as any);
  const [search, setSearch] = useState(searchQuery);
  const [inputValue, setInputValue] = useState(searchQuery);

  // Debounce search state updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue);
    }, 200);
    return () => clearTimeout(handler);
  }, [inputValue]);

  const [activeFilter, setActiveFilter] = useState("All");

  // Cart & Wishlist state
  const [cart, setCart] = useState<any[]>(initialCart);
  const [wishlist, setWishlist] = useState<string[]>(initialWishlist);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutProcessing, setIsCheckoutProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutOrder, setCheckoutOrder] = useState<any | null>(null);

  // Order Tracking state
  const [orders, setOrders] = useState<any[]>([]);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<any | null>(null);

  // Load orders history
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/explore/order");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Failed to load orders:", error);
      }
    }
    fetchOrders();
  }, [checkoutSuccess]);

  // Tab filter categories
  const filtersMap = {
    freelancers: ["All", "Designer", "Developer", "Writer"],
    projects: ["All", "Design", "Development", "Writing"],
    products: ["All", "Home", "Electronics", "Fashion"]
  };

  const currentFilters = filtersMap[activeTab];

  // Reset category filter when tab changes
  useEffect(() => {
    setActiveFilter("All");
  }, [activeTab]);

  // 1. Filter Freelancers
  const filteredFreelancers = useMemo(() => {
    return initialFreelancers.filter(f => {
      if (activeFilter !== "All") {
        if (!f.profession.some((p: string) => p.toLowerCase().includes(activeFilter.toLowerCase()))) return false;
      }
      if (search.trim()) {
        const query = search.toLowerCase();
        return f.user.name.toLowerCase().includes(query) || f.skills.some((s: string) => s.toLowerCase().includes(query));
      }
      return true;
    });
  }, [initialFreelancers, activeFilter, search]);

  // Mock projects list (Works) matching the design reference
  const mockProjects = [
    {
      id: "p_1",
      title: "Website Design",
      description: "Need a modern, premium landing page design for our SaaS business. Prefer Figma deliverables.",
      budget: 5000,
      category: "Design",
      postedBy: "V-Tech Tech",
      avatar: "💻"
    },
    {
      id: "p_2",
      title: "Mobile App Development",
      description: "Looking for an expert React Native developer to build a fitness tracking app with offline mode.",
      budget: 15000,
      category: "Development",
      postedBy: "FitLife Inc",
      avatar: "🏋️"
    },
    {
      id: "p_3",
      title: "Logo Design",
      description: "Need a minimalist logo and brand kit design for an organic food startup. Fast delivery preferred.",
      budget: 1000,
      category: "Design",
      postedBy: "Nourish Foods",
      avatar: "🍎"
    },
    {
      id: "p_4",
      title: "Technical Writing",
      description: "Need a developer writer to write 5 blog posts detailing API integrations in Node.js.",
      budget: 1200,
      category: "Writing",
      postedBy: "DevScribe",
      avatar: "✍️"
    }
  ];

  // 2. Filter Projects
  const filteredProjects = useMemo(() => {
    return mockProjects.filter(p => {
      if (activeFilter !== "All") {
        if (p.category !== activeFilter) return false;
      }
      if (search.trim()) {
        const query = search.toLowerCase();
        return p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      }
      return true;
    });
  }, [activeFilter, search]);

  // 3. Filter Products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      if (activeFilter !== "All") {
        if (p.category.toLowerCase() !== activeFilter.toLowerCase()) return false;
      }
      if (search.trim()) {
        const query = search.toLowerCase();
        return p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.sellerName.toLowerCase().includes(query);
      }
      return true;
    });
  }, [initialProducts, activeFilter, search]);

  // Wishlist Action
  const toggleWishlist = async (productId: string) => {
    // Optimistic UI update
    const isAdded = wishlist.includes(productId);
    if (isAdded) {
      setWishlist(prev => prev.filter(id => id !== productId));
    } else {
      setWishlist(prev => [...prev, productId]);
    }

    try {
      const res = await fetch("/api/explore/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
    } catch (error) {
      // Revert if error
      if (isAdded) {
        setWishlist(prev => [...prev, productId]);
      } else {
        setWishlist(prev => prev.filter(id => id !== productId));
      }
    }
  };

  // Cart Actions
  const addToCart = async (product: any) => {
    // Optimistic cart add
    const existing = cart.find(item => item.productId === product.id);
    let updatedCart = [...cart];
    if (existing) {
      updatedCart = cart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      updatedCart.push({ id: `temp-${Date.now()}`, productId: product.id, quantity: 1, product });
    }
    setCart(updatedCart);

    try {
      const res = await fetch("/api/explore/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: existing ? existing.quantity + 1 : 1 })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      // Update actual item from API response to get real DB IDs
      if (data.cartItem) {
        setCart(prev => prev.map(item => item.productId === product.id ? data.cartItem : item));
      }
    } catch (error) {
      setCart(cart); // Rollback
    }
  };

  const updateCartQty = async (productId: string, quantity: number) => {
    const existing = cart.find(item => item.productId === productId);
    if (!existing) return;

    const oldCart = [...cart];
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.productId !== productId));
    } else {
      setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
    }

    try {
      const res = await fetch("/api/explore/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
    } catch (error) {
      setCart(oldCart); // Rollback
    }
  };

  const removeFromCart = async (productId: string) => {
    const oldCart = [...cart];
    setCart(prev => prev.filter(item => item.productId !== productId));

    try {
      const res = await fetch(`/api/explore/cart?productId=${productId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
    } catch (error) {
      setCart(oldCart);
    }
  };

  // Cart total summary
  const { subtotal, totalAmount } = useMemo(() => {
    const sub = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const fee = sub > 0 ? 25 : 0;
    return { subtotal: sub, totalAmount: sub + fee };
  }, [cart]);

  // Checkout function
  const handleCheckout = async () => {
    setIsCheckoutProcessing(true);
    try {
      const res = await fetch("/api/explore/order", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setCheckoutOrder(data.order);
        setCheckoutSuccess(true);
        setCart([]); // Clear cart
      } else {
        alert(data.error || "Checkout failed. Please top up your wallet.");
      }
    } catch (error: any) {
      alert("Checkout failed: " + error.message);
    } finally {
      setIsCheckoutProcessing(false);
    }
  };

  // Determine colors based on active tab
  const themeColors = {
    freelancers: {
      primary: "bg-purple-600 hover:bg-purple-700",
      text: "text-purple-600",
      bgLight: "bg-purple-50",
      border: "border-purple-100",
      accent: "text-purple-700 bg-purple-50 border-purple-100",
      gradient: "from-purple-500 to-indigo-600",
      tabUnderline: "border-purple-600 text-purple-600"
    },
    projects: {
      primary: "bg-blue-600 hover:bg-blue-700",
      text: "text-blue-600",
      bgLight: "bg-blue-50",
      border: "border-blue-100",
      accent: "text-blue-700 bg-blue-50 border-blue-100",
      gradient: "from-blue-500 to-indigo-600",
      tabUnderline: "border-blue-600 text-blue-600"
    },
    products: {
      primary: "bg-amber-600 hover:bg-amber-700",
      text: "text-amber-600",
      bgLight: "bg-amber-50",
      border: "border-amber-100",
      accent: "text-amber-700 bg-amber-50 border-amber-100",
      gradient: "from-amber-500 to-orange-600",
      tabUnderline: "border-amber-600 text-amber-600"
    }
  };

  const activeTheme = themeColors[activeTab];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 pb-20 font-sans">
      
      {/* 1. Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-10 border-b border-slate-100 flex items-center justify-between shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="p-2 -ml-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-xl transition-all cursor-pointer border-none bg-transparent"
            title="Go Back"
          >
            <ArrowLeft size={20} className="stroke-[2.5]" />
          </button>
          <CustomerSidebarDrawer />
          <div>
            <h1 className="text-base font-black text-slate-800">Explorer</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Freelancers & Products</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Orders Tracking Button */}
          {orders.length > 0 && (
            <button 
              onClick={() => {
                setTrackingOrder(orders[0]); // Default to tracking latest order
                setIsTrackingOpen(true);
              }}
              className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
            >
              <Ship size={14} className="text-emerald-500" />
              <span>Track Orders</span>
            </button>
          )}

          {/* Cart Trigger */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 flex items-center justify-center text-slate-600 relative transition-all cursor-pointer"
          >
            <ShoppingCart size={18} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center border border-white shadow-sm">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 2. Search & Tab Selection */}
      <div className="bg-white border-b border-slate-100 pt-4 px-5">
        {/* Search */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-slate-200 bg-slate-50 rounded-2xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 font-semibold text-slate-800 shadow-inner"
          />
        </div>

        {/* Custom Tab Selector */}
        <div className="flex border-b border-slate-100">
          {(["freelancers", "projects", "products"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-3 text-xs font-bold transition-all relative border-b-2 capitalize ${
                activeTab === tab 
                  ? activeTheme.tabUnderline 
                  : "text-slate-400 border-transparent hover:text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto py-3.5 scrollbar-none -mx-5 px-5">
          {currentFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all border whitespace-nowrap ${
                activeFilter === filter
                  ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                  : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Tab Grid Content */}
      <main className="flex-1 overflow-y-auto p-5">
        
        {/* FREELANCERS TAB */}
        {activeTab === "freelancers" && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Freelancers: Find skilled professionals</h3>
            
            {filteredFreelancers.length > 0 ? (
              filteredFreelancers.map((freelancer) => (
                <div 
                  key={freelancer.id}
                  className="bg-white rounded-3xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:border-purple-200 transition-all flex flex-col gap-3 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-black text-2xl relative shadow-inner">
                        💼
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-slate-800 text-sm leading-tight group-hover:text-purple-600 transition-colors">
                            {freelancer.user.name}
                          </h4>
                          <ShieldCheck size={14} className="text-teal-500" />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                          {freelancer.profession[0]} Specialist
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-800">₹{freelancer.hourlyRate || 500}</span>
                      <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Per Hr</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100/50">
                    Experienced freelance specialist available for bespoke projects and remote contracts.
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {freelancer.skills.map((skill: string) => (
                      <span key={skill} className="text-[9px] font-bold bg-purple-50/50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="border-t border-slate-50 pt-3 mt-1 flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={12} className="fill-amber-500" />
                      <span>{freelancer.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-medium">({freelancer.totalReviews} reviews)</span>
                    </div>
                    <Link 
                      href={`/customer/chat?workerId=${freelancer.id}`}
                      className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide"
                    >
                      Contact Freelancer
                      <ExternalLink size={10} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                <p className="text-xs text-slate-400 font-bold">No freelancers found.</p>
              </div>
            )}
          </div>
        )}

        {/* WORKS / PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Projects: Active client proposals</h3>
            
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div 
                  key={project.id}
                  className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:border-blue-200 transition-all flex flex-col gap-3 group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl shadow-inner">
                        {project.avatar}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-[14px] leading-tight group-hover:text-blue-600 transition-colors">{project.title}</h4>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase mt-0.5">By {project.postedBy}</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 text-blue-700 border border-blue-100/50 rounded-xl px-2.5 py-1 text-[10px] font-extrabold">
                      ₹{project.budget}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                    {project.description}
                  </p>

                  <div className="border-t border-slate-50 pt-3 mt-1.5 flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-bold">Category: <span className="text-slate-600 font-black">{project.category}</span></span>
                    <button 
                      onClick={() => alert("Connecting to client regarding project: " + project.title)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      Apply / Contact
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                <p className="text-xs text-slate-400 font-bold">No projects found.</p>
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Products: Discover small business goods</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => {
                  const isWishlisted = wishlist.includes(prod.id);
                  return (
                    <div 
                      key={prod.id}
                      className="bg-white rounded-3xl p-3 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:border-amber-200 transition-all flex flex-col justify-between gap-3 relative group"
                    >
                      {/* Wishlist Heart Toggle */}
                      <button 
                        onClick={() => toggleWishlist(prod.id)}
                        className="absolute top-3 right-3 p-1.5 bg-white/95 rounded-full border border-slate-100 text-slate-400 hover:text-primary transition-colors z-10 shadow-sm"
                      >
                        <Heart size={14} className={isWishlisted ? "fill-primary text-primary" : ""} />
                      </button>

                      {/* Product details page link */}
                      <Link href={`/customer/explore/products/${prod.id}`} className="block">
                        <div className="aspect-square rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center justify-center shadow-inner relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                          <ProductMedia src={prod.image} alt={prod.name} />
                        </div>
                      </Link>

                      <div className="space-y-1">
                        <Link href={`/customer/explore/products/${prod.id}`} className="block hover:text-amber-600 transition-colors">
                          <h4 className="text-[12px] font-black text-slate-800 leading-tight truncate">{prod.name}</h4>
                        </Link>
                        <p className="text-[9px] text-slate-400 font-bold truncate">By {prod.sellerName}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-50 pt-2.5 mt-0.5">
                        <div>
                          <span className="text-sm font-black text-slate-800 block">₹{prod.price}</span>
                          <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Qty: {prod.stock}</span>
                        </div>
                        <button 
                          onClick={() => addToCart(prod)}
                          className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black px-3.5 py-1.5 rounded-xl transition-all shadow-sm shadow-amber-600/10 cursor-pointer active:scale-95"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold">No products found.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* 4. Cart Drawer / Modal Panel */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#09112A]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-lg font-black text-slate-800">Shopping Cart</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{cart.reduce((a, b) => a + b.quantity, 0)} Items Selected</p>
              </div>
              <button 
                onClick={() => {
                  setCheckoutSuccess(false);
                  setIsCartOpen(false);
                }} 
                className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {checkoutSuccess ? (
                /* Checkout Success View */
                <div className="flex flex-col items-center justify-center text-center py-12 h-full">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 relative">
                    <Check className="text-emerald-500 stroke-[3]" size={40} />
                    <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-25"></div>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Order Confirmed!</h3>
                  <p className="text-xs text-slate-400 font-semibold max-w-[250px] leading-relaxed mb-6">
                    Your order was successfully paid using your Wallet balance.
                  </p>
                  
                  {checkoutOrder && (
                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-8 w-full text-left space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold">Order Tracking ID</span>
                        <span className="text-slate-800 font-black">{checkoutOrder.id.substring(0, 8)}...</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-t border-slate-200/50 pt-2.5">
                        <span className="text-slate-400 font-bold">Total Amount Paid</span>
                        <span className="text-emerald-600 font-black">₹{checkoutOrder.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      setCheckoutSuccess(false);
                      setIsCartOpen(false);
                      if (checkoutOrder) {
                        setTrackingOrder(checkoutOrder);
                        setIsTrackingOpen(true);
                      }
                    }}
                    className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
                  >
                    Track Order Delivery
                  </button>
                </div>
              ) : cart.length > 0 ? (
                /* Cart Items List */
                cart.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shadow-inner flex-shrink-0 overflow-hidden">
                        <ProductMedia src={item.product.image} alt={item.product.name} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-slate-800 text-[13px] leading-tight truncate">{item.product.name}</h4>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">₹{item.product.price} each</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-2 py-1 gap-2.5">
                        <button 
                          onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                          className="text-slate-400 hover:text-slate-800 transition-colors"
                        >
                          <Minus size={12} className="stroke-[3]" />
                        </button>
                        <span className="text-xs font-black text-slate-800 min-w-[12px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQty(item.productId, item.quantity + 1)}
                          className="text-slate-400 hover:text-slate-800 transition-colors"
                        >
                          <Plus size={12} className="stroke-[3]" />
                        </button>
                      </div>
                      
                      {/* Remove Button */}
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                /* Empty Cart View */
                <div className="flex flex-col items-center justify-center text-center h-full py-12">
                  <span className="text-5xl mb-4">🛒</span>
                  <h4 className="text-sm font-extrabold text-slate-800 mb-1">Your cart is empty</h4>
                  <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                    Browse the products tab to find unique goods from local businesses.
                  </p>
                </div>
              )}
            </div>

            {/* Cart Footer Checkout block */}
            {!checkoutSuccess && cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-white space-y-4">
                <div className="space-y-2 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-800 font-extrabold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span className="text-slate-800 font-extrabold">₹25.00</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-3 text-sm font-black text-slate-800">
                    <span>Total Amount</span>
                    <span className="text-primary text-base">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isCheckoutProcessing}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-900 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  {isCheckoutProcessing ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Deducting Wallet Balance...
                    </>
                  ) : (
                    <>
                      <CreditCard size={14} />
                      Secure Wallet Checkout
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Order Delivery Tracking Drawer */}
      {isTrackingOpen && trackingOrder && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#09112A]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-t-3xl rounded-b-none sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Order Delivery Tracking</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Tracking ID: {trackingOrder.id.substring(0, 8)}</p>
              </div>
              <button 
                onClick={() => setIsTrackingOpen(false)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-full text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tracking Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Ordered Items Preview */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Items Ordered</span>
                {trackingOrder.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="truncate max-w-[200px]">{item.product.name} (x{item.quantity})</span>
                    <span className="text-slate-800 font-extrabold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Status Timeline */}
              <div className="relative pl-6 border-l-2 border-slate-200 ml-4 space-y-8 py-2">
                {/* 1. Ordered */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm flex items-center justify-center"></div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 leading-tight">Order Placed</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Your payment was processed successfully.</p>
                  </div>
                </div>

                {/* 2. Dispatched */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm flex items-center justify-center"></div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 leading-tight">Dispatched</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Seller has packaged and dispatched your items.</p>
                  </div>
                </div>

                {/* 3. In Transit */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white"></div>
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 leading-tight">In Transit (Shipped)</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Package is with local courier team, out for delivery.</p>
                  </div>
                </div>

                {/* 4. Delivered */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center"></div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 leading-tight">Delivered</h4>
                    <p className="text-[10px] text-slate-300 font-semibold mt-0.5">Package received at shipping address.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <button 
                onClick={() => setIsTrackingOpen(false)}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
              >
                Close Tracking Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
