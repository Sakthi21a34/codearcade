import { useState, useEffect } from 'react';
import { Flame, X, CheckCircle2, ArrowRight, User, Phone, Globe, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const PromoPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [dismissed, setDismissed] = useState(localStorage.getItem('promo-dismissed') === 'true');
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    
    // Step state: 1 = Name, 2 = Phone, 3 = Website Description, 4 = Thank You
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', phone: '', websiteType: '' });
    const [phoneError, setPhoneError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!dismissed && !isClaimModalOpen) {
            const showTimer = setTimeout(() => setIsVisible(true), 8000);
            return () => clearTimeout(showTimer);
        }
    }, [dismissed, isClaimModalOpen]);

    useEffect(() => {
        // Only auto-hide if user hasn't opened the claim modal form
        if (isVisible && !isClaimModalOpen) {
            const hideTimer = setTimeout(() => setIsVisible(false), 12000);
            return () => clearTimeout(hideTimer);
        }
    }, [isVisible, isClaimModalOpen]);

    const handleDismiss = () => {
        setDismissed(true);
        localStorage.setItem('promo-dismissed', 'true');
        setIsVisible(false);
        setIsClaimModalOpen(false);
        setPhoneError('');
    };

    const handleStartClaim = () => {
        setIsVisible(false);
        setIsClaimModalOpen(true);
        setPhoneError('');
        setStep(1);
    };

    const handlePhoneChange = (e) => {
        const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
        setFormData(prev => ({ ...prev, phone: cleaned }));
        if (phoneError) setPhoneError('');
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        if (step === 1 && formData.name.trim() === '') return;
        if (step === 2) {
            const phoneDigits = formData.phone.trim();
            if (!phoneDigits) {
                setPhoneError('Mobile number is required.');
                return;
            }
            if (phoneDigits.length !== 10) {
                setPhoneError(`Mobile number must be exactly 10 digits (entered ${phoneDigits.length} digits).`);
                return;
            }
            if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
                setPhoneError('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
                return;
            }
            setPhoneError('');
        }
        setStep(prev => prev + 1);
    };

    const handleSubmitClaim = async (e) => {
        e.preventDefault();
        if (formData.websiteType.trim() === '') return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'messages'), {
                name: formData.name,
                email: `Phone: ${formData.phone}`,
                subject: `Limited Offer Request (${formData.name})`,
                message: `[LIMITED OFFER CLAIM]\nPhone: ${formData.phone}\nWebsite Description: ${formData.websiteType}`,
                timestamp: serverTimestamp()
            });
            setStep(4); // Move to Thank You step
        } catch (error) {
            console.error("Error submitting claim:", error);
            alert("Error submitting your request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* 1. INITIAL PROMO POPUP TOAST */}
            <AnimatePresence>
                {isVisible && !isClaimModalOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed bottom-8 right-8 z-[10000] max-w-[400px] w-full px-4 sm:px-0"
                    >
                        <div className="obsidian-card rounded-2xl p-6 md:p-7 relative overflow-hidden group">
                            {/* Razor 1px Top Highlight */}
                            <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

                            <button
                                onClick={handleDismiss}
                                className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl cursor-pointer"
                            >
                                <X size={18} />
                            </button>

                            <div className="flex items-center gap-5">
                                <div className="obsidian-icon-box w-14 h-14 rounded-xl flex items-center justify-center text-cyan-400 shrink-0">
                                    <Flame size={28} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white tracking-tight">Limited Time Offer!</h3>
                                    <div className="space-y-1 pt-1">
                                        <p className="text-xs text-gray-300">Websites from <strong className="text-[var(--secondary-color)] text-sm font-extrabold">₹3000</strong></p>
                                        <p className="text-xs text-gray-300">Mobile Apps from <strong className="text-[var(--primary-color)] text-sm font-extrabold">₹20000</strong></p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleStartClaim}
                                className="w-full mt-6 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:opacity-95 shadow-lg shadow-cyan-500/10 text-sm cursor-pointer"
                            >
                                <span>Claim Offer Now</span>
                                <ArrowRight size={16} />
                            </button>

                            {/* Timer Bar */}
                            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] w-full animate-progress-shrink origin-left" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. STEP-BY-STEP CLAIM OFFER MODAL */}
            <AnimatePresence>
                {isClaimModalOpen && (
                    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-black/85">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="obsidian-card w-full max-w-md rounded-2xl p-7 md:p-8 shadow-2xl relative overflow-hidden text-[var(--text-color)]"
                        >
                            {/* Razor 1px Top Highlight */}
                            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                            <button
                                onClick={() => setIsClaimModalOpen(false)}
                                className="absolute top-5 right-5 text-[var(--text-muted)] hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl cursor-pointer"
                            >
                                <X size={18} />
                            </button>

                            {/* STEP 1: NAME */}
                            {step === 1 && (
                                <motion.form 
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleNextStep}
                                    className="space-y-5"
                                >
                                    <div className="obsidian-icon-box w-12 h-12 rounded-xl flex items-center justify-center text-[var(--primary-color)] mb-4">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--secondary-color)]">Step 1 of 3</span>
                                        <h3 className="text-xl font-extrabold tracking-tight mt-1">What is your name?</h3>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">Please enter your full name to get started.</p>
                                    </div>

                                    <input
                                        type="text"
                                        required
                                        autoFocus
                                        placeholder="Enter your name..."
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full obsidian-well rounded-xl p-3.5 text-sm text-[var(--text-color)] placeholder:text-slate-500 focus:outline-none"
                                    />

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-cyan-500/10 cursor-pointer"
                                    >
                                        <span>Next Step</span>
                                        <ArrowRight size={16} />
                                    </button>
                                </motion.form>
                            )}

                            {/* STEP 2: PHONE NUMBER */}
                            {step === 2 && (
                                <motion.form 
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleNextStep}
                                    className="space-y-5"
                                >
                                    <div className="obsidian-icon-box w-12 h-12 rounded-xl flex items-center justify-center text-[var(--secondary-color)] mb-4">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--secondary-color)]">Step 2 of 3</span>
                                        <h3 className="text-xl font-extrabold tracking-tight mt-1">What is your mobile number?</h3>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">Please enter your 10-digit mobile number to proceed.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                required
                                                autoFocus
                                                maxLength={10}
                                                placeholder="Enter 10-digit mobile number..."
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                className={`w-full obsidian-well rounded-xl p-3.5 pr-16 text-sm text-[var(--text-color)] placeholder:text-slate-500 focus:outline-none ${phoneError ? 'border-red-500/70' : ''}`}
                                            />
                                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--text-muted)]">
                                                {formData.phone.length}/10
                                            </span>
                                        </div>
                                        {phoneError && (
                                            <p className="text-xs text-red-400 font-medium pl-1">{phoneError}</p>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => { setPhoneError(''); setStep(1); }}
                                            className="px-5 py-3.5 obsidian-well rounded-xl font-bold text-xs text-[var(--text-muted)] hover:text-white cursor-pointer"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-cyan-500/10 cursor-pointer"
                                        >
                                            <span>Next Step</span>
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </motion.form>
                            )}

                            {/* STEP 3: WEBSITE TYPE / DESCRIPTION */}
                            {step === 3 && (
                                <motion.form 
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleSubmitClaim}
                                    className="space-y-5"
                                >
                                    <div className="obsidian-icon-box w-12 h-12 rounded-xl flex items-center justify-center text-[var(--primary-color)] mb-4">
                                        <Globe size={24} />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--secondary-color)]">Step 3 of 3</span>
                                        <h3 className="text-xl font-extrabold tracking-tight mt-1">What type of website do you want?</h3>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">Describe the project or website features you need.</p>
                                    </div>

                                    <textarea
                                        required
                                        rows="4"
                                        autoFocus
                                        placeholder="Describe your website requirement (e.g. E-commerce, Portfolio, College Project)..."
                                        value={formData.websiteType}
                                        onChange={(e) => setFormData({ ...formData, websiteType: e.target.value })}
                                        className="w-full obsidian-well rounded-xl p-3.5 text-sm text-[var(--text-color)] placeholder:text-slate-500 focus:outline-none resize-none"
                                    />

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="px-5 py-3.5 obsidian-well rounded-xl font-bold text-xs text-[var(--text-muted)] hover:text-white cursor-pointer"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-cyan-500/10 disabled:opacity-50 cursor-pointer"
                                        >
                                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                            <span>{isSubmitting ? 'Submitting...' : 'Submit Claim'}</span>
                                        </button>
                                    </div>
                                </motion.form>
                            )}

                            {/* STEP 4: THANK YOU CONFIRMATION */}
                            {step === 4 && (
                                <motion.div 
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.9 }} 
                                    animate={{ opacity: 1, scale: 1 }} 
                                    className="text-center py-6 space-y-6"
                                >
                                    <div className="obsidian-icon-box w-16 h-16 rounded-2xl flex items-center justify-center text-[var(--secondary-color)] mx-auto shadow-xl">
                                        <CheckCircle2 size={36} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <h3 className="text-2xl font-black tracking-tight text-[var(--text-color)]">Thank You!</h3>
                                        <p className="text-sm font-semibold text-[var(--secondary-color)]">
                                            Our team will reach you shortly.
                                        </p>
                                        <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
                                            We have received your offer request and will call you back on <strong className="text-[var(--text-color)]">{formData.phone}</strong>.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setIsClaimModalOpen(false)}
                                        className="w-full obsidian-well hover:border-cyan-400/50 text-[var(--text-color)] py-3 rounded-xl font-bold transition-all text-sm cursor-pointer"
                                    >
                                        Close
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PromoPopup;
