import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black text-white">
            <div className="container mx-auto px-4 max-w-7xl py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <h3 className="font-serif text-xl mb-4 tracking-wide">Priyanka Fashionvilla</h3>
                        <p className="text-stone-400 text-sm leading-relaxed">
                            Curated fashion for the modern woman. Elegance redefined with every piece.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <a href="#" className="text-stone-400 hover:text-white transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
                            <a href="#" className="text-stone-400 hover:text-white transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
                            <a href="#" className="text-stone-400 hover:text-white transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xs uppercase tracking-widest mb-4 text-stone-300">Shop</h4>
                        <ul className="space-y-3">
                            <li><Link href="/shop" className="text-stone-400 text-sm hover:text-white transition-colors">All Products</Link></li>
                            <li><Link href="/shop?category=Evening+Wear" className="text-stone-400 text-sm hover:text-white transition-colors">Evening Wear</Link></li>
                            <li><Link href="/shop?category=Cocktail" className="text-stone-400 text-sm hover:text-white transition-colors">Cocktail</Link></li>
                            <li><Link href="/shop?category=Casual" className="text-stone-400 text-sm hover:text-white transition-colors">Casual</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-xs uppercase tracking-widest mb-4 text-stone-300">Support</h4>
                        <ul className="space-y-3">
                            <li><Link href="/contact" className="text-stone-400 text-sm hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/policies#shipping" className="text-stone-400 text-sm hover:text-white transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/policies#returns" className="text-stone-400 text-sm hover:text-white transition-colors">Returns & Exchanges</Link></li>
                            <li><Link href="/policies#privacy" className="text-stone-400 text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/policies#terms" className="text-stone-400 text-sm hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs uppercase tracking-widest mb-4 text-stone-300">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-stone-400 text-sm">
                                <Mail size={14} /> support@priyankafashionvilla.com
                            </li>
                            <li className="flex items-center gap-2 text-stone-400 text-sm">
                                <Phone size={14} /> +91 99999 99999
                            </li>
                            <li className="flex items-start gap-2 text-stone-400 text-sm">
                                <MapPin size={14} className="mt-0.5 shrink-0" /> India
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-stone-500 text-xs">&copy; {new Date().getFullYear()} Priyanka Fashionvilla. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/about" className="text-stone-500 text-xs hover:text-white transition-colors">About</Link>
                        <Link href="/contact" className="text-stone-500 text-xs hover:text-white transition-colors">Contact</Link>
                        <Link href="/policies" className="text-stone-500 text-xs hover:text-white transition-colors">Policies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
