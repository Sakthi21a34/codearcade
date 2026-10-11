import { useState, useEffect } from 'react';
import { Moon, Sun, Youtube, Menu, X, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const Navbar = ({ onOpenAdmin }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        if (theme === 'light') {
            document.body.setAttribute('data-theme', 'light');
        } else {
            document.body.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#features' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <header className="fixed top-0 w-full z-[1000] bg-[#07080e]/95 border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] py-4 px-8 md:px-12">
            <nav className="max-w-[1400px] mx-auto flex justify-between items-center">
                <div className="logo text-2xl font-extrabold flex items-center gap-3 cursor-pointer" onClick={() => window.location.pathname !== '/' && (window.location.href = '/')}>
                    <img src="/logo.png" alt="Code Arcade Logo" className="w-10 h-10 rounded-xl object-contain shadow-lg hover:scale-105 transition-transform" />
                    <span>Code <span className="highlight bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] bg-clip-text text-transparent">Arcade</span></span>
                </div>

                {/* Desktop Links */}
                <ul className="hidden md:flex items-center gap-8 list-none">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <a href={link.href} className="text-[var(--text-muted)] hover:text-[var(--text-color)] text-sm font-medium uppercase tracking-wider transition-colors duration-300">
                                {link.name}
                            </a>
                        </li>
                    ))}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleTheme}
                        className="w-10 h-10 rounded-xl border border-white/[0.08] bg-[#0b0e1a] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center justify-center hover:border-cyan-400/50 text-[var(--text-color)] transition-all duration-300"
                    >
                        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                    </motion.button>
                    <li>
                        <a
                            href="https://www.youtube.com/@CodeArcade-se4rc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-600/20 hover:shadow-red-600/40 hover:scale-105 transition-transform duration-300 text-sm"
                        >
                            <Youtube size={16} /> Subscribe
                        </a>
                    </li>
                </ul>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <button onClick={toggleTheme} className="text-[var(--text-color)]">
                        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[var(--text-color)]">
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scaleY: 0.95 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: -20, scaleY: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="md:hidden absolute top-full left-0 w-full bg-[#07080e] border-b border-white/[0.08] py-6 px-8 shadow-2xl"
                    >
                        <ul className="flex flex-col gap-6 list-none">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-[var(--text-muted)] text-lg uppercase tracking-wider block"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <a href="https://www.youtube.com/@CodeArcade-se4rc" className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                                    <Youtube size={20} /> Subscribe
                                </a>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
