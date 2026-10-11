import { Briefcase, GraduationCap, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const Features = () => {
    const features = [
        {
            icon: <Briefcase className="text-[var(--secondary-color)]" size={24} />,
            title: "Real-Time Business Apps",
            desc: "Custom-built, scalable web solutions designed to automate and grow your small business or startup."
        },
        {
            icon: <GraduationCap className="text-[var(--secondary-color)]" size={24} />,
            title: "Academic Excellence",
            desc: "Meticulously documented and structured projects perfect for demonstrations, learning, and academic results."
        },
        {
            icon: <Code className="text-[var(--secondary-color)]" size={24} />,
            title: "Custom Development",
            desc: "Precision-engineered features using the latest tech stacks, tailored exactly to your unique requirements."
        }
    ];

    return (
        <section id="features" className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto overflow-hidden">
            <div className="section-header text-center mb-16 relative">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-[var(--text-color)]"
                >
                    What We Do
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-[var(--text-muted)] text-lg max-w-[600px] mx-auto"
                >
                    Delivering high-performance web solutions for every scale, from student milestones to business success.
                </motion.p>
            </div>

            <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.6 }}
                        className="obsidian-card p-8 md:p-10 rounded-2xl relative overflow-hidden group flex flex-col justify-between"
                    >
                        {/* Razor 1px Top Highlight Accent */}
                        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-cyan-400/60 transition-colors duration-300" />

                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <div className="obsidian-icon-box w-14 h-14 rounded-xl flex items-center justify-center text-[var(--secondary-color)] group-hover:border-cyan-400/40 group-hover:scale-105 transition-all duration-300">
                                    {feature.icon}
                                </div>
                                <span className="text-xs font-semibold text-[var(--text-muted)] tracking-wider">
                                    0{idx + 1} //
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold mb-3 tracking-tight text-[var(--text-color)] group-hover:text-cyan-300 transition-colors duration-200">
                                {feature.title}
                            </h3>
                            <p className="text-[var(--text-muted)] text-base leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>

                        {/* Subtle bottom bevel line */}
                        <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs font-medium text-[var(--text-muted)]">
                            <span className="uppercase tracking-wider">Precision Architecture</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 group-hover:bg-cyan-400 group-hover:shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all"></span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Features;
