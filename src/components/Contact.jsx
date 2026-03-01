import { useState } from 'react';
import { Mail, GraduationCap, Send, MapPin, Phone, Loader2, CheckCircle2, UserCheck, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState({ type: null, message: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: null, message: '' });

        try {
            await addDoc(collection(db, 'messages'), {
                ...formData,
                timestamp: serverTimestamp()
            });
            setStatus({ type: 'success', message: 'Message sent successfully!' });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error("Error adding document: ", error);
            setStatus({ type: 'error', message: 'Error sending message. Please try again.' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus({ type: null, message: '' }), 5000);
        }
    };

    const contactInfo = [
        { icon: <Mail size={24} />, title: 'Email', value: 'codearcade20@gmail.com', href: 'mailto:codearcade20@gmail.com' },
        { icon: <UserCheck size={24} />, title: 'Founder', value: 'View Profile', href: 'https://sakthi21a34.github.io/portfolio2/' },
        { icon: <Users size={24} />, title: 'Community', value: 'Join WhatsApp', href: 'https://chat.whatsapp.com/CI3Hu0XkLl8BCtGA9LHamN' },
    ];

    return (
        <section id="contact" className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto overflow-hidden">
            <div className="section-header text-center mb-16 relative">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-[var(--text-color)]"
                >
                    Let's Connect
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-[var(--text-muted)] text-lg max-w-[600px] mx-auto"
                >
                    Ready to bring your project to life? Let's discuss how we can help you succeed.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="contact-info space-y-8"
                >
                    {contactInfo.map((info, idx) => (
                        <div key={idx} className="flex items-center gap-6 p-8 bg-[var(--glass-bg)] rounded-3xl border border-[var(--glass-border)] hover:border-[var(--secondary-color)] transition-all duration-300">
                            <div className="w-16 h-16 bg-[var(--secondary-color)]/10 rounded-2xl flex items-center justify-center text-[var(--secondary-color)]">
                                {info.icon}
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-1 text-[var(--text-color)]">{info.title}</h4>
                                <a href={info.href} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--secondary-color)] transition-colors">
                                    {info.value}
                                </a>
                            </div>
                        </div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-[var(--glass-bg)] p-8 md:p-12 rounded-[2.5rem] border border-[var(--glass-border)] relative overflow-hidden"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold pl-1 text-[var(--text-color)]">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-[var(--text-color)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary-color)] transition-colors"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold pl-1 text-[var(--text-color)]">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-[var(--text-color)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary-color)] transition-colors"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold pl-1 text-[var(--text-color)]">Subject</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-[var(--text-color)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary-color)] transition-colors"
                                placeholder="What's this about?"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold pl-1 text-[var(--text-color)]">Message</label>
                            <textarea
                                required
                                rows="4"
                                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-[var(--text-color)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary-color)] transition-colors resize-none"
                                placeholder="Your Message..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 shadow-xl shadow-[var(--primary-color)]/20"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                            {isLoading ? 'Sending...' : 'Send Message'}
                        </button>

                        <AnimatePresence>
                            {status.message && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`p-4 rounded-xl text-center font-medium ${status.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                                >
                                    {status.message}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
