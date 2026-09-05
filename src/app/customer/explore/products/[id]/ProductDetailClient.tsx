"use client";

import { useState } from "react";
import { ArrowLeft, Star, ShoppingBag, ShoppingCart, Heart, ShieldCheck, MapPin, Store, Check, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductMedia from "@/components/ProductMedia";

interface ProductDetailClientProps {
  product: any;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/explore/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to add to cart");
      }
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/explore/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to initiate buy flow");
      }
      // Redirect to explore with products tab and openCart query parameter
      router.push("/customer/explore?tab=products&openCart=true");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50 pb-28 font-sans">
      
      {/* 1. Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-10 border-b border-slate-100 flex items-center justify-between shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="p-2 -ml-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft size={20} className="stroke-[2.5]" />
          </button>
          <h1 className="text-base font-black text-slate-800">Product Details</h1>
        </div>

        <Link 
          href="/customer/explore?tab=products&openCart=true"
          className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 flex items-center justify-center text-slate-600 relative transition-all"
        >
          <ShoppingCart size={18} />
        </Link>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-6 space-y-6">
        
        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Product Image Section */}
        <div className="aspect-[4/3] rounded-3xl bg-amber-50 border border-amber-100/50 flex items-center justify-center shadow-inner relative overflow-hidden">
          <ProductMedia src={product.image} alt={product.name} isDetail={true} />
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-800 leading-tight">{product.name}</h2>
              <span className="inline-block mt-2 text-[9px] text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {product.category}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-primary">₹{product.price}</span>
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mt-0.5">Per Piece</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 pt-1.5 border-t border-slate-100/50">
            <Star size={14} className="fill-amber-500 text-amber-500" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-slate-400 font-medium">(80 reviews)</span>
          </div>
        </div>

        {/* Seller Profile Details */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3.5">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Seller Details</span>
          
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shadow-inner">
                🏬
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-[13.5px] leading-tight">{product.sellerName}</h4>
                <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5 mt-0.5">
                  <MapPin size={11} className="text-slate-300" />
                  {product.sellerLocation}
                </p>
              </div>
            </div>
            
            <Link 
              href={`/customer/explore?tab=products&search=${encodeURIComponent(product.sellerName)}`}
              className="text-xs font-extrabold text-primary hover:text-primary-light"
            >
              View Shop
            </Link>
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-2">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Product Description</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {product.description || "No description provided. This is a premium handmade organic product sourced directly from local entrepreneurs and small scale businesses in India."}
          </p>
        </div>

      </main>

      {/* Footer Actions */}
      <footer className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-100 px-6 py-4 flex gap-4 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] pb-6">
        <button 
          onClick={handleAddToCart}
          disabled={loading || added}
          className="flex-1 py-4 border-2 border-slate-200 hover:border-slate-300 active:scale-[0.98] rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer text-slate-700 bg-white"
        >
          {added ? (
            <>
              <Check size={14} className="text-emerald-500" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag size={14} />
              Add to Cart
            </>
          )}
        </button>

        <button 
          onClick={handleBuyNow}
          disabled={loading}
          className="flex-1 py-4 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-600/20"
        >
          Buy Now
        </button>
      </footer>

    </div>
  );
}
