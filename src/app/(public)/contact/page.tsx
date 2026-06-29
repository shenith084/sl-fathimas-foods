"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Send, MapPin, Phone, Mail, Clock, MessageCircle, ShoppingBag, Package, Handshake, Star, Heart, ShieldCheck, Truck, User, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

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

  const whatsapp = settings?.whatsappNumber || "070 515 1000";
  const emailAddr = settings?.businessEmail || "info@slfathimas.lk";
  const address = settings?.businessAddress || "Colombo, Sri Lanka";

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
      toast.error("There was an error sending your message. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const subjectBlocks = [
    { id: "General Inquiry", icon: <User className="w-5 h-5" />, title: "General Inquiry", desc: "Ask us anything" },
    { id: "Custom Orders", icon: <ShoppingBag className="w-5 h-5" />, title: "Custom Orders", desc: "Request a quote" },
    { id: "Product Support", icon: <Package className="w-5 h-5" />, title: "Product Support", desc: "Get help with products" },
    { id: "Partnership", icon: <Handshake className="w-5 h-5" />, title: "Partnership", desc: "Business inquiries" },
  ];

  return (
    <div className="bg-[#F5F0E8] min-h-screen font-sans">

      {/* ── Hero Section ── */}
      <div className="bg-[#F5F0E8] w-full pt-10 pb-0 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Left: heading */}
          <div className="md:w-[45%] z-10 mb-6 md:mb-0 md:pr-8 pt-4">
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
              Contact <span className="text-[#D98C1F]">Us</span>
            </h1>
            {/* Small leaf decoration */}
            <div className="mb-5">
              <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
                <path d="M4 8 Q14 0 24 8" stroke="#2C4631" strokeWidth="1.2" fill="none"/>
                <path d="M14 3 L14 13" stroke="#2C4631" strokeWidth="1" fill="none"/>
              </svg>
            </div>
            <p className="text-[#555] text-base leading-relaxed max-w-sm">
              Whether you have a question, need help, or want to place a custom order, our team is here for you.
            </p>
          </div>
          {/* Right: product image */}
          <div className="md:w-[55%] relative h-[220px] md:h-[300px] w-full rounded-2xl overflow-hidden">
            <Image
              src="/contact-hero-v2.png"
              alt="SL Fathima's Products"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </div>

      {/* ── Two-Column Content ── */}
      <div className="bg-[#F5F0E8] py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── Left Column ── */}
            <div className="w-full lg:w-[340px] flex-shrink-0 space-y-0">

              {/* WhatsApp Dark Card */}
              <div className="bg-[#1C3826] rounded-2xl p-6 text-white shadow-md">
                <div className="flex items-center gap-3 mb-1">
                  {/* WhatsApp icon circle */}
                  <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">Get in Touch</h3>
                    <p className="text-white/70 text-sm font-medium">Chat on WhatsApp</p>
                  </div>
                </div>
                <p className="text-white/65 text-sm mb-5 mt-3 leading-relaxed">
                  The fastest way to reach us.<br/>Usually reply within minutes!
                </p>
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-white text-[#1C3826] font-bold px-5 py-3 rounded-xl text-base hover:bg-gray-100 transition-colors shadow-sm"
                >
                  {whatsapp}
                </a>
              </div>

              {/* Info rows */}
              <div className="bg-white rounded-2xl mt-4 overflow-hidden shadow-sm border border-gray-100">
                {/* Call Us */}
                <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
                  <div className="w-9 h-9 flex items-center justify-center text-[#555] flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#888] mb-0.5">Call Us</p>
                    <p className="font-bold text-[#1A2E1F] text-sm">{whatsapp}</p>
                    <p className="text-xs text-[#888]">Mon - Sat: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
                {/* Email Us */}
                <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
                  <div className="w-9 h-9 flex items-center justify-center text-[#555] flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#888] mb-0.5">Email Us</p>
                    <p className="font-bold text-[#1A2E1F] text-sm">{emailAddr}</p>
                    <p className="text-xs text-[#888]">We reply within 24 hours</p>
                  </div>
                </div>
                {/* Location */}
                <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
                  <div className="w-9 h-9 flex items-center justify-center text-[#555] flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#888] mb-0.5">Our Location</p>
                    <p className="font-bold text-[#1A2E1F] text-sm">{address}</p>
                    <p className="text-xs text-[#888]">Islandwide & International Delivery</p>
                  </div>
                </div>
                {/* Response Time */}
                <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
                  <div className="w-9 h-9 flex items-center justify-center text-[#555] flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#888] mb-0.5">Response Time</p>
                    <p className="font-bold text-[#1A2E1F] text-sm">Within 24 Hours</p>
                    <p className="text-xs text-[#888]">For all inquiries</p>
                  </div>
                </div>
                {/* Social Links */}
                <div className="px-5 py-4 text-center">
                  <p className="text-xs text-[#888] mb-3">Follow Us</p>
                  <div className="flex items-center justify-center gap-3">
                    <a href="#" className="w-9 h-9 bg-[#F5F0E8] rounded-full flex items-center justify-center text-[#444] hover:text-[#D98C1F] transition-all">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6c1.05 0 2.05.2 2.3.3v2.7h-1.3c-1.24 0-1.5.6-1.5 1.48V12h2.7l-.4 3h-2.3v6.8C18.56 20.87 22 16.84 22 12z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-9 h-9 bg-[#F5F0E8] rounded-full flex items-center justify-center text-[#444] hover:text-[#D98C1F] transition-all">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2c2.72 0 3.05.01 4.12.06 1.05.05 1.63.22 2.01.37a3.83 3.83 0 0 1 1.45 1.45c.15.38.32.96.37 2.01.05 1.07.06 1.4.06 4.12s-.01 3.05-.06 4.12c-.05 1.05-.22 1.63-.37 2.01a3.83 3.83 0 0 1-1.45 1.45c-.38.15-.96.32-2.01.37-1.07.05-1.4.06-4.12.06s-3.05-.01-4.12-.06c-1.05-.05-1.63-.22-2.01-.37a3.83 3.83 0 0 1-1.45-1.45c-.15-.38-.32-.96-.37-2.01C2.01 15.05 2 14.72 2 12s.01-3.05.06-4.12c.05-1.05.22-1.63.37-2.01a3.83 3.83 0 0 1 1.45-1.45c.38-.15.96-.32 2.01-.37C8.95 2.01 9.28 2 12 2m0-2C9.26 0 8.92.01 7.84.06 6.77.11 5.86.35 5.06.66c-.84.33-1.55.77-2.25 1.47A6.47 6.47 0 0 0 1.34 4.4C1.03 5.2.79 6.1.74 7.18.69 8.26.68 8.6.68 11.34s.01 3.08.06 4.16c.05 1.08.29 1.99.6 2.79.33.84.77 1.55 1.47 2.25s1.41 1.14 2.25 1.47c.8.31 1.71.55 2.78.6.11.05 1.43.06 4.16.06s3.08-.01 4.16-.06c1.08-.05 1.99-.29 2.79-.6a6.47 6.47 0 0 0 2.25-1.47c.7-.7 1.14-1.41 1.47-2.25.31-.8.55-1.71.6-2.78.05-1.08.06-1.43.06-4.16s-.01-3.08-.06-4.16c-.05-1.08-.29-1.99-.6-2.79a6.47 6.47 0 0 0-1.47-2.25c-.7-.7-1.41-1.14-2.25-1.47-.8-.31-1.71-.55-2.78-.6C15.08.01 14.74 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16a6.16 6.16 0 0 0 0-12.32zM12 16.16a4.16 4.16 0 1 1 0-8.32 4.16 4.16 0 0 1 0 8.32zM18.4 4.26a1.34 1.34 0 1 0 0 2.68 1.34 1.34 0 0 0 0-2.68z"/>
                      </svg>
                    </a>
                    <a href="https://www.tiktok.com/@sl.fathimas.products?_r=1&_t=ZS-9724WrpOIGF" target="_blank" rel="noreferrer" className="w-9 h-9 bg-[#F5F0E8] rounded-full flex items-center justify-center text-[#444] hover:text-[#D98C1F] transition-all">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.07 8.07 0 004.77 1.54V6.78s-.51.03-.99-.09z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-9 h-9 bg-[#F5F0E8] rounded-full flex items-center justify-center text-[#444] hover:text-[#D98C1F] transition-all">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M23.5 6.2c-.3-1.1-1.1-1.9-2.2-2.1-1.9-.5-9.6-.5-9.6-.5s-7.7 0-9.6.5C1 4.3.2 5.1-.1 6.2-.5 8.1-.5 12-.5 12s0 3.9.4 5.8c.3 1.1 1.1 1.9 2.2 2.1 1.9.5 9.6.5 9.6.5s7.7 0 9.6-.5c1.1-.3 1.9-1.1 2.2-2.1.4-1.9.4-5.8.4-5.8s0-3.9-.4-5.8zM9.5 15.5V8.5L15.5 12l-6 3.5z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Column – Contact Form ── */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl p-7 lg:p-8 shadow-sm border border-gray-100">
                <h2 className="font-display font-bold text-[#1A2E1F] text-2xl mb-1">Send us a Message</h2>
                <div className="w-10 h-[3px] bg-[#D98C1F] rounded-full mb-6"></div>

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
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name + Phone row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-[#333] mb-1.5">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa]" />
                          <input
                            type="text" required value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Your full name"
                            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors bg-white text-[#333] placeholder-[#bbb]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#333] mb-1.5">Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa]" />
                          <input
                            type="tel" required value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="+94 77 000 0000"
                            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors bg-white text-[#333] placeholder-[#bbb]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333] mb-1.5">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa]" />
                        <input
                          type="email" required value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="your@email.com"
                          className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors bg-white text-[#333] placeholder-[#bbb]"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333] mb-1.5">Subject *</label>
                      <div className="relative">
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa] pointer-events-none" />
                        <select
                          required value={form.subject}
                          onChange={(e) => {
                            setForm({ ...form, subject: e.target.value });
                            setSelectedSubject(e.target.value);
                          }}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors bg-white text-[#555] appearance-none pr-9"
                        >
                          <option value="">Select a subject</option>
                          {subjectBlocks.map(b => (
                            <option key={b.id} value={b.id}>{b.title}</option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333] mb-1.5">Message *</label>
                      <textarea
                        required rows={5} value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us how we can help you..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors bg-white text-[#333] placeholder-[#bbb] resize-none"
                      />
                    </div>

                    {/* Subject Category Selectors */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {subjectBlocks.map((block) => (
                        <div
                          key={block.id}
                          onClick={() => setSelectedSubject(block.id)}
                          className={`cursor-pointer rounded-xl p-3 text-center transition-all border ${
                            selectedSubject === block.id
                              ? "border-[#D98C1F] bg-[#D98C1F]/5"
                              : "border-gray-100 bg-[#F5F0E8] hover:bg-gray-100"
                          }`}
                        >
                          <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
                            selectedSubject === block.id ? "text-[#D98C1F]" : "text-[#666]"
                          }`}>
                            {block.icon}
                          </div>
                          <h5 className="font-bold text-[11px] text-[#222] leading-tight mb-0.5">{block.title}</h5>
                          <p className="text-[10px] text-[#888] leading-tight">{block.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit" disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-base"
                    >
                      {submitting ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
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

    </div>
  );
}
