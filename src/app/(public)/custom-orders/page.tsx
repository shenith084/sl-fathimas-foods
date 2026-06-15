"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Send, Lock, Gift, Briefcase, Calendar, MoreHorizontal, 
  CheckCircle, Leaf, Box, Truck, Heart, BadgeCheck, Star, 
  ThumbsUp, HelpCircle 
} from "lucide-react";

const orderTypes = [
  { id: "gift-hamper", label: "Gift Hamper", icon: Gift },
  { id: "corporate", label: "Corporate Order", icon: Briefcase },
  { id: "event", label: "Event / Occasion", icon: Calendar },
  { id: "other", label: "Other", icon: MoreHorizontal },
];

export default function CustomOrdersPage() {
  const [form, setForm] = useState({
    name: "", email: "", phoneCode: "+94", phone: "", 
    orderType: "gift-hamper", otherOrderType: "", date: "", location: "", 
    details: "", budget: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Check if user is logged in to link the order
      const { auth } = await import("@/lib/firebase/client");
      const user = auth.currentUser;

      const typeLabel = form.orderType === "other" 
        ? `Other: ${form.otherOrderType}`
        : orderTypes.find(t => t.id === form.orderType)?.label || form.orderType;

      const description = `Type: ${typeLabel}\nDate: ${form.date}\nBudget: ${form.budget}\nDetails: ${form.details}`;

      const payload = {
        userId: user ? user.uid : "guest",
        items: [{
          name: "Custom Order Request",
          qty: 1,
          price: 0,
          emoji: "🎁",
          description: description
        }],
        shippingDetails: {
          firstName: form.name,
          lastName: "",
          email: form.email,
          phone: `${form.phoneCode}${form.phone}`,
          address: form.location,
          city: "Custom Order",
          district: "Custom Order"
        },
        paymentDetails: {
          method: "Pending Quote",
          status: "pending"
        },
        subtotal: 0,
        deliveryCharge: 0,
        total: 0,
        status: "pending"
      };

      const res = await fetch("/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit request. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
          <CheckCircle className="w-16 h-16 text-[#2C4631] mx-auto mb-5" />
          <h2 className="font-display font-bold text-[#222] text-2xl mb-3">Request Received! 🎉</h2>
          <p className="text-[#666] mb-6">
            Thank you for your custom order request. We'll review your requirements and get back to you with a personalized quote shortly.
          </p>
          <a href="https://wa.me/94771234567" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-[#20bb5a] transition-colors">
            Chat on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8">
        
        {/* Header Section */}
        <div className="bg-[#F8F9F5] rounded-3xl overflow-hidden mb-8 flex flex-col md:flex-row relative">
          <div className="p-10 md:p-14 flex-1 flex flex-col justify-center relative z-10">
            <h1 className="font-display font-bold text-[#1a2e22] text-4xl md:text-5xl mb-4">
              Custom Orders
            </h1>
            <p className="text-[#4a5d52] max-w-md text-[15px] leading-relaxed">
              Have something special in mind? We're here to bring your ideas to life. <br className="hidden md:block" />
              Tell us what you need and we'll create it just for you.
            </p>
          </div>
          <div className="relative w-full md:w-[45%] min-h-[250px] md:min-h-[300px]">
            {/* The mask helps blend the image smoothly on the left side if needed */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F8F9F5] via-transparent to-transparent z-10 hidden md:block w-24"></div>
            <Image 
              src="/images/gift_pack_box.png" 
              alt="Custom Gift Orders" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
              priority
            />
          </div>
        </div>

        {/* Main Content: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#F0F4F1] flex items-center justify-center text-[#2C4631]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <h2 className="font-display font-bold text-[#222] text-xl">Tell Us What You Need</h2>
              </div>
              <p className="text-[#666] text-sm mb-8">
                Fill in the details below and our team will get back to you with a personalized quote.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name & Email & Phone Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-2">Your Name <span className="text-red-500">*</span></label>
                    <input type="text" required placeholder="Enter your full name" value={form.name} onChange={(e) => update("name", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2C4631] focus:ring-1 focus:ring-[#2C4631] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-2">Email Address <span className="text-red-500">*</span></label>
                    <input type="email" required placeholder="Enter your email address" value={form.email} onChange={(e) => update("email", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2C4631] focus:ring-1 focus:ring-[#2C4631] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <select 
                        value={form.phoneCode} 
                        onChange={(e) => update("phoneCode", e.target.value)}
                        className="w-[80px] bg-white border border-gray-200 rounded-xl px-2 py-3 text-sm focus:outline-none focus:border-[#2C4631]"
                      >
                        <option value="+94">+94</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+61">+61</option>
                      </select>
                      <input type="tel" required placeholder="Enter your phone number" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                        className="flex-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2C4631] focus:ring-1 focus:ring-[#2C4631] transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Order Type */}
                <div>
                  <label className="block text-xs font-bold text-[#333] mb-3">Order Type <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {orderTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = form.orderType === type.id;
                      return (
                        <div 
                          key={type.id} 
                          onClick={() => update("orderType", type.id)}
                          className={`relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? "border-[#2C4631] bg-[#F4F7F5]" 
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? "bg-white" : "bg-gray-50"}`}>
                            <Icon className={`w-4 h-4 ${isSelected ? "text-[#2C4631]" : "text-[#888]"}`} />
                          </div>
                          <span className={`text-xs font-semibold ${isSelected ? "text-[#2C4631]" : "text-[#555]"}`}>
                            {type.label}
                          </span>
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 bg-[#2C4631] text-white rounded-full p-0.5">
                              <CheckCircle className="w-3.5 h-3.5 fill-current" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  
                  {form.orderType === "other" && (
                    <div className="mt-4">
                      <label className="block text-xs font-bold text-[#333] mb-2">Please specify <span className="text-red-500">*</span></label>
                      <input type="text" required placeholder="Describe your order type" value={form.otherOrderType} onChange={(e) => update("otherOrderType", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2C4631] focus:ring-1 focus:ring-[#2C4631] transition-colors" />
                    </div>
                  )}
                </div>

                {/* Date & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-2">Preferred Delivery Date <span className="text-red-500">*</span></label>
                    <input type="date" required value={form.date} onChange={(e) => update("date", e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2C4631] focus:ring-1 focus:ring-[#2C4631] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-2">Delivery Location <span className="text-red-500">*</span></label>
                    <input type="text" required placeholder="Enter delivery location" value={form.location} onChange={(e) => update("location", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2C4631] focus:ring-1 focus:ring-[#2C4631] transition-colors" />
                  </div>
                </div>

                {/* Textarea */}
                <div>
                  <label className="block text-xs font-bold text-[#333] mb-1">Tell Us More About Your Request <span className="text-red-500">*</span></label>
                  <p className="text-[11px] text-[#888] mb-2">Please describe your requirements, preferred items, quantity, budget range and any special instructions.</p>
                  <textarea rows={5} required placeholder="Write your message here..."
                    value={form.details} onChange={(e) => update("details", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2C4631] focus:ring-1 focus:ring-[#2C4631] transition-colors resize-none" />
                </div>

                {/* Budget Range */}
                <div>
                  <label className="block text-xs font-bold text-[#333] mb-2">Budget Range (LKR)</label>
                  <input type="text" placeholder="e.g. 10000" value={form.budget} onChange={(e) => update("budget", e.target.value)}
                    className="w-[50%] md:w-[35%] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2C4631] focus:ring-1 focus:ring-[#2C4631] transition-colors" />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <button type="submit" disabled={loading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#2C4631] hover:bg-[#1f3122] text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
                    {loading ? "Submitting..." : "Submit Request"}
                    {!loading && <Send className="w-4 h-4 ml-1" />}
                  </button>
                  <div className="flex items-center gap-2 text-[#777] text-xs">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Your information is safe with us. We'll never share your details.</span>
                  </div>
                </div>

              </form>
            </div>
          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Why Choose Custom Orders? */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-display font-bold text-[#222] text-lg mb-6">Why Choose Custom Orders?</h3>
              <div className="space-y-6">
                {[
                  { title: "Personalized Just For You", desc: "We create exactly what you have in mind.", icon: BadgeCheck },
                  { title: "Premium Quality", desc: "Made with the finest natural ingredients.", icon: Star },
                  { title: "Perfect For Any Occasion", desc: "Birthdays, weddings, corporate events & more.", icon: Gift },
                  { title: "Dedicated Support", desc: "Our team will assist you from start to finish.", icon: ThumbsUp },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#F0F4F1] flex items-center justify-center flex-shrink-0 text-[#2C4631]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#222] text-[13px]">{item.title}</h4>
                        <p className="text-[#666] text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Need Inspiration? */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col relative overflow-hidden">
              <h3 className="font-display font-bold text-[#222] text-lg mb-2 z-10 relative">Need Inspiration?</h3>
              <p className="text-[#666] text-xs mb-6 max-w-[180px] z-10 relative">
                Explore our best selling gift packs for ideas
              </p>
              <div className="z-10 relative">
                <Link href="/gift-packs" className="inline-flex items-center gap-2 border border-[#2C4631] text-[#2C4631] font-semibold text-xs px-5 py-2 rounded-lg hover:bg-[#2C4631] hover:text-white transition-colors">
                  <Gift className="w-3.5 h-3.5" /> View Gift Packs
                </Link>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] w-36 h-36 opacity-90 pointer-events-none">
                <Image src="/premium-box.png" alt="Inspiration" fill sizes="150px" className="object-contain" />
              </div>
            </div>

          </div>
        </div>

        {/* Footer Badges */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-100 pt-8 px-4">
          {[
            { title: "100% Natural", desc: "Made with real ingredients", icon: Leaf },
            { title: "Secure Packaging", desc: "Safe and hygienic packing", icon: Box },
            { title: "Islandwide Delivery", desc: "Fast & reliable delivery", icon: Truck },
            { title: "Customer Satisfaction", desc: "We care about you", icon: HelpCircle },
          ].map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 text-[#2C4631] flex items-center justify-center">
                  <Icon className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <h5 className="font-bold text-[#222] text-xs">{b.title}</h5>
                  <p className="text-[#777] text-[10px] mt-0.5">{b.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  );
}
