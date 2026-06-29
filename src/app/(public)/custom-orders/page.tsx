"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Send, Lock, Gift, Briefcase, Calendar, MoreHorizontal,
  CheckCircle, Leaf, Box, Truck, Star,
  ThumbsUp, BadgeCheck, Phone, Mail, Clock, User, MapPin, Loader2
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import toast from "react-hot-toast";

const orderTypes = [
  { id: "gift-hamper",  label: "Gift Hamper",      icon: Gift },
  { id: "corporate",   label: "Corporate Order",   icon: Briefcase },
  { id: "event",       label: "Event / Occasion",  icon: Calendar },
  { id: "other",       label: "Other",             icon: MoreHorizontal },
];

export default function CustomOrdersPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phoneCode: "+94", phone: "",
    orderType: "gift-hamper", otherOrderType: "", date: "", location: "",
    details: "", budget: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Auth guard ──────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth?redirect=/custom-orders");
        return;
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [router]);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = auth.currentUser;

      const typeLabel =
        form.orderType === "other"
          ? `Other: ${form.otherOrderType}`
          : orderTypes.find((t) => t.id === form.orderType)?.label || form.orderType;

      const description = `Type: ${typeLabel}\nDate: ${form.date}\nBudget: ${form.budget}\nDetails: ${form.details}`;

      const payload = {
        userId: user ? user.uid : "guest",
        items: [{ name: "Custom Order Request", qty: 1, price: 0, emoji: "🎁", description }],
        shippingDetails: {
          firstName: form.name, lastName: "",
          email: form.email,
          phone: `${form.phoneCode}${form.phone}`,
          address: form.location,
          city: "Custom Order", district: "Custom Order",
        },
        paymentDetails: { method: "Pending Quote", status: "pending" },
        subtotal: 0, deliveryCharge: 0, total: 0, status: "pending",
      };

      const res = await fetch("/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        toast.error("Failed to submit request. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show spinner while checking auth
  if (!authChecked) {
    return (
      <div className="bg-[#F5F0E8] min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2C4631]" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-[#F5F0E8] min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
          <CheckCircle className="w-16 h-16 text-[#2C4631] mx-auto mb-5" />
          <h2 className="font-display font-bold text-[#222] text-2xl mb-3">Request Received! 🎉</h2>
          <p className="text-[#666] mb-6">
            Thank you for your custom order request. We'll review your requirements and get back to you with a personalized quote shortly.
          </p>
          <a
            href="https://wa.me/94705151000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-[#20bb5a] transition-colors"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F0E8] min-h-screen font-sans">

      {/* ── Hero Section ── */}
      <div className="bg-[#F5F0E8] w-full pt-10 pb-0 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#F5F0E8] rounded-3xl overflow-hidden flex flex-col md:flex-row items-center gap-0">

            {/* Left: heading */}
            <div className="md:w-[45%] z-10 py-8 md:py-10 px-2 md:px-6">
              {/* Subtitle with decorative swashes */}
              <div className="flex items-center gap-2 mb-3">
                <svg width="32" height="10" viewBox="0 0 32 10" fill="none">
                  <path d="M2 5 Q8 1 16 5 Q24 9 30 5" stroke="#D98C1F" strokeWidth="1.5" fill="none"/>
                </svg>
                <span className="text-[#8B6914] text-sm italic font-medium tracking-wide">We'd love to hear from you</span>
                <svg width="32" height="10" viewBox="0 0 32 10" fill="none">
                  <path d="M2 5 Q8 9 16 5 Q24 1 30 5" stroke="#D98C1F" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-[#1A2E1F] leading-tight mb-3">
                Custom <span className="text-[#D98C1F]">Orders</span>
              </h1>
              {/* Decorative leaf */}
              <div className="flex items-center gap-1 mb-5">
                <div className="w-8 h-[2px] bg-[#D98C1F] rounded-full"></div>
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                  <path d="M2 6 Q9 0 16 6" stroke="#2C4631" strokeWidth="1.2" fill="none"/>
                  <path d="M9 2 L9 10" stroke="#2C4631" strokeWidth="1" fill="none"/>
                </svg>
                <div className="w-8 h-[2px] bg-[#D98C1F] rounded-full"></div>
              </div>
              <p className="text-[#555] text-base leading-relaxed max-w-sm">
                Have something special in mind? We're here to bring your ideas to life.<br />
                Tell us what you need and we'll create it just for you.
              </p>
            </div>

            {/* Right: gift box image */}
            <div className="md:w-[55%] relative h-[220px] md:h-[300px] w-full rounded-2xl overflow-hidden">
              <Image
                src="/custom-orders-hero.png"
                alt="Custom Gift Orders"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-Column Content ── */}
      <div className="py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ── Left Column: Form ── */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                {/* Form header */}
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-[#F0F4F1] flex items-center justify-center text-[#2C4631]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h2 className="font-display font-bold text-[#222] text-xl">Tell Us What You Need</h2>
                </div>
                <p className="text-[#777] text-sm mb-7 ml-11">
                  Fill in the details below and our team will get back to you with a personalized quote.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Name / Email / Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#333] mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" />
                        <input
                          type="text" required placeholder="Enter your full name"
                          value={form.name} onChange={(e) => update("name", e.target.value)}
                          className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#333] mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" />
                        <input
                          type="email" required placeholder="Enter your email"
                          value={form.email} onChange={(e) => update("email", e.target.value)}
                          className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#333] mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={form.phoneCode} onChange={(e) => update("phoneCode", e.target.value)}
                          className="w-[72px] bg-white border border-gray-200 rounded-xl px-2 py-3 text-sm focus:outline-none focus:border-[#D98C1F]"
                        >
                          <option value="+94">+94</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+61">+61</option>
                        </select>
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" />
                          <input
                            type="tel" required placeholder="Enter your number"
                            value={form.phone} onChange={(e) => update("phone", e.target.value)}
                            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Type */}
                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-3">
                      Order Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {orderTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = form.orderType === type.id;
                        return (
                          <div
                            key={type.id}
                            onClick={() => update("orderType", type.id)}
                            className={`relative flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? "border-[#2C4631] bg-[#F4F7F5]"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-white" : "bg-gray-50"}`}>
                              <Icon className={`w-4 h-4 ${isSelected ? "text-[#2C4631]" : "text-[#888]"}`} />
                            </div>
                            <span className={`text-xs font-semibold leading-tight ${isSelected ? "text-[#2C4631]" : "text-[#555]"}`}>
                              {type.label}
                            </span>
                            {isSelected && (
                              <div className="absolute -top-1.5 -right-1.5 bg-[#2C4631] text-white rounded-full p-0.5">
                                <CheckCircle className="w-3.5 h-3.5 fill-current" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {form.orderType === "other" && (
                      <div className="mt-4">
                        <label className="block text-xs font-bold text-[#333] mb-2">Please specify <span className="text-red-500">*</span></label>
                        <input
                          type="text" required placeholder="Describe your order type"
                          value={form.otherOrderType} onChange={(e) => update("otherOrderType", e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                        />
                      </div>
                    )}
                  </div>

                  {/* Date & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#333] mb-2">
                        Preferred Delivery Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb] pointer-events-none" />
                        <input
                          type="date" required min={new Date().toISOString().split("T")[0]}
                          value={form.date} onChange={(e) => update("date", e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#333] mb-2">
                        Delivery Location <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" />
                        <input
                          type="text" required placeholder="Enter delivery location"
                          value={form.location} onChange={(e) => update("location", e.target.value)}
                          className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1">
                      Tell Us More About Your Request <span className="text-red-500">*</span>
                    </label>
                    <p className="text-[11px] text-[#999] mb-2">
                      Please describe your requirements, preferred items, quantity, budget range and any special instructions.
                    </p>
                    <textarea
                      rows={5} required placeholder="Write your message here..."
                      value={form.details} onChange={(e) => update("details", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors resize-none"
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-2">Budget Range (LKR)</label>
                    <div className="relative w-full md:w-[40%]">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bbb] text-sm">රු</span>
                      <input
                        type="text" placeholder="e.g. 10,000"
                        value={form.budget} onChange={(e) => update("budget", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Submit Row */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                    <button
                      type="submit" disabled={loading}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1C3826] hover:bg-[#152c1e] text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>Send Request <Send className="w-4 h-4 ml-1" /></>
                      )}
                    </button>
                    <div className="flex items-center gap-2 text-[#888] text-xs">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Your information is safe with us. We'll never share your details.</span>
                    </div>
                  </div>

                </form>
              </div>
            </div>

            {/* ── Right Column: Widgets ── */}
            <div className="lg:col-span-4 space-y-5">

              {/* Why Choose Custom Orders? */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-display font-bold text-[#222] text-lg mb-5">Why Choose Custom Orders?</h3>
                <div className="space-y-5">
                  {[
                    { title: "Personalized Just For You",   desc: "We create exactly what you have in mind.",          icon: BadgeCheck },
                    { title: "Premium Quality",             desc: "Made with the finest natural ingredients.",         icon: Star },
                    { title: "Perfect For Any Occasion",   desc: "Birthdays, weddings, corporate events & more.",     icon: Gift },
                    { title: "Dedicated Support",          desc: "Our team will assist you from start to finish.",    icon: ThumbsUp },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#F0F4F1] flex items-center justify-center flex-shrink-0 text-[#2C4631]">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#222] text-[13px]">{item.title}</h4>
                          <p className="text-[#777] text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Need Inspiration? */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 items-center">
                <div className="flex-1">
                  <h3 className="font-display font-bold text-[#222] text-base mb-1">Need Inspiration?</h3>
                  <p className="text-[#777] text-xs mb-4 leading-relaxed">
                    Explore our best selling gift packs for ideas
                  </p>
                  <Link
                    href="/gift-packs"
                    className="inline-flex items-center gap-2 border border-[#2C4631] text-[#2C4631] font-semibold text-xs px-4 py-2 rounded-lg hover:bg-[#2C4631] hover:text-white transition-colors"
                  >
                    <Gift className="w-3.5 h-3.5" /> View Gift Packs
                  </Link>
                </div>
                <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                  <Image src="/custom-orders-inspiration.png" alt="Gift Pack Inspiration" fill sizes="96px" className="object-cover" />
                </div>
              </div>

              {/* Get in Touch */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-display font-bold text-[#222] text-base mb-4">Get in Touch</h3>
                <p className="text-[#777] text-xs mb-4 leading-relaxed">
                  Our team is ready to help you with your custom order requirements.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F0F4F1] flex items-center justify-center text-[#2C4631] flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-[#1A2E1F]">070 515 1000</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F0F4F1] flex items-center justify-center text-[#2C4631] flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-[#1A2E1F]">info@slfathimas.lk</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F0F4F1] flex items-center justify-center text-[#2C4631] flex-shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-[#1A2E1F]">Mon - Sat: 8.00 AM – 6.00 PM</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── Bottom Trust Badges ── */}
          <div className="mt-10 bg-white rounded-2xl py-6 px-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-gray-100 shadow-sm">
            {[
              { title: "Premium Quality",        desc: "Only the finest ingredients",      icon: Star },
              { title: "Handmade",               desc: "Made with love and care",          icon: Leaf },
              { title: "Secure Packaging",       desc: "Safe & hygienic packaging",        icon: Box },
              { title: "Fast Delivery",          desc: "Islandwide & international",       icon: Truck },
            ].map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="text-[#D98C1F]">
                    <Icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1A2E1F] text-sm">{b.title}</h5>
                    <p className="text-[#777] text-xs mt-0.5">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
