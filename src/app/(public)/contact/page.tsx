"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Send, MapPin, Phone, Mail, Clock, MessageCircle, ShoppingBag, Package, Handshake, Star, Heart, ShieldCheck, Truck } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  
  useEffect(() => {
    fetch("/api/v1/settings")
      .then(res => res.json())
      .then(data => { if (data.success) setSettings(data.data); })
      .catch(() => {});
  }, []);

  const whatsapp = settings?.whatsappNumber || "+94 77 123 4567";
  const email = settings?.businessEmail || "slfathimasfoods@gmail.com";
  const address = settings?.businessAddress || "Colombo, Sri Lanka";

  // Sync selected block with the select dropdown
  useEffect(() => {
    if (selectedSubject) {
      setForm(prev => ({ ...prev, subject: selectedSubject }));
    }
  }, [selectedSubject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch("/api/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Failed to submit message");
      setSent(true);
      setForm({ name: "", phone: "", email: "", subject: "", message: "" });
      setSelectedSubject("");
    } catch (error) {
      console.error("Error submitting message:", error);
      alert("There was an error sending your message. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const subjectBlocks = [
    { id: "General Inquiry", icon: <MessageCircle className="w-5 h-5" />, title: "General Inquiry", desc: "Ask us anything" },
    { id: "Custom Orders", icon: <ShoppingBag className="w-5 h-5" />, title: "Custom Orders", desc: "Request a quote" },
    { id: "Product Support", icon: <Package className="w-5 h-5" />, title: "Product Support", desc: "Get help with products" },
    { id: "Partnership", icon: <Handshake className="w-5 h-5" />, title: "Partnership", desc: "Business inquiries" },
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen font-sans">
      {/* Top Banner Area */}
      <div className="bg-[#FAF7F2] w-full pt-8 pb-4 md:pt-10 md:pb-8 px-4 sm:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 z-10 mb-6 md:mb-0 md:pr-8">
            <h1 className="font-display font-bold text-4xl md:text-5xl text-[#1A2E1F] mb-4 tracking-tight">
              Contact <span className="text-[#D98C1F]">Us</span>
            </h1>
            <div className="w-12 h-1 bg-[#D98C1F] mb-6 rounded-full"></div>
            <p className="text-[#555] text-base md:text-lg leading-relaxed max-w-md">
              We'd love to hear from you! Whether you have a question, need help, or want a custom order, our team is here for you.
            </p>
          </div>
          <div className="md:w-1/2 relative h-[180px] md:h-[250px] w-full z-10">
            <Image
              src="/contact-hero.png"
              alt="Products"
              fill
              className="object-contain object-right"
              priority
            />
          </div>
        </div>
      </div>

      {/* Main Content Area (White background) */}
      <div className="bg-white py-12 md:py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Left Column - Contact Info */}
            <div className="w-full lg:w-1/3 space-y-4">
              {/* WhatsApp Card */}
              <div className="bg-[#1C3E26] rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#25D366] text-white p-2 rounded-full">
                    <Phone className="w-6 h-6 fill-current" />
                  </div>
                  <h3 className="font-display font-bold text-xl">Chat on WhatsApp</h3>
                </div>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  The fastest way to reach us. Usually reply within minutes!
                </p>
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-white text-[#1C3E26] font-bold px-5 py-3.5 rounded-xl text-lg hover:bg-gray-100 transition-colors shadow-sm"
                >
                  {whatsapp}
                </a>
              </div>

              {/* Info Blocks - Decreased Shadow as requested */}
              <div className="bg-[#FAF7F2] rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#2C4631] shadow-sm flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#222] text-sm mb-1">Call Us</h4>
                  <p className="font-bold text-[#2C4631] text-base mb-1">{whatsapp}</p>
                  <p className="text-[#777] text-xs">Mon - Sat : 8:00 AM - 6:00 PM</p>
                </div>
              </div>

              <div className="bg-[#FAF7F2] rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#2C4631] shadow-sm flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#222] text-sm mb-1">Email Us</h4>
                  <p className="font-bold text-[#2C4631] text-base mb-1">{email}</p>
                  <p className="text-[#777] text-xs">We reply within 24 hours</p>
                </div>
              </div>

              <div className="bg-[#FAF7F2] rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#2C4631] shadow-sm flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#222] text-sm mb-1">Our Location</h4>
                  <p className="font-bold text-[#2C4631] text-base mb-1">{address}</p>
                  <p className="text-[#777] text-xs">Islandwide & International Delivery</p>
                </div>
              </div>

              <div className="bg-[#FAF7F2] rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#2C4631] shadow-sm flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#222] text-sm mb-1">Response Time</h4>
                  <p className="font-bold text-[#2C4631] text-base mb-1">Within 24 Hours</p>
                  <p className="text-[#777] text-xs">For all inquiries</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-[#FAF7F2] rounded-2xl p-6 text-center">
                <h4 className="font-semibold text-[#222] text-sm mb-4">Follow Us</h4>
                <div className="flex items-center justify-center gap-3">
                  <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#444] hover:text-[#D98C1F] hover:shadow-md transition-all">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6c1.05 0 2.05.2 2.3.3v2.7h-1.3c-1.24 0-1.5.6-1.5 1.48V12h2.7l-.4 3h-2.3v6.8C18.56 20.87 22 16.84 22 12z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#444] hover:text-[#D98C1F] hover:shadow-md transition-all">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2c2.72 0 3.05.01 4.12.06 1.05.05 1.63.22 2.01.37a3.83 3.83 0 0 1 1.45 1.45c.15.38.32.96.37 2.01.05 1.07.06 1.4.06 4.12s-.01 3.05-.06 4.12c-.05 1.05-.22 1.63-.37 2.01a3.83 3.83 0 0 1-1.45 1.45c-.38.15-.96.32-2.01.37-1.07.05-1.4.06-4.12.06s-3.05-.01-4.12-.06c-1.05-.05-1.63-.22-2.01-.37a3.83 3.83 0 0 1-1.45-1.45c-.15-.38-.32-.96-.37-2.01C2.01 15.05 2 14.72 2 12s.01-3.05.06-4.12c.05-1.05.22-1.63.37-2.01a3.83 3.83 0 0 1 1.45-1.45c.38-.15.96-.32 2.01-.37C8.95 2.01 9.28 2 12 2m0-2C9.26 0 8.92.01 7.84.06 6.77.11 5.86.35 5.06.66c-.84.33-1.55.77-2.25 1.47A6.47 6.47 0 0 0 1.34 4.4C1.03 5.2.79 6.1.74 7.18.69 8.26.68 8.6.68 11.34s.01 3.08.06 4.16c.05 1.08.29 1.99.6 2.79.33.84.77 1.55 1.47 2.25s1.41 1.14 2.25 1.47c.8.31 1.71.55 2.78.6.11.05 1.43.06 4.16.06s3.08-.01 4.16-.06c1.08-.05 1.99-.29 2.79-.6a6.47 6.47 0 0 0 2.25-1.47c.7-.7 1.14-1.41 1.47-2.25.31-.8.55-1.71.6-2.78.05-1.08.06-1.43.06-4.16s-.01-3.08-.06-4.16c-.05-1.08-.29-1.99-.6-2.79a6.47 6.47 0 0 0-1.47-2.25c-.7-.7-1.41-1.14-2.25-1.47-.8-.31-1.71-.55-2.78-.6C15.08.01 14.74 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16a6.16 6.16 0 0 0 0-12.32zM12 16.16a4.16 4.16 0 1 1 0-8.32 4.16 4.16 0 0 1 0 8.32zM18.4 4.26a1.34 1.34 0 1 0 0 2.68 1.34 1.34 0 0 0 0-2.68z"/>
                    </svg>
                  </a>
                  <a href="https://www.tiktok.com/@sl.fathimas.products?_r=1&_t=ZS-9724WrpOIGF" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#444] hover:text-[#D98C1F] hover:shadow-md transition-all">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.07 8.07 0 004.77 1.54V6.78s-.51.03-.99-.09z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#444] hover:text-[#D98C1F] hover:shadow-md transition-all">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.5 6.2c-.3-1.1-1.1-1.9-2.2-2.1-1.9-.5-9.6-.5-9.6-.5s-7.7 0-9.6.5C1 4.3.2 5.1-.1 6.2-.5 8.1-.5 12-.5 12s0 3.9.4 5.8c.3 1.1 1.1 1.9 2.2 2.1 1.9.5 9.6.5 9.6.5s7.7 0 9.6-.5c1.1-.3 1.9-1.1 2.2-2.1.4-1.9.4-5.8.4-5.8s0-3.9-.4-5.8zM9.5 15.5V8.5L15.5 12l-6 3.5z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <h2 className="font-display font-bold text-[#1A2E1F] text-3xl mb-8">Send us a Message</h2>
                
                {sent ? (
                  <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <div className="w-20 h-20 bg-[#D98C1F]/10 rounded-full flex items-center justify-center mb-6">
                      <Send className="w-8 h-8 text-[#D98C1F]" />
                    </div>
                    <h3 className="font-display font-bold text-[#222] text-2xl mb-3">Message Sent Successfully!</h3>
                    <p className="text-[#666] max-w-md mx-auto mb-8">
                      Thank you for reaching out. We've received your message and will get back to you within 24 hours. For urgent inquiries, please contact us via WhatsApp.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="bg-[#D98C1F] hover:bg-[#B8740F] text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#444] mb-2">Full Name *</label>
                        <input
                          type="text" required value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your full name"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors bg-[#FAFAFA]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#444] mb-2">Phone Number *</label>
                        <input
                          type="tel" required value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+94 77 000 0000"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors bg-[#FAFAFA]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#444] mb-2">Email Address *</label>
                      <input
                        type="email" required value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors bg-[#FAFAFA]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#444] mb-2">Subject *</label>
                      <select
                        required value={form.subject}
                        onChange={(e) => {
                          setForm({ ...form, subject: e.target.value });
                          setSelectedSubject(e.target.value);
                        }}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors bg-[#FAFAFA] text-[#444]"
                      >
                        <option value="">Select a subject</option>
                        {subjectBlocks.map(b => (
                          <option key={b.id} value={b.id}>{b.title}</option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#444] mb-2">Message *</label>
                      <textarea
                        required rows={6} value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us how we can help you..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors bg-[#FAFAFA] resize-none"
                      />
                    </div>

                    {/* Subject Category Selectors */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 pb-4">
                      {subjectBlocks.map((block) => (
                        <div
                          key={block.id}
                          onClick={() => setSelectedSubject(block.id)}
                          className={`cursor-pointer rounded-xl p-3 text-center transition-all border-2 ${
                            selectedSubject === block.id 
                              ? "border-[#D98C1F] bg-[#D98C1F]/5" 
                              : "border-transparent bg-[#FAF7F2] hover:bg-gray-100"
                          }`}
                        >
                          <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                            selectedSubject === block.id ? "text-[#D98C1F]" : "text-[#555]"
                          }`}>
                            {block.icon}
                          </div>
                          <h5 className="font-bold text-[11px] text-[#222] leading-tight mb-0.5">{block.title}</h5>
                          <p className="text-[10px] text-[#777] leading-tight">{block.desc}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit" disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-base"
                    >
                      {submitting ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Area (Bottom Beige Section) */}
      <div className="bg-[#FAF7F2] py-16 px-4 sm:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="flex items-start gap-4">
              <div className="text-[#D98C1F]">
                <Star className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-[#1A2E1F] mb-1">Premium Quality</h4>
                <p className="text-[#666] text-sm">Only the finest ingredients</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-[#D98C1F]">
                <Heart className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-[#1A2E1F] mb-1">Handmade</h4>
                <p className="text-[#666] text-sm">Made with love and care</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-[#D98C1F]">
                <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-[#1A2E1F] mb-1">Secure Packaging</h4>
                <p className="text-[#666] text-sm">Safe & hygienic packaging</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-[#D98C1F]">
                <Truck className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-[#1A2E1F] mb-1">Fast Delivery</h4>
                <p className="text-[#666] text-sm">Islandwide & international</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
