"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Store, ShoppingBag, Heart, MessageCircle, Send, Bookmark, 
  MapPin, ShieldCheck, Share2, Play, Plus, Upload, Loader2, CheckCircle2, AlertCircle, Trash2
} from "lucide-react";
import ProductMedia from "@/components/ProductMedia";

// Mock Businesses
const MOCK_STORES = [
  {
    id: "s1",
    name: "Bella Artisan Bakery",
    logo: "🥖",
    banner: "bg-gradient-to-r from-amber-200 to-orange-100",
    category: "Food & Beverages",
    description: "Sourdough bread, artisanal pastries, and freshly brewed local coffee made daily.",
    rating: 4.9,
    reviews: 142,
    serviceArea: "Coimbatore City",
    hours: "7:00 AM - 8:00 PM",
    verified: true,
    followers: 1200,
  },
  {
    id: "s2",
    name: "GreenThumb Plant Nursery",
    logo: "🌿",
    banner: "bg-gradient-to-r from-teal-200 to-emerald-100",
    category: "Home & Garden",
    description: "Indoor planters, organic compost, exotic succulents, and expert landscaping consultations.",
    rating: 4.7,
    reviews: 89,
    serviceArea: "Peelamedu & RS Puram",
    hours: "9:00 AM - 6:30 PM",
    verified: true,
    followers: 850,
  },
  {
    id: "s3",
    name: "Aura Handmade Clay & Crafts",
    logo: "🏺",
    banner: "bg-gradient-to-r from-rose-200 to-orange-100",
    category: "Art & Handicrafts",
    description: "Eco-friendly, hand-painted ceramic mugs, plates, and home decor items.",
    rating: 5.0,
    reviews: 43,
    serviceArea: "Worldwide Shipping",
    hours: "24/7 (Online)",
    verified: false,
    followers: 320,
  },
];

// Mock Social Commerce Posts
const MOCK_POSTS = [
  {
    id: "post1",
    storeName: "Bella Artisan Bakery",
    storeLogo: "🥖",
    time: "2 hours ago",
    content: "Golden, crispy, and fluffy sourdough boules just out of the oven! 🥖 Come grab yours before they sell out or order directly from our storefront. Buy 2 get 10% off today!",
    image: "🍞🔥",
    likes: 84,
    comments: 12,
    tags: ["#Sourdough", "#ArtisanBread", "#BakingLife"],
  },
  {
    id: "post2",
    storeName: "GreenThumb Plant Nursery",
    storeLogo: "🌿",
    time: "5 hours ago",
    content: "New arrival alert! Monstera Deliciosa and Fiddle Leaf Figs are fully restocked in our RS Puram branch. 🌱 Here's a quick demo on how to propagate them at home. Let us know if you have questions!",
    isVideo: true,
    image: "🌿📹 Propagation Demo",
    likes: 120,
    comments: 28,
    tags: ["#Monstera", "#Houseplants", "#PlantParent"],
  },
];

