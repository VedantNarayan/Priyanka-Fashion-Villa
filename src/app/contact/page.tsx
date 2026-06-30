"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 800));
        toast.success("Thank you! Your message has been sent successfully.");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-white text-stone-900">
            <div className="bg-black text-white py-20 text-center">
                <h1 className="font-serif text-5xl mb-3">Contact Us</h1>
                <p className="text-stone-400 text-sm tracking-wide uppercase">We&apos;d love to hear from you</p>
            </div>

            <div className="container mx-auto px-4 max-w-5xl py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div>
                        <h2 className="font-serif text-2xl mb-6">Send a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full border border-stone-200 p-3 rounded-sm text-sm focus:outline-none focus:border-black" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Email</label>
                                    <input 
                                        type="email" 
                                        required 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border border-stone-200 p-3 rounded-sm text-sm focus:outline-none focus:border-black" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Subject</label>
                                <input 
                                    type="text" 
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full border border-stone-200 p-3 rounded-sm text-sm focus:outline-none focus:border-black" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Message</label>
                                <textarea 
                                    rows={6} 
                                    required 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full border border-stone-200 p-3 rounded-sm text-sm focus:outline-none focus:border-black resize-none" 
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="bg-black text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors disabled:opacity-50"
                            >
                                {submitting ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="font-serif text-2xl mb-6">Get in Touch</h2>
                            <p className="text-stone-500 text-sm leading-relaxed mb-8">
                                Have a question about your order, need styling advice, or want to collaborate?
                                Reach out to us through any of the channels below.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center shrink-0">
                                    <Mail size={20} className="text-stone-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Email</p>
                                    <p className="text-stone-500 text-sm">support@priyankafashionvilla.com</p>
                                    <p className="text-xs text-stone-400 mt-1">We respond within 24 hours</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center shrink-0">
                                    <Phone size={20} className="text-stone-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Phone</p>
                                    <p className="text-stone-500 text-sm">+91 99999 99999</p>
                                    <p className="text-xs text-stone-400 mt-1">Mon–Sat, 10am–6pm IST</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                    <MessageCircle size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">WhatsApp</p>
                                    <p className="text-stone-500 text-sm">+91 99999 99999</p>
                                    <p className="text-xs text-stone-400 mt-1">Quick responses via WhatsApp</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center shrink-0">
                                    <MapPin size={20} className="text-stone-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Location</p>
                                    <p className="text-stone-500 text-sm">India</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
