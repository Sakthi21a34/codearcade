import { Youtube, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTypedText } from '../hooks/useTypedText';

const Hero = () => {
    const typingWords = ["Premium Web Solutions", "College Major Projects", "Business Automation", "Modern UI/UX Designs"];
    const typedText = useTypedText(typingWords);

    return (
        <section id="home" className="min-h-screen flex flex-col md:flex-row items-center justify-center pt-32 pb-16 px-6 md:px-12 max-w-[1400px] mx-auto gap-12 relative overflow-hidden">
            {/* Background Orbs directly inside Hero or Global */}
            <div className="absolute inset-0 z-[-1] pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--primary-color)] blur-[120px] opacity-[var(--orb-opacity)] animate-orb-move"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--secondary-color)] blur-[120px] opacity-[var(--orb-opacity)] animate-orb-move delay-[-5s]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, cubicBezier: [0.4, 0, 0.2, 1] }}
                className="hero-content flex-1 max-w-[700px] text-center md:text-left z-10"
            >
                <div className="badge inline-block px-4 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full text-[var(--secondary-color)] text-xs font-semibold mb-6 uppercase tracking-widest">
                    Innovation & Development
                </div>
                <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight text-[var(--text-color)] glitch" data-text="Building reliable web solutions">
                    Building reliable web solutions for <span className="text-[var(--primary-color)]">learning and business.</span>
                </h1>

                <div className="mb-8 h-8 text-xl md:text-2xl font-medium text-[var(--text-color)]">
                    <span className="text-[var(--secondary-color)] border-r-2 border-[var(--secondary-color)] pr-2 animate-pulse">{typedText}</span>
                </div>

                <p className="tagline text-lg text-[var(--text-color)] mb-10 max-w-[600px] mx-auto md:mx-0">
                    Codearcade is a professional development initiative delivering clean, scalable, and
                    practical web applications that drive real-world results.
                </p>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <a href="https://www.youtube.com/@CodeArcade-se4rc" target="_blank" rel="noopener noreferrer" className="btn-primary bg-gradient-to-r from-[var(--primary-color)] to-[#9d4eff] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-[0_0_30px_rgba(112,0,255,0.3)] hover:scale-105 transition-all duration-300">
                        <Youtube size={20} /> Visit Channel
                    </a>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hero-visual flex-1 flex justify-center relative w-full max-w-[500px]"
            >
                <div className="code-window bg-[#1e1e2e] rounded-2xl overflow-hidden border border-white/10 shadow-2xl skew-y-3 hover:skew-y-0 transition-all duration-500 group">
                    <div className="window-header bg-[#282838] p-4 flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="window-body p-8 font-mono text-sm leading-relaxed text-[#a9b7c6]">
                        <pre>
                            <code dangerouslySetInnerHTML={{
                                __html: `<span style="color: #ff79c6;">const</span> coder = {
    <span style="color: #8be9fd;">name</span>: <span style="color: #f1fa8c;">"You"</span>,
    <span style="color: #8be9fd;">skills</span>: [<span style="color: #f1fa8c;">"HTML"</span>, <span style="color: #f1fa8c;">"CSS"</span>, <span style="color: #f1fa8c;">"JS"</span>],
    <span style="color: #8be9fd;">mission</span>: <span style="color: #f1fa8c;">"Build Cool Stuff"</span>,
    <span style="color: #8be9fd;">level</span>: <span style="color: #f1fa8c;">"Infinite"</span>
};

<span style="color: #ff79c6;">function</span> startCoding() {
    <span style="color: #ff79c6;">return</span> <span style="color: #f1fa8c;">"Welcome!"</span>;
}` }} />
                        </pre>
                    </div>
                </div>
                <div className="absolute inset-0 bg-[var(--primary-color)] blur-[100px] opacity-20 z-[-1]"></div>
            </motion.div>
        </section>
    );
};

export default Hero;
