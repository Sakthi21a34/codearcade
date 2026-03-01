import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Contact from './components/Contact';
import PromoPopup from './components/PromoPopup';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Code, Globe, Cpu, Database, Layers, Layout, Zap, Smartphone, Terminal } from 'lucide-react';

function App() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="min-h-screen relative">
            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-[var(--primary-color)] origin-left z-[2000]"
                style={{ scaleX }}
            />

            <Navbar />

            <main>
                <Hero />

                {/* About / Features Section */}
                <Features />

                {/* Tech Stack (Inline for simplicity or component) */}
                <section id="technologies" className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto text-center overflow-hidden">
                    <div className="section-header mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-[var(--text-color)]">Our Tech Stack</h2>
                        <p className="text-[var(--text-muted)] text-lg max-w-[600px] mx-auto">We leverage industry-leading technologies to build fast, secure, and maintainable applications.</p>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {[
                            { name: 'HTML5', icon: <Layout size={18} /> },
                            { name: 'CSS3', icon: <Zap size={18} /> },
                            { name: 'JavaScript', icon: <Terminal size={18} /> },
                            { name: 'React', icon: <Cpu size={18} /> },
                            { name: 'Firebase', icon: <Database size={18} /> },
                            { name: 'Kotlin', icon: <Smartphone size={18} /> },
                            { name: 'Python', icon: <Code size={18} /> }
                        ].map((tech, i) => (
                            <motion.span
                                key={tech.name}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="tech-badge px-6 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full text-[var(--text-color)] font-extrabold hover:border-[var(--secondary-color)] hover:bg-[var(--secondary-color)]/10 hover:-translate-y-1 transition-all cursor-default flex items-center gap-3 shadow-sm"
                            >
                                <span className="text-[var(--secondary-color)]">{tech.icon}</span>
                                {tech.name}
                            </motion.span>
                        ))}
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto overflow-hidden">
                    <div className="section-header text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-[var(--text-color)]">Why Choose Us</h2>
                        <p className="text-[var(--text-muted)] text-lg">Quality, reliability, and precision are the foundations of every line of code we write.</p>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {[
                            { text: "Clean and maintainable code", icon: <Code className="text-[var(--primary-color)]" size={20} /> },
                            { text: "Real-world practical solutions", icon: <Database className="text-[var(--primary-color)]" size={20} /> },
                            { text: "Transparent development process", icon: <Cpu className="text-[var(--primary-color)]" size={20} /> },
                            { text: "Reliable delivery timelines", icon: <Globe className="text-[var(--primary-color)]" size={20} /> },
                            { text: "Scalable architecture", icon: <Layers className="text-[var(--primary-color)]" size={20} /> }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-6 p-6 bg-[var(--glass-bg)] rounded-3xl border border-[var(--glass-border)] hover:border-[var(--primary-color)] transition-all group"
                            >
                                <div className="w-12 h-12 bg-[var(--primary-color)]/10 rounded-2xl flex items-center justify-center group-hover:bg-[var(--primary-color)]/20 transition-colors">
                                    {item.icon}
                                </div>
                                <span className="text-lg font-bold text-[var(--text-color)] opacity-90 group-hover:opacity-100 transition-opacity">{item.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <Contact />
            </main>

            <footer className="py-16 border-t border-[var(--glass-border)] bg-[var(--bg-color)]">
                <div className="max-w-[1200px] mx-auto px-6 text-center space-y-8">
                    <div className="text-2xl font-black">
                        Code <span className="text-[var(--primary-color)]">Arcade</span>
                    </div>
                    <p className="text-[var(--text-muted)]">© 2025 Code Arcade. All rights reserved.</p>
                    <div className="flex justify-center gap-8">
                        <a href="https://t.me/+H2ay8bImBqcxMGJl" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[#0088cc] hover:scale-125 transition-all" title="Telegram"><i className="fa-brands fa-telegram text-2xl"></i></a>
                        <a href="https://www.instagram.com/code_arcade20?igsh=MWJ0Z3ZuNjZ3aHg5bA==" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[#E4405F] hover:scale-125 transition-all" title="Instagram"><i className="fa-brands fa-instagram text-2xl"></i></a>
                        <a href="https://github.com/Code-Arcade" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--primary-color)] hover:scale-125 transition-all" title="GitHub"><i className="fa-brands fa-github text-2xl"></i></a>
                        <a href="https://www.youtube.com/@CodeArcade-se4rc" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[#FF0000] hover:scale-125 transition-all" title="YouTube"><i className="fa-brands fa-youtube text-2xl"></i></a>
                        <a href="https://chat.whatsapp.com/CI3Hu0XkLl8BCtGA9LHamN" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[#25D366] hover:scale-125 transition-all" title="WhatsApp"><i className="fa-brands fa-whatsapp text-2xl"></i></a>
                    </div>
                </div>
            </footer>

            <PromoPopup />
        </div>
    )
}

export default App