export default function BusinessesModule() {
  const [activeTab, setActiveTab] = useState<"directory" | "marketplace" | "feed" | "my-business">("directory");
  const [followedStores, setFollowedStores] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Real product list state from database
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // New product creation form state
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodCategory, setProdCategory] = useState("General");
  const [prodStock, setProdStock] = useState("10");
  const [prodDescription, setProdDescription] = useState("");
  const [prodSellerName, setProdSellerName] = useState("");
  const [prodSellerLocation, setProdSellerLocation] = useState("Chennai, TN");

  // Media File Upload State
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isVideoUpload, setIsVideoUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [createMessage, setCreateMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/explore/products");
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setDbProducts(data.products);
      }
    } catch (e) {
      console.error("Failed to load products:", e);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleFollow = (storeId: string) => {
    setFollowedStores((prev) =>
      prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId]
    );
  };

  const toggleLikePost = (postId: string) => {
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      setIsVideoUpload(file.type.startsWith("video/"));
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice) {
      setCreateMessage({ type: "error", text: "Product name and price are required." });
      return;
    }

    setUploading(true);
    setCreateMessage(null);

    try {
      let imageUrl: string | null = null;

      // 1. If file is attached, upload file to server via /api/upload
      if (mediaFile) {
        const formData = new FormData();
        formData.append("file", mediaFile);
        formData.append("folder", isVideoUpload ? "products/videos" : "products/photos");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.success) {
          throw new Error(uploadData.error || "Failed to upload product media file.");
        }
        imageUrl = uploadData.url;
      }

      // 2. Submit product payload to /api/products/create
      const createRes = await fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: prodName,
          price: parseFloat(prodPrice),
          category: prodCategory,
          stock: parseInt(prodStock) || 10,
          description: prodDescription,
          image: imageUrl,
          sellerName: prodSellerName || "Local Artisan Store",
          sellerLocation: prodSellerLocation,
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok || createData.error) {
        throw new Error(createData.error || createData.message || "Failed to create product.");
      }

      setCreateMessage({ type: "success", text: "Product listed & published successfully!" });

      // Reset form
      setProdName("");
      setProdPrice("");
      setProdDescription("");
      setMediaFile(null);
      setMediaPreview(null);

      // Refresh product list
      fetchProducts();
    } catch (err: any) {
      setCreateMessage({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 px-5 py-4 flex items-center gap-3">
        <Link
          href="/"
          className="p-2 -ml-2 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 active:scale-95"
          title="Back to Hub"
        >
          <ArrowLeft size={18} className="stroke-[2.5]" />
        </Link>
        <div className="flex-1">
          <h1 className="font-extrabold text-base text-slate-800">Small Scale Businesses</h1>
          <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Storefront & Marketplace</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white px-5 pt-4 pb-1 border-b border-slate-100">
        <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-none gap-2">
          {["directory", "marketplace", "feed", "my-business"].map((tab) => {
            const label =
              tab === "directory"
                ? "Stores"
                : tab === "marketplace"
                ? "Marketplace"
                : tab === "feed"
                ? "Social Feed"
                : "My Store & Add Product";
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 text-center pb-2.5 text-xs font-bold transition-all relative border-b-2 whitespace-nowrap px-1 ${
                  activeTab === tab
                    ? "text-primary border-primary"
                    : "text-slate-400 border-transparent hover:text-slate-600"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 p-5">
        
        {/* TAB 1: STORES DIRECTORY */}
        {activeTab === "directory" && (
          <div className="space-y-4">
            {MOCK_STORES.map((store) => {
              const isFollowing = followedStores.includes(store.id);
              return (
                <div
                  key={store.id}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:border-primary/20 transition-all duration-200"
                >
                  <div className={`h-16 ${store.banner} relative`}>
                    <div className="absolute -bottom-5 left-4 w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-2xl shadow-sm">
                      {store.logo}
                    </div>
                  </div>

                  <div className="p-4 pt-7 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-slate-800 text-sm">{store.name}</h4>
                          {store.verified && (
                            <span title="Business Verified" className="shrink-0 flex items-center">
                              <ShieldCheck size={14} className="text-teal-500 fill-teal-500/10" />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                          {store.category}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleFollow(store.id)}
                        className={`text-[10px] font-black px-3 py-1.5 rounded-xl border transition-all ${
                          isFollowing
                            ? "bg-slate-50 text-slate-400 border-slate-200"
                            : "bg-primary text-white border-primary shadow-sm shadow-primary/15 hover:bg-primary-light"
                        }`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      {store.description}
                    </p>

                    <div className="border-t border-slate-50 pt-2.5 text-[10px] text-slate-500 flex flex-wrap justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <MapPin size={11} className="text-slate-400" />
                        <span>Area: <span className="font-extrabold text-slate-700">{store.serviceArea}</span></span>
                      </div>
                      <span>Hours: <span className="font-extrabold text-slate-700">{store.hours}</span></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: PRODUCT MARKETPLACE */}
        {activeTab === "marketplace" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Live Small Business Goods</h3>
              <button 
                onClick={fetchProducts} 
                className="text-[10px] font-bold text-primary hover:underline"
              >
                Refresh List
              </button>
            </div>

            {loadingProducts ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-primary mb-2" size={24} />
                <p className="text-xs text-slate-400 font-bold">Loading products...</p>
              </div>
            ) : dbProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {dbProducts.map((prod) => {
                  const inWishlist = wishlist.includes(prod.id);
                  return (
                    <div
                      key={prod.id}
                      className="bg-white border border-slate-100 rounded-2xl overflow-hidden p-3 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:border-primary/20 transition-all duration-200 flex flex-col justify-between gap-3 relative"
                    >
                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(prod.id)}
                        className="absolute top-2.5 right-2.5 p-1.5 bg-white/95 rounded-full shadow-sm text-slate-400 hover:text-primary transition-colors z-10"
                      >
                        <Heart className={`w-3.5 h-3.5 ${inWishlist ? "fill-primary text-primary" : ""}`} />
                      </button>

                      {/* Product Media Display */}
                      <Link href={`/customer/explore/products/${prod.id}`} className="block">
                        <div className="aspect-square rounded-xl bg-amber-50/50 border border-amber-100 flex items-center justify-center shadow-inner relative overflow-hidden">
                          <ProductMedia src={prod.image} alt={prod.name} />
                        </div>
                      </Link>

                      <div className="space-y-1">
                        <Link href={`/customer/explore/products/${prod.id}`}>
                          <h5 className="text-[11px] font-black text-slate-800 leading-tight truncate hover:text-primary transition-colors">{prod.name}</h5>
                        </Link>
                        <p className="text-[9px] text-slate-400 font-bold truncate">By {prod.sellerName || "Local Business"}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-50 pt-2 mt-0.5">
                        <div>
                          <span className="text-xs font-black text-primary">₹{prod.price}</span>
                          <span className="text-[9px] text-slate-400 block font-bold">Qty: {prod.stock}</span>
                        </div>
                        <Link 
                          href={`/customer/explore/products/${prod.id}`}
                          className="bg-primary/10 hover:bg-primary text-primary hover:text-white transition-colors text-[9px] font-extrabold px-2 py-1 rounded-lg"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                <p className="text-xs text-slate-400 font-bold">No products uploaded yet.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SOCIAL COMMERCE FEED */}
        {activeTab === "feed" && (
          <div className="space-y-4">
            {MOCK_POSTS.map((post) => {
              const isLiked = likedPosts.includes(post.id);
              return (
                <div
                  key={post.id}
                  className="bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)] space-y-3"
                >
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-lg border border-slate-100">
                      {post.storeLogo}
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-800 leading-tight">{post.storeName}</h5>
                      <span className="text-[9px] text-slate-400 font-bold">{post.time}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                    {post.content}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-bold text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Attachment/Video Placeholder */}
                  <div className="aspect-[4/3] w-full rounded-2xl bg-slate-100 border border-slate-200/50 flex flex-col items-center justify-center text-3xl font-extrabold text-slate-300 relative shadow-inner overflow-hidden">
                    <div className="absolute inset-0 bg-slate-800/5 backdrop-blur-[1px] pointer-events-none"></div>
                    <span>{post.image}</span>
                    {post.isVideo && (
                      <div className="w-10 h-10 rounded-full bg-primary/90 text-white flex items-center justify-center absolute shadow-lg border border-white/20 animate-pulse cursor-pointer">
                        <Play size={16} className="fill-white translate-x-0.5" />
                      </div>
                    )}
                  </div>

                  {/* Interactions */}
                  <div className="border-t border-slate-50 pt-3 flex justify-between text-slate-400 text-xs font-bold">
                    <button
                      onClick={() => toggleLikePost(post.id)}
                      className={`flex items-center gap-1 hover:text-primary transition-colors ${
                        isLiked ? "text-primary" : ""
                      }`}
                    >
                      <Heart size={14} className={isLiked ? "fill-primary" : ""} />
                      <span>{post.likes + (isLiked ? 1 : 0)}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      <span>{post.comments}</span>
                    </div>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Share2 size={14} />
                      <span>Share</span>
                    </button>
                    <button className="text-primary hover:text-dark transition-colors font-extrabold text-[10px] uppercase">
                      Contact Seller
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: MY STORE & UPLOAD PRODUCTS */}
        {activeTab === "my-business" && (
          <div className="space-y-6">
            
            {/* Product Creation & Media Upload Form */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                  ➕
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base">Worker / Seller: Add New Product</h3>
                  <p className="text-xs text-slate-400 font-medium">Upload photos/videos & details for customers to view</p>
                </div>
              </div>

              {createMessage && (
                <div className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                  createMessage.type === "success" 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}>
                  {createMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{createMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleCreateProduct} className="space-y-4">
                
                {/* Media File Upload Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Product Photo or Video</label>
                  
                  <div className="relative border-2 border-dashed border-slate-200 hover:border-primary/50 rounded-2xl p-4 bg-slate-50/50 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />

                    {mediaPreview ? (
                      <div className="w-full aspect-[16/9] rounded-xl overflow-hidden relative bg-black flex items-center justify-center">
                        {isVideoUpload ? (
                          <video src={mediaPreview} controls className="w-full h-full object-cover" />
                        ) : (
                          <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                        )}
                        <span className="absolute top-2 right-2 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-20">
                          {isVideoUpload ? "Video Attached" : "Photo Attached"}
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2 py-3">
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-100 text-primary flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform">
                          <Upload size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">Click or Drag & Drop Image/Video</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Supports PNG, JPG, WEBP, MP4, WEBM</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      placeholder="e.g. Handmade Ceramic Mug"
                      className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      placeholder="e.g. 250"
                      className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Category</label>
                    <select 
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                    >
                      <option value="General">General</option>
                      <option value="Food & Beverages">Food & Beverages</option>
                      <option value="Home & Garden">Home & Garden</option>
                      <option value="Art & Handicrafts">Art & Handicrafts</option>
                      <option value="Apparel & Design">Apparel & Design</option>
                      <option value="Cosmetics & Beauty">Cosmetics & Beauty</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Available Stock Qty</label>
                    <input
                      type="number"
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                      placeholder="10"
                      className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Seller / Shop Name</label>
                    <input
                      type="text"
                      value={prodSellerName}
                      onChange={(e) => setProdSellerName(e.target.value)}
                      placeholder="e.g. Natural Organic Crafts"
                      className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Seller Location</label>
                    <input
                      type="text"
                      value={prodSellerLocation}
                      onChange={(e) => setProdSellerLocation(e.target.value)}
                      placeholder="e.g. Chennai, TN"
                      className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Product Description</label>
                  <textarea
                    rows={3}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    placeholder="Describe material, size, usage, ingredients..."
                    className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-primary hover:bg-primary-light text-white text-xs font-bold py-3.5 rounded-xl shadow-sm shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Uploading & Publishing Product...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Publish Product to Marketplace</span>
                    </>
                  )}
                </button>

              </form>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
