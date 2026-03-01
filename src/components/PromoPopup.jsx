import { useState, useEffect } from 'react';
import { Flame, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PromoPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [dismissed, setDismissed] = useState(localStorage.getItem('promo-dismissed') === 'true');

    useEffect(() => {
        if (!dismissed) {
            const showTimer = setTimeout(() => setIsVisible(true), 15000);
            return () => clearTimeout(showTimer);
        }
    }, [dismissed]);

    useEffect(() => {
        if (isVisible) {
            const hideTimer = setTimeout(() => setIsVisible(false), 5000);
            return () => clearTimeout(hideTimer);
        }
    }, [isVisible]);

    const handleDismiss = () => {
        setDismissed(true);
        localStorage.setItem('promo-dismissed', 'true');
        setIsVisible(false);
    };

    const handleWhatsApp = () => {
        const phoneNumber = '919876543210'; // Use real number here
        const message = 'Hi CodeArcade! I saw your limited time offer for websites starting @ ₹3000. I am interested!';
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 100, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 100, scale: 0.8 }}
                    className="fixed bottom-8 right-8 z-[10000] max-w-[400px]"
                >
                    <div className="bg-gradient-to-br from-[#1e1e2e] to-[#0a0a0f] border border-[var(--primary-color)]/30 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden group">
                        {/* Interactive Sparkles Background or Glow */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--primary-color)]/20 blur-3xl animate-pulse"></div>

                        <button
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-gradient-to-tr from-[var(--primary-color)] to-[var(--secondary-color)] rounded-2xl flex items-center justify-center text-white shadow-lg animate-bounce-slow">
                                <Flame size={32} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-white tracking-tight">Limited Time Offer!</h3>
                                <div className="space-y-2 pt-2">
                                    <p className="text-base text-gray-300">Websites from <strong className="text-[var(--secondary-color)] text-xl">₹3000</strong></p>
                                    <p className="text-base text-gray-300">Mobile Apps from <strong className="text-[var(--primary-color)] text-xl">₹20000</strong></p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleWhatsApp}
                            className="w-full mt-8 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.03] shadow-lg shadow-green-500/20"
                        >
                            <MessageCircle size={22} /> Claim Offer Now
                        </button>

                        {/* Progress Bar (Custom timer) */}
                        <div className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] w-full animate-progress-shrink origin-left"></div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PromoPopup;
