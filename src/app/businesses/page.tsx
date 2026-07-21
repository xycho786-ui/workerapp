"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Store, ShoppingBag, Heart, MessageCircle, Send, Bookmark, MapPin, ShieldCheck, HeartOff, Share2, Play } from "lucide-react";

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

// Mock Products
const MOCK_PRODUCTS = [
  {
    id: "p1",
    name: "Fresh Sourdough Boule",
    store: "Bella Artisan Bakery",
    price: 6.5,
    rating: 4.9,
    stock: 12,
    imageBg: "bg-amber-100 text-amber-800",
    emoji: "🍞",
  },
  {
    id: "p2",
    name: "Monstera Deliciosa (Medium)",
    store: "GreenThumb Plant Nursery",
    price: 18.0,
    rating: 4.8,
    stock: 5,
    imageBg: "bg-emerald-100 text-emerald-800",
    emoji: "🪴",
  },
  {
    id: "p3",
    name: "Hand-Painted Terrazzo Mug",
    store: "Aura Handmade Clay & Crafts",
    price: 12.0,
    rating: 5.0,
    stock: 20,
    imageBg: "bg-rose-100 text-rose-800",
    emoji: "🥛",
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
          <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Ecosystem Phase 3</p>
        </div>
        <div className="text-[10px] font-extrabold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wide">
          Placeholder
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
                : "My Store";
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
            <div className="grid grid-cols-2 gap-3">
              {MOCK_PRODUCTS.map((prod) => {
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
                      {inWishlist ? (
                        <Heart className="w-3.5 h-3.5 fill-primary text-primary" />
                      ) : (
                        <Heart className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Product Image Placeholder */}
                    <div className={`aspect-square rounded-xl ${prod.imageBg} flex items-center justify-center text-4xl shadow-inner`}>
                      {prod.emoji}
                    </div>

                    <div className="space-y-1">
                      <h5 className="text-[11px] font-black text-slate-800 leading-tight truncate">{prod.name}</h5>
                      <p className="text-[9px] text-slate-400 font-bold truncate">By {prod.store}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-2 mt-0.5">
                      <div>
                        <span className="text-xs font-black text-primary">${prod.price.toFixed(2)}</span>
                        <span className="text-[9px] text-slate-400 block font-bold">Qty: {prod.stock}</span>
                      </div>
                      <button className="bg-primary/10 hover:bg-primary text-primary hover:text-white transition-colors text-[9px] font-extrabold px-2 py-1 rounded-lg">
                        Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
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

        {/* TAB 4: MY STORE HUB */}
        {activeTab === "my-business" && (
          <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center text-3xl mx-auto">
                🛍️
              </div>
              <h3 className="font-extrabold text-slate-800 text-base">Register Your Small Business</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Set up your virtual storefront, list products/services, post reels/feeds, and reach customers nearby.
              </p>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Business Name</label>
                <input
                  type="text"
                  placeholder="e.g. Grandma's Spices"
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Category</label>
                <select className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all">
                  <option>Food & Beverages</option>
                  <option>Home & Garden</option>
                  <option>Art & Handicrafts</option>
                  <option>Apparel & Design</option>
                  <option>Cosmetics & Beauty</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Business Description</label>
                <textarea
                  placeholder="Tell customers about your products, sourcing, and history..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Service Area</label>
                  <input
                    type="text"
                    placeholder="e.g. Coimbatore City"
                    className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Working Hours</label>
                  <input
                    type="text"
                    placeholder="e.g. 9 AM - 6 PM"
                    className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all"
                  />
                </div>
              </div>

              <button className="w-full mt-2 bg-primary hover:bg-primary-light text-white text-xs font-bold py-3 rounded-xl shadow-sm shadow-primary/20 transition-colors">
                Launch Digital Storefront
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
