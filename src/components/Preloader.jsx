import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[5000] bg-[var(--bg-color)]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 select-none"
                >
                    {/* Background Radial Glow */}
                    <div className="absolute w-[400px] h-[400px] bg-[var(--primary-color)]/20 rounded-full blur-[100px] pointer-events-none" />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm"
                    >
                        {/* Glowing Icon Box */}
                        <div className="relative">
                            <div className="w-20 h-20 bg-[var(--glass-bg)] border border-[var(--primary-color)]/40 rounded-3xl flex items-center justify-center p-2 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                                <img src="/logo.png" alt="Code Arcade Logo" className="w-16 h-16 rounded-2xl object-contain animate-pulse" />
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 rounded-full text-xs font-semibold text-[var(--secondary-color)] tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-[var(--secondary-color)] animate-ping" />
                            <span>Code Arcade Engine</span>
                        </div>

                        {/* Main Preloader Title */}
                        <div>
                            <h3 className="text-2xl font-black text-[var(--text-color)] tracking-tight mb-1">
                                Synchronizing Code Arcade...
                            </h3>
                            <p className="text-xs text-[var(--text-muted)] font-medium">
                                Loading web solutions & interactive UI...
                            </p>
                        </div>

                        {/* Animated Loading Bar */}
                        <div className="w-56 h-1.5 bg-[var(--glass-border)] rounded-full overflow-hidden relative">
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '0%' }}
                                transition={{ duration: 1.1, ease: 'easeInOut' }}
                                className="h-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
