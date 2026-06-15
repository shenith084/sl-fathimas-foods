"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronRight, ShoppingCart, Shield, Truck, RefreshCcw, Plus, Minus, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase/client";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useCartStore } from "@/store/cartStore";
import { products as fallbackProducts } from "@/lib/mockData";
import Script from "next/script";
import { event as fbEvent } from "@/components/analytics/MetaPixel";
import { ttevent } from "@/components/analytics/TikTokPixel";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import ReviewModal from "@/components/products/ReviewModal";

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} className={`w-4 h-4 ${i < Math.round(rating) ? "fill-[#D98C1F] text-[#D98C1F]" : "fill-gray-200 text-gray-200"}`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-[#666]">{rating} ({count} reviews)</span>
    </div>
  );
}

export default function ProductDetailClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [vacuum, setVacuum] = useState(false);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Description");

  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/products/by-slug/${slug}`);
        const data = await res.json();
        
        if (data.success && data.data) {
          setProduct(data.data);
          // Trigger ViewContent event
          fbEvent("ViewContent", { content_name: data.data.name, content_ids: [data.data.id], content_type: "product", value: data.data.price, currency: "LKR" });
          ttevent("ViewContent", { contents: [{ content_id: data.data.id, content_name: data.data.name, price: data.data.price, quantity: 1 }], value: data.data.price, currency: "LKR" });
        } else {
          // fallback to mock data
          const localProd = fallbackProducts.find(p => p.slug === slug);
          setProduct(localProd || null);
          if (localProd) {
            fbEvent("ViewContent", { content_name: localProd.name, content_ids: [localProd.id], content_type: "product", value: localProd.price, currency: "LKR" });
            ttevent("ViewContent", { contents: [{ content_id: localProd.id, content_name: localProd.name, price: localProd.price, quantity: 1 }], value: localProd.price, currency: "LKR" });
          }
        }
      } catch (err) {
        console.warn("API fetch error, falling back to local static catalog:", err);
        const localProd = fallbackProducts.find(p => p.slug === slug);
        setProduct(localProd || null);
        if (localProd) {
          fbEvent("ViewContent", { content_name: localProd.name, content_ids: [localProd.id], content_type: "product", value: localProd.price, currency: "LKR" });
          ttevent("ViewContent", { contents: [{ content_id: localProd.id, content_name: localProd.name, price: localProd.price, quantity: 1 }], value: localProd.price, currency: "LKR" });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product?.id) {
      fetch(`/api/v1/reviews?status=approved&productId=${product.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setReviews(data.data);
          }
        })
        .catch(console.error);
    }
  }, [product?.id]);

  if (loading) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-[#2C4631] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#2C4631] font-semibold text-sm">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://slfathimasfoods.com";

  // Product JSON-LD Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images && product.images.length > 0 ? product.images[0] : `${APP_URL}/og-image.png`,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "SL Fathima's Foods",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "LKR",
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "SL Fathima's Foods",
      },
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviews || 1,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
  };

  const vacuumPrice = vacuum && product.customizable ? 50 : 0;
  const totalPrice = (product.price + vacuumPrice) * qty;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji || "📦",
      weight: product.weight,
      vacuum: vacuum && product.customizable,
    }, qty);
    
    // Trigger AddToCart event
    fbEvent("AddToCart", { content_name: product.name, content_ids: [product.id], content_type: "product", value: totalPrice, currency: "LKR" });
    ttevent("AddToCart", { contents: [{ content_id: product.id, content_name: product.name, price: product.price, quantity: qty }], value: totalPrice, currency: "LKR" });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = fallbackProducts
    .filter(p => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  if (related.length < 4) {
    const extra = fallbackProducts
      .filter(p => p.slug !== product.slug && !related.find(r => r.slug === p.slug))
      .slice(0, 4 - related.length);
    related.push(...extra);
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Product Schema.org JSON-LD */}
      <Script
        id={`product-schema-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-[#999]" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#D98C1F]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-[#D98C1F]">Products</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#444]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Product Image Gallery */}
          {/* Product Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Gallery Thumbnails (Max 3) */}
            {product.images && product.images.length > 1 ? (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible w-full md:w-20 flex-shrink-0">
                <button className="hidden md:flex w-full h-8 bg-white border border-gray-100 rounded-lg items-center justify-center text-gray-500 hover:text-[#222] shadow-sm transition-colors mb-1">
                  <ChevronRight className="w-4 h-4 -rotate-90" />
                </button>
                {product.images.slice(0, 3).map((img: string, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveImageIndex(i)}
                    className={`flex-shrink-0 w-16 h-16 md:w-full md:h-20 bg-[#FAF7F2] rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 relative ${i === activeImageIndex ? "border-[#D98C1F] opacity-100 scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <Image 
                      src={img} 
                      alt={`Thumbnail ${i+1}`} 
                      fill
                      sizes="80px"
                      className="object-cover" 
                    />
                  </div>
                ))}
                <button className="hidden md:flex w-full h-8 bg-white border border-gray-100 rounded-lg items-center justify-center text-gray-500 hover:text-[#222] shadow-sm transition-colors mt-1">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </button>
              </div>
            ) : null}

            {/* Main Image */}
            <div className="flex-1 bg-[#2b1704] rounded-2xl aspect-square md:aspect-[4/5] lg:aspect-square flex items-center justify-center shadow-sm relative overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image 
                  src={product.images[activeImageIndex] || product.images[0]} 
                  alt={product.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover" 
                  priority
                />
              ) : (
                <span className="text-[12rem] select-none drop-shadow-xl" role="img" aria-label={product.name}>{product.emoji || "📦"}</span>
              )}
              {/* Zoom icon placeholder */}
              <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-[#222] hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
              </button>
            </div>
          </div>

          {/* Product Info Right Column */}
          <div className="pt-2 flex flex-col">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#D98C1F] text-white text-xs font-bold px-3 py-1 rounded-full">
                {product.badge || "Best Seller"}
              </span>
              <span className="bg-[#F4EFE6] text-[#2C4631] text-xs font-bold px-3 py-1 rounded-full">
                Handmade
              </span>
            </div>

            <h1 className="font-display font-bold text-[#222] text-3xl md:text-4xl mb-4 leading-tight">{product.name}</h1>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <StarRating rating={product.rating || 5.0} count={product.reviews || 128} />
              <span className="text-[#888] text-sm font-medium">SKU: {product.id.slice(0,6).toUpperCase()}</span>
            </div>

            <div className="mb-6">
              <span className="font-sans font-bold text-[#2C4631] text-[2rem] tracking-tight">
                LKR {product.price.toLocaleString()}.00
              </span>
            </div>

            <p className="text-[#555] text-sm md:text-[15px] leading-relaxed mb-8">
              {product.description || "Our signature pickle made with fresh ingredients, handpicked spices and traditional recipes for an authentic taste."}
            </p>

            {/* Feature Badges Row */}
            <div className="flex flex-wrap items-center gap-4 py-4 px-6 border border-gray-100 rounded-xl mb-8 shadow-sm bg-white">
              <div className="flex items-center gap-2 text-[#555]">
                <div className="text-[#2C4631]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                <span className="text-[11px] font-medium leading-tight">100% Natural<br/>Ingredients</span>
              </div>
              <div className="w-px h-8 bg-gray-100 hidden sm:block"></div>
              <div className="flex items-center gap-2 text-[#555]">
                <div className="text-[#2C4631]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg></div>
                <span className="text-[11px] font-medium leading-tight">No Artificial<br/>Preservatives</span>
              </div>
              <div className="w-px h-8 bg-gray-100 hidden lg:block"></div>
              <div className="flex items-center gap-2 text-[#555]">
                <div className="text-[#2C4631]">✋</div>
                <span className="text-[11px] font-medium leading-tight">Handmade<br/>in Sri Lanka</span>
              </div>
              <div className="w-px h-8 bg-gray-100 hidden sm:block"></div>
              <div className="flex items-center gap-2 text-[#555]">
                <div className="text-[#2C4631]">🛡️</div>
                <span className="text-[11px] font-medium leading-tight">Premium<br/>Quality</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-[#555] text-xs font-semibold mb-2">Quantity</h3>
              <div className="inline-flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#222] hover:bg-gray-50 rounded-l-lg transition-colors font-bold text-lg border-r border-gray-200">−</button>
                <input type="number" value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-12 text-center font-bold text-[#222] text-sm focus:outline-none appearance-none bg-transparent" />
                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#222] hover:bg-gray-50 rounded-r-lg transition-colors font-bold text-lg border-l border-gray-200">+</button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={added || (product.stock_count ?? product.stock ?? 0) <= 0}
                className={`flex-1 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${
                  added 
                    ? "bg-[#2C4631]" 
                    : (product.stock_count ?? product.stock ?? 0) <= 0 
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" 
                      : "bg-[#1E3322] hover:bg-[#152418]"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    ADDED!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {(product.stock_count ?? product.stock ?? 0) <= 0 ? "OUT OF STOCK" : "Add to Cart"}
                  </>
                )}
              </button>
              {(product.stock_count ?? product.stock ?? 0) > 0 && (
                <Link
                  href="/checkout"
                  onClick={handleAddToCart}
                  className="flex-1 bg-transparent border border-[#D98C1F] text-[#D98C1F] hover:bg-[#FAF7F2] font-bold py-3.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 text-center"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Buy Now
                </Link>
              )}
            </div>

            {/* Share row */}
            <div className="flex items-center justify-end gap-3 mt-auto pt-4">
              <span className="text-[#888] text-xs font-bold tracking-wide uppercase mr-2">Share:</span>
              <button className="w-8 h-8 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-[#555] hover:text-[#1877F2] hover:border-[#1877F2] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button className="w-8 h-8 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-[#555] hover:text-[#25D366] hover:border-[#25D366] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </button>
              <button className="w-8 h-8 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-[#555] hover:text-[#E1306C] hover:border-[#E1306C] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs Section */}
        <div className="mt-16">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-10 shadow-sm">
            <div className="flex flex-wrap gap-8 border-b border-gray-100 mb-10 pb-4">
              {["Description", "Ingredients", `Reviews (${product.reviews || 120})`, "Delivery & Returns"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[15px] font-bold transition-colors relative ${activeTab === tab ? "text-[#2C4631]" : "text-[#888] hover:text-[#555]"}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute -bottom-[17px] left-0 w-full h-[2px] bg-[#2C4631]"></span>
                  )}
                </button>
              ))}
            </div>

            {activeTab === "Description" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2 space-y-8">
                  <p className="text-[#555] text-[15px] leading-relaxed">
                    {product.name} is a perfect blend of fresh ingredients and aromatic spices, crafted using traditional methods to deliver a rich and authentic flavor.
                  </p>
                  
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-[#222] font-medium text-[15px]">
                      <div className="w-5 h-5 rounded-full bg-[#2C4631] flex items-center justify-center text-white"><Check className="w-3 h-3" strokeWidth={3} /></div>
                      Made with fresh ingredients
                    </li>
                    <li className="flex items-center gap-3 text-[#222] font-medium text-[15px]">
                      <div className="w-5 h-5 rounded-full bg-[#2C4631] flex items-center justify-center text-white"><Check className="w-3 h-3" strokeWidth={3} /></div>
                      Blended with traditional spices
                    </li>
                    <li className="flex items-center gap-3 text-[#222] font-medium text-[15px]">
                      <div className="w-5 h-5 rounded-full bg-[#2C4631] flex items-center justify-center text-white"><Check className="w-3 h-3" strokeWidth={3} /></div>
                      No artificial colors or preservatives
                    </li>
                    <li className="flex items-center gap-3 text-[#222] font-medium text-[15px]">
                      <div className="w-5 h-5 rounded-full bg-[#2C4631] flex items-center justify-center text-white"><Check className="w-3 h-3" strokeWidth={3} /></div>
                      Perfect with rice, roti, hoppers and more
                    </li>
                  </ul>
                </div>

                {/* Specs Box */}
                <div className="bg-[#EEF1EB] rounded-2xl p-8 border border-[#E2E8DC]">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <span className="text-[#555] font-semibold text-sm w-24">Net Weight:</span>
                      <span className="text-[#222] text-sm">{product.weight || "500g"}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[#555] font-semibold text-sm w-24">Shelf Life:</span>
                      <span className="text-[#222] text-sm">{product.shelfLife || "6 Months"}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[#555] font-semibold text-sm w-24">Storage:</span>
                      <span className="text-[#222] text-sm leading-tight">Store in a cool, dry place. Refrigerate after opening.</span>
                    </div>
                    <div className="flex gap-4 items-center pt-2">
                      <span className="text-[#555] font-semibold text-sm w-24">Spice Level:</span>
                      <div className="flex gap-1 text-red-500">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.44 2.1c-.24.08-.4.32-.4.6 0 .4 1.35 3.39 1.35 5.56 0 1.94-1.28 3.59-3.07 4.09-.56.16-1.12.16-1.68 0C6.85 11.85 5.57 10.2 5.57 8.26c0-2.17 1.35-5.16 1.35-5.56 0-.28-.16-.52-.4-.6-.24-.08-.52 0-.68.24-.12.16-2.03 3.66-2.03 6.64C3.81 12.89 6.8 16 10.71 16h2.58c3.91 0 6.9-3.11 6.9-7.02 0-2.98-1.91-6.48-2.03-6.64-.16-.24-.44-.32-.68-.24M12 18c-2.31 0-4.47-.72-6.24-1.95.84 2.87 3.55 5 6.78 5s5.94-2.13 6.78-5C17.55 17.28 15.39 18 13.08 18H12z"/></svg>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.44 2.1c-.24.08-.4.32-.4.6 0 .4 1.35 3.39 1.35 5.56 0 1.94-1.28 3.59-3.07 4.09-.56.16-1.12.16-1.68 0C6.85 11.85 5.57 10.2 5.57 8.26c0-2.17 1.35-5.16 1.35-5.56 0-.28-.16-.52-.4-.6-.24-.08-.52 0-.68.24-.12.16-2.03 3.66-2.03 6.64C3.81 12.89 6.8 16 10.71 16h2.58c3.91 0 6.9-3.11 6.9-7.02 0-2.98-1.91-6.48-2.03-6.64-.16-.24-.44-.32-.68-.24M12 18c-2.31 0-4.47-.72-6.24-1.95.84 2.87 3.55 5 6.78 5s5.94-2.13 6.78-5C17.55 17.28 15.39 18 13.08 18H12z"/></svg>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.44 2.1c-.24.08-.4.32-.4.6 0 .4 1.35 3.39 1.35 5.56 0 1.94-1.28 3.59-3.07 4.09-.56.16-1.12.16-1.68 0C6.85 11.85 5.57 10.2 5.57 8.26c0-2.17 1.35-5.16 1.35-5.56 0-.28-.16-.52-.4-.6-.24-.08-.52 0-.68.24-.12.16-2.03 3.66-2.03 6.64C3.81 12.89 6.8 16 10.71 16h2.58c3.91 0 6.9-3.11 6.9-7.02 0-2.98-1.91-6.48-2.03-6.64-.16-.24-.44-.32-.68-.24M12 18c-2.31 0-4.47-.72-6.24-1.95.84 2.87 3.55 5 6.78 5s5.94-2.13 6.78-5C17.55 17.28 15.39 18 13.08 18H12z"/></svg>
                        <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12.44 2.1c-.24.08-.4.32-.4.6 0 .4 1.35 3.39 1.35 5.56 0 1.94-1.28 3.59-3.07 4.09-.56.16-1.12.16-1.68 0C6.85 11.85 5.57 10.2 5.57 8.26c0-2.17 1.35-5.16 1.35-5.56 0-.28-.16-.52-.4-.6-.24-.08-.52 0-.68.24-.12.16-2.03 3.66-2.03 6.64C3.81 12.89 6.8 16 10.71 16h2.58c3.91 0 6.9-3.11 6.9-7.02 0-2.98-1.91-6.48-2.03-6.64-.16-.24-.44-.32-.68-.24M12 18c-2.31 0-4.47-.72-6.24-1.95.84 2.87 3.55 5 6.78 5s5.94-2.13 6.78-5C17.55 17.28 15.39 18 13.08 18H12z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "Ingredients" && (
              <div className="py-8">
                <h3 className="font-display font-bold text-[#222] text-xl mb-6">Ingredients List</h3>
                <p className="text-[#555] leading-relaxed max-w-3xl">
                  {product.ingredients || "Made with 100% natural, locally sourced ingredients. No artificial colors, flavors, or preservatives added. Please see the product packaging for a full detailed list."}
                </p>
              </div>
            )}

            {activeTab !== "Description" && activeTab !== "Ingredients" && (
              <div className="py-16 text-center text-[#888]">
                <span className="text-5xl block mb-4">✨</span>
                <p>Content for {activeTab} will be available soon.</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 pt-16 border-t border-gray-200/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display font-bold text-[#222] text-2xl mb-1">
                Customer <span className="text-[#D98C1F]">Reviews</span>
              </h2>
              <div className="flex items-center gap-2">
                <StarRating rating={product.rating || 5} count={product.reviews || 0} />
              </div>
            </div>
            {user ? (
              <button 
                onClick={() => setShowReviewModal(true)}
                className="bg-[#2C4631] hover:bg-[#1E3322] text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md"
              >
                Write a Review
              </button>
            ) : (
              <Link href={`/auth?redirect=/products/${slug}`} className="bg-[#2C4631] hover:bg-[#1E3322] text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md text-center">
                Log in to Review
              </Link>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
              <span className="text-4xl mb-3 block">⭐</span>
              <h3 className="font-display font-bold text-lg text-[#222] mb-1">No reviews yet</h3>
              <p className="text-[#666] text-sm">Be the first to share your experience with this product!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map((r, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FAF7F2] rounded-full flex items-center justify-center text-[#D98C1F] font-display font-bold text-sm border border-[#D98C1F]/20">
                        {r.user_name ? r.user_name[0].toUpperCase() : "A"}
                      </div>
                      <div>
                        <p className="font-semibold text-[#222] text-sm">{r.user_name || "Anonymous"}</p>
                        <p className="text-[#999] text-xs">Verified Buyer</p>
                      </div>
                    </div>
                    <span className="text-[#999] text-xs">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recently"}
                    </span>
                  </div>
                  <div className="mb-3">
                    <StarRating rating={r.rating} count={0} />
                  </div>
                  <p className="text-[#555] text-sm leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* You May Also Like */}
        <div className="mt-16">
          <h2 className="font-display font-bold text-[#222] text-2xl mb-6">
            You May Also Like
          </h2>
          <div className="relative group">
            <button className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-[#222] hover:border-gray-300 shadow-sm transition-colors z-10 opacity-0 group-hover:opacity-100">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x [&::-webkit-scrollbar]:hidden">
              {related.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} className="min-w-[200px] md:min-w-[220px] flex-shrink-0 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group snap-start block">
                  <div className="h-40 bg-gradient-to-br from-[#F4EFE6] to-[#FAF7F2] flex items-center justify-center overflow-hidden relative p-4">
                    {p.images && p.images.length > 0 ? (
                      <Image 
                        src={p.images[0]} 
                        alt={p.name}
                        fill
                        sizes="200px"
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300 select-none" role="img" aria-label={p.name}>{p.emoji || "📦"}</span>
                    )}
                  </div>
                  <div className="p-4 relative">
                    <h3 className="font-bold text-[#222] text-sm line-clamp-1 mb-1 group-hover:text-[#2C4631] transition-colors">{p.name}</h3>
                    <p className="text-[#888] text-[11px] mb-2">{p.weight || "500g"}</p>
                    <span className="font-bold text-[#222] text-sm block">LKR {p.price.toLocaleString()}.00</span>
                    
                    <div className="absolute right-4 bottom-4 w-8 h-8 rounded-full bg-[#1E3322] flex items-center justify-center text-white shadow-sm hover:bg-[#2C4631] transition-colors">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <button className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-[#222] hover:border-gray-300 shadow-sm transition-colors z-10 opacity-0 group-hover:opacity-100">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {showReviewModal && user && (
        <ReviewModal
          productId={product.id}
          userId={user.uid}
          userName={user.displayName || user.email || "Anonymous"}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            setShowReviewModal(false);
            alert("Your review has been published! Please refresh to see it.");
          }}
        />
      )}
    </div>
  );
}
