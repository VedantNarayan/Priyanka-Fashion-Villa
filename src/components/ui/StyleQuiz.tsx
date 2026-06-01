"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChevronRight, ChevronLeft, ShoppingBag } from "lucide-react";
import Image from "next/image";

interface StyleQuizProps {
    isOpen: boolean;
    onClose: () => void;
    products: any[];
}

export default function StyleQuiz({ isOpen, onClose, products }: StyleQuizProps) {
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState({
        occasion: "",
        color: "",
        fabric: "",
    });
    const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

    if (!isOpen) return null;

    const handleSelect = (field: string, value: string) => {
        setAnswers(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Generate recommendations
            const matches = products.filter(p => {
                const categoryMatch = 
                    answers.occasion === "Bridal/Wedding" ? p.category === "Gala" || p.category === "Evening Wear" :
                    answers.occasion === "Cocktail Party" ? p.category === "Cocktail" || p.category === "Party" :
                    p.category === "Casual" || p.category === "Prom";
                
                const desc = p.description?.toLowerCase() || "";
                const name = p.name?.toLowerCase() || "";
                const fabricMatch = answers.fabric ? (desc.includes(answers.fabric.toLowerCase()) || name.includes(answers.fabric.toLowerCase())) : true;

                return categoryMatch || fabricMatch;
            });

            // Fallback to top 2 if no direct matches
            const selected = matches.length > 0 ? matches.slice(0, 2) : products.slice(0, 2);
            setRecommendedProducts(selected);
            setStep(4);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const resetQuiz = () => {
        setStep(1);
        setAnswers({ occasion: "", color: "", fabric: "" });
        setRecommendedProducts([]);
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-lg w-full max-w-2xl overflow-hidden shadow-2xl relative">
                
                {/* Header */}
                <div className="p-6 border-b border-stone-800 flex justify-between items-center bg-black/35">
                    <div className="flex items-center gap-2">
                        <Sparkles size={20} className="text-amber-400" />
                        <h2 className="font-serif text-lg tracking-wider uppercase text-white">Signature Style Quiz</h2>
                    </div>
                    <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress bar */}
                {step <= 3 && (
                    <div className="w-full bg-stone-800 h-1">
                        <div 
                            className="bg-amber-400 h-full transition-all duration-300" 
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                )}

                {/* Quiz Content */}
                <div className="p-8 min-h-[380px] flex flex-col justify-between">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                variants={stepVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-6"
                            >
                                <h3 className="text-2xl font-serif text-white text-center">What is the occasion?</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {["Bridal & Wedding", "Cocktail Soirée", "Festive Gala", "Luxury Casual"].map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleSelect("occasion", opt)}
                                            className={`p-5 rounded-md border text-left transition-all duration-300 ${
                                                answers.occasion === opt
                                                    ? "border-amber-400 bg-amber-400/10 text-white"
                                                    : "border-stone-800 bg-black/20 hover:border-stone-700 text-stone-300"
                                            }`}
                                        >
                                            <span className="font-serif block text-lg mb-1">{opt}</span>
                                            <span className="text-stone-500 text-xs font-light">Find products crafted specifically for this moment.</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                variants={stepVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-6"
                            >
                                <h3 className="text-2xl font-serif text-white text-center">Select your color preference</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { name: "Royal Gold & Crimson", desc: "Traditional luxury and prestige colors." },
                                        { name: "Sleek Obsidian & Silver", desc: "Mysterious, modern elegance." },
                                        { name: "Pastels & Creams", desc: "Soft, gentle, sophisticated tones." },
                                        { name: "Vibrant Jewel Tones", desc: "Rich sapphires, rubies, and emeralds." }
                                    ].map((opt) => (
                                        <button
                                            key={opt.name}
                                            onClick={() => handleSelect("color", opt.name)}
                                            className={`p-5 rounded-md border text-left transition-all duration-300 ${
                                                answers.color === opt.name
                                                    ? "border-amber-400 bg-amber-400/10 text-white"
                                                    : "border-stone-800 bg-black/20 hover:border-stone-700 text-stone-300"
                                            }`}
                                        >
                                            <span className="font-serif block text-lg mb-1">{opt.name}</span>
                                            <span className="text-stone-500 text-xs font-light">{opt.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                variants={stepVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-6"
                            >
                                <h3 className="text-2xl font-serif text-white text-center">Your preferred fabric</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {["Silk & Banarasi", "Luxury Velvet", "Flowy Georgette", "Organza & Lace"].map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleSelect("fabric", opt)}
                                            className={`p-5 rounded-md border text-left transition-all duration-300 ${
                                                answers.fabric === opt
                                                    ? "border-amber-400 bg-amber-400/10 text-white"
                                                    : "border-stone-800 bg-black/20 hover:border-stone-700 text-stone-300"
                                            }`}
                                        >
                                            <span className="font-serif block text-lg mb-1">{opt}</span>
                                            <span className="text-stone-500 text-xs font-light">Elegance lies in the weave and weight.</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                variants={stepVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h3 className="text-2xl font-serif text-white">Your Signature Match</h3>
                                    <p className="text-stone-400 text-xs mt-1">Curated specifically based on your responses.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                                    {recommendedProducts.map((p) => (
                                        <div key={p.id} className="bg-black/40 border border-stone-800 rounded-sm overflow-hidden flex flex-col justify-between">
                                            <div className="relative aspect-[3/4] w-full">
                                                <Image 
                                                    src={p.cardImage || "/images/placeholder.png"} 
                                                    alt={p.name} 
                                                    fill 
                                                    className="object-cover" 
                                                />
                                            </div>
                                            <div className="p-4 text-center">
                                                <h4 className="font-serif text-base text-white truncate">{p.name}</h4>
                                                <p className="text-amber-400 text-sm mt-1">₹{p.price.toLocaleString('en-IN')}</p>
                                                <a 
                                                    href={`/product/${p.id}`} 
                                                    className="mt-3 w-full py-2 bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-amber-400 hover:text-black transition-all flex items-center justify-center gap-2 rounded-sm"
                                                >
                                                    <ShoppingBag size={12} /> View Product
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-center pt-4">
                                    <button 
                                        onClick={resetQuiz}
                                        className="text-stone-400 hover:text-white text-xs uppercase tracking-widest border-b border-stone-600 pb-1"
                                    >
                                        Retake Quiz
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    {step <= 3 && (
                        <div className="flex justify-between items-center pt-8 border-t border-stone-850 mt-6">
                            <button
                                onClick={handleBack}
                                disabled={step === 1}
                                className="flex items-center gap-1 text-stone-400 hover:text-white text-xs uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} /> Back
                            </button>
                            
                            <button
                                onClick={handleNext}
                                disabled={
                                    (step === 1 && !answers.occasion) ||
                                    (step === 2 && !answers.color) ||
                                    (step === 3 && !answers.fabric)
                                }
                                className="flex items-center gap-1 bg-amber-400 text-stone-900 px-6 py-2.5 rounded-sm font-semibold text-xs uppercase tracking-widest hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {step === 3 ? "Get Signature Match" : "Next"} <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
