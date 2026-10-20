import React, { useState, useEffect } from 'react';
import { Youtube, ArrowRight, CheckCircle2, ShieldCheck, X, Maximize2, Sparkles, Crosshair, GraduationCap, Briefcase, Code2, Rocket, Award, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTypedText } from '../hooks/useTypedText';


const Hero = () => {
    const typingWords = ["Premium Web Solutions", "College Major Projects", "Business Automation", "Modern UI/UX Designs"];
    const typedText = useTypedText(typingWords);

    return (
        <section id="home" className="min-h-screen flex flex-col lg:flex-row items-center justify-between pt-36 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto gap-12 relative overflow-hidden">
            {/* Left Content Column */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="hero-content flex-1 max-w-[700px] text-center lg:text-left z-10 space-y-8"
            >
                {/* Top Pill Badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full text-[var(--secondary-color)] text-xs font-bold tracking-wide shadow-sm backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-[var(--secondary-color)] animate-pulse" />
                    <span>Web Development & Projects</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.15] tracking-tight text-[var(--text-color)]">
                    Building reliable web solutions for <span className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] bg-clip-text text-transparent">learning and business.</span>
                </h1>

                {/* Typing Text Subheader */}
                <div className="h-8 text-xl lg:text-2xl font-semibold text-[var(--text-color)]">
                    <span className="text-[var(--secondary-color)] border-r-2 border-[var(--secondary-color)] pr-2 animate-pulse">{typedText}</span>
                </div>

                {/* Tagline Paragraph */}
                <p className="tagline text-lg text-[var(--text-muted)] max-w-[600px] mx-auto lg:mx-0 leading-relaxed">
                    Codearcade is a professional development initiative delivering clean, scalable, and
                    practical web applications that drive real-world results.
                </p>

                {/* Dual CTA Buttons */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start items-center pt-2">
                    <a
                        href="https://www.youtube.com/@CodeArcade-se4rc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 shadow-xl shadow-[var(--primary-color)]/25 hover:shadow-[var(--primary-color)]/40 hover:scale-105 transition-all text-sm tracking-wide"
                    >
                        <Youtube size={18} />
                        <span>Visit Channel</span>
                        <ArrowRight size={16} />
                    </a>

                    <a
                        href="#features"
                        className="bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-color)] px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-[var(--primary-color)]/10 hover:border-[var(--primary-color)]/40 hover:scale-105 transition-all text-sm backdrop-blur-md"
                    >
                        <span>Explore Solutions</span>
                    </a>
                </div>

                {/* Stats Ticker Row */}
                <div className="pt-8 border-t border-[var(--glass-border)] grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 text-left">
                    <div>
                        <div className="text-2xl lg:text-3xl font-black text-[var(--text-color)]">100%</div>
                        <div className="text-xs font-semibold text-[var(--text-muted)] mt-1">Clean Code</div>
                    </div>
                    <div>
                        <div className="text-2xl lg:text-3xl font-black text-[var(--text-color)]">Fast</div>
                        <div className="text-xs font-semibold text-[var(--text-muted)] mt-1">Real-Time Delivery</div>
                    </div>
                    <div>
                        <div className="text-2xl lg:text-3xl font-black text-[var(--text-color)]">Direct</div>
                        <div className="text-xs font-semibold text-[var(--text-muted)] mt-1">Project Support</div>
                    </div>
                </div>
            </motion.div>

            {/* Right Card Column - Gaming Joystick & Controller Deck */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.2 }}
                className="hero-visual flex-1 flex justify-center lg:justify-end w-full max-w-[550px] relative select-none"
            >
                <ControllerCard />
            </motion.div>
        </section>
    );
};

// Streamlined Interactive Gaming Joystick & Controller Card
const ControllerCard = () => {
    const [activeMode, setActiveMode] = React.useState(0);
    const [isInspectingLogo, setIsInspectingLogo] = React.useState(false);

    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsInspectingLogo(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // 3 Clear & Straightforward Pillars
    const modes = [
        {
            title: "College Projects",
            standard: "100% Viva Ready",
            packageName: "Academic Suite",
            glow: "rgba(6, 182, 212, 0.2)"
        },
        {
            title: "Business Apps",
            standard: "Production Live",
            packageName: "Startup MVP",
            glow: "rgba(139, 92, 246, 0.2)"
        },
        {
            title: "Custom Web",
            standard: "Clean Architecture",
            packageName: "Custom Build",
            glow: "rgba(244, 63, 94, 0.2)"
        }
    ];

    const current = modes[activeMode];

    return (
        <div className="w-full relative flex flex-col items-center">
            {/* Minimal Controller Bumpers (L1 & R1) */}
            <div className="w-[86%] flex items-center justify-between px-3 -mb-2 z-20">
                <button
                    type="button"
                    onClick={() => setActiveMode((prev) => (prev === 0 ? modes.length - 1 : prev - 1))}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] border border-[var(--glass-border)] hover:border-cyan-400/50 rounded-t-xl text-[10px] font-bold text-[var(--text-muted)] hover:text-cyan-500 transition-all duration-200 shadow-md active:scale-95 cursor-pointer backdrop-blur-md"
                    title="Previous mode"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                    <span>L1</span>
                </button>

                {/* Central Status Pill */}
                <div className="flex items-center gap-1.5 px-3 py-0.5 bg-[var(--glass-bg)] rounded-full border border-[var(--glass-border)] text-[10px] text-[var(--text-muted)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                    <span className="text-emerald-500 dark:text-emerald-400 font-semibold">P1 ONLINE</span>
                </div>

                <button
                    type="button"
                    onClick={() => setActiveMode((prev) => (prev === modes.length - 1 ? 0 : prev + 1))}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] border border-[var(--glass-border)] hover:border-purple-400/50 rounded-t-xl text-[10px] font-bold text-[var(--text-muted)] hover:text-purple-500 transition-all duration-200 shadow-md active:scale-95 cursor-pointer backdrop-blur-md"
                    title="Next mode"
                >
                    <span>R1</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                </button>
            </div>

            {/* Clean Controller Chassis */}
            <div
                className="w-full obsidian-card p-6 md:p-8 rounded-[2.2rem] space-y-5 relative z-10 overflow-hidden transition-all duration-300"
                style={{
                    boxShadow: `0 20px 50px -10px ${current.glow}, inset 0 1px 0 var(--card-inset)`
                }}
            >
                {/* Clean Center Stage View When Logo is Clicked */}
                <AnimatePresence>
                    {isInspectingLogo && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            transition={{ type: "spring", stiffness: 350, damping: 26 }}
                            className="absolute inset-0 bg-[var(--card-bg-solid)]/98 backdrop-blur-2xl rounded-[2.2rem] z-30 flex flex-col items-center justify-center p-6 border border-cyan-400/40 text-center space-y-4"
                        >
                            <button
                                type="button"
                                onClick={() => setIsInspectingLogo(false)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors cursor-pointer"
                                title="Close"
                            >
                                <X size={16} />
                            </button>

                            {/* Centered Joystick Hub */}
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/30"
                                />
                                <div className="w-20 h-20 rounded-full bg-[var(--well-bg)] border border-cyan-400/60 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                                    <motion.div
                                        drag
                                        dragConstraints={{ left: -12, right: 12, top: -12, bottom: -12 }}
                                        dragElastic={0.2}
                                        whileHover={{ scale: 1.05 }}
                                        className="w-14 h-14 rounded-full bg-[var(--glass-bg)] border border-cyan-400 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-md"
                                    >
                                        <img src="/logo.png" alt="Code Arcade Logo" className="w-8 h-8 object-contain pointer-events-none drop-shadow" />
                                    </motion.div>
                                </div>
                            </div>

                            <div className="space-y-1.5 max-w-xs">
                                <h4 className="text-xl font-bold text-[var(--text-color)] tracking-tight">Code Arcade</h4>
                                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                    Building reliable, clean web solutions for learning and business.
                                </p>
                            </div>

                            <div className="pt-2 flex items-center gap-3">
                                <a
                                    href="#contact"
                                    onClick={() => setIsInspectingLogo(false)}
                                    className="px-5 py-2 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white font-bold text-xs rounded-full shadow-lg hover:scale-105 transition-all"
                                >
                                    Get In Touch ➔
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setIsInspectingLogo(false)}
                                    className="px-4 py-2 bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] text-[var(--text-muted)] hover:text-[var(--text-color)] rounded-full text-xs font-semibold transition-colors cursor-pointer border border-[var(--glass-border)]"
                                >
                                    Close [ESC]
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Card Header: Brand Info + Verified Pill */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                        {/* Interactive Analog Joystick Grip for Logo */}
                        <div
                            className="relative group cursor-pointer"
                            onClick={() => setIsInspectingLogo(true)}
                            title="Click to view center"
                        >
                            <div className="w-13 h-13 rounded-full obsidian-well group-hover:border-cyan-400/60 p-1 flex items-center justify-center transition-colors">
                                <motion.div
                                    drag
                                    dragConstraints={{ left: -8, right: 8, top: -8, bottom: -8 }}
                                    dragElastic={0.15}
                                    whileHover={{ scale: 1.08 }}
                                    className="w-10 h-10 rounded-full bg-[var(--glass-bg)] border border-cyan-400/40 flex items-center justify-center p-1.5 shadow-md cursor-grab active:cursor-grabbing"
                                >
                                    <img src="/logo.png" alt="Code Arcade Logo" className="w-6 h-6 object-contain pointer-events-none drop-shadow" />
                                </motion.div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-[var(--text-color)] tracking-tight">Ideas become reality</h3>
                            <p className="text-xs text-[var(--text-muted)] font-medium">Tamil Nadu, India</p>
                        </div>
                    </div>

                    <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 text-cyan-600 dark:text-cyan-400 text-xs font-black rounded-full uppercase tracking-wider">
                        Verified ✓
                    </span>
                </div>

                {/* Clean 2-Column Metrics */}
                <div className="grid grid-cols-2 gap-3.5 p-4 obsidian-well rounded-2xl">
                    <div>
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                            Solution Focus
                        </span>
                        <span className="text-base font-black text-[var(--text-color)]">
                            {current.title}
                        </span>
                    </div>

                    <div>
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                            Quality Standard
                        </span>
                        <span className="text-xs sm:text-sm font-black text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 mt-0.5">
                            <CheckCircle2 size={15} /> {current.standard}
                        </span>
                    </div>
                </div>

                {/* Straightforward Action Deck */}
                <div className="bg-gradient-to-r from-[#170e2b] to-[#0c1a2c] p-4 sm:p-5 rounded-2xl border border-purple-500/30 flex items-center justify-between shadow-lg">
                    <div>
                        <span className="text-[11px] font-semibold text-cyan-300 block mb-0.5">
                            Direct Solution
                        </span>
                        <div className="text-xl font-black text-white tracking-tight">
                            {current.packageName}
                        </div>
                    </div>

                    <a
                        href="#contact"
                        className="px-5 py-2.5 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white font-bold text-xs rounded-full transition-all duration-300 flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 group/btn"
                    >
                        <span>Get Code</span>
                        <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                </div>

                {/* Clean Trust Note */}
                <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)] font-medium pt-1">
                    <ShieldCheck size={15} className="text-cyan-500 dark:text-cyan-400" />
                    <span>100% Reliable & Scalable Architecture</span>
                </div>
            </div>
        </div>
    );
};

export default Hero;
