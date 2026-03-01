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
                        className="feature-card bg-[var(--glass-bg)] p-12 rounded-3xl border border-[var(--glass-border)] hover:border-[var(--primary-color)] transition-all duration-500 hover:-translate-y-2 group shadow-lg hover:shadow-[var(--primary-color)]/20 relative overflow-hidden"
                    >
                        <div className="icon-box w-16 h-16 bg-[var(--secondary-color)]/20 rounded-2xl flex items-center justify-center mb-8 border border-[var(--glass-border)] group-hover:scale-110 transition-transform duration-500 shadow-lg">
                            {feature.icon}
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-[var(--text-color)]">{feature.title}</h3>
                        <p className="text-[var(--text-muted)] text-lg leading-relaxed group-hover:text-[var(--text-color)] transition-colors duration-300">
                            {feature.desc}
                        </p>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--primary-color)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Features;
