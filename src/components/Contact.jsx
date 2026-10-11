import { useState } from 'react';
import { Mail, GraduationCap, Send, MapPin, Phone, Loader2, CheckCircle2, UserCheck, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [status, setStatus] = useState({ type: null, message: '' });
    const [phoneError, setPhoneError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePhoneChange = (e) => {
        const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
        setFormData(prev => ({ ...prev, phone: cleaned }));
        if (phoneError) setPhoneError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        setIsLoading(true);
        setStatus({ type: null, message: '' });

        try {
            await addDoc(collection(db, 'messages'), {
                ...formData,
                timestamp: serverTimestamp()
            });
            setStatus({ type: 'success', message: 'Message sent successfully!' });
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
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
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
                    className="contact-info space-y-6"
                >
                    {contactInfo.map((info, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                            className="obsidian-card flex items-center gap-6 p-6 md:p-7 rounded-2xl relative overflow-hidden group"
                        >
                            {/* Razor 1px Top Highlight */}
                            <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:via-cyan-400/50 transition-colors" />

                            <div className="obsidian-icon-box w-14 h-14 rounded-xl flex items-center justify-center text-[var(--secondary-color)] shrink-0 group-hover:scale-105 group-hover:border-cyan-400/40 transition-all">
                                {info.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-bold mb-0.5 text-[var(--text-color)] group-hover:text-cyan-300 transition-colors">{info.title}</h4>
                                <a href={info.href} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] text-sm hover:text-[var(--secondary-color)] transition-colors truncate block">
                                    {info.value}
                                </a>
                            </div>
                            <span className="text-sm text-slate-500 group-hover:text-cyan-400 transition-colors">↗</span>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="obsidian-card p-8 md:p-12 rounded-3xl relative overflow-hidden"
                >
                    {/* Razor 1px Top Highlight */}
                    <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold pl-1 text-[var(--text-color)]">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full obsidian-well rounded-2xl p-4 text-[var(--text-color)] placeholder:text-[var(--text-muted)] focus:outline-none"
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
                                    className="w-full obsidian-well rounded-2xl p-4 text-[var(--text-color)] placeholder:text-[var(--text-muted)] focus:outline-none"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold pl-1 text-[var(--text-color)]">Mobile Number</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        required
                                        maxLength={10}
                                        className={`w-full obsidian-well rounded-2xl p-4 pr-16 text-[var(--text-color)] placeholder:text-[var(--text-muted)] focus:outline-none ${phoneError ? 'border-red-500/70' : ''}`}
                                        placeholder="10-digit Mobile No."
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--text-muted)]">
                                        {formData.phone ? `${formData.phone.length}/10` : ''}
                                    </span>
                                </div>
                                {phoneError && (
                                    <p className="text-xs text-red-400 font-medium pl-1">{phoneError}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold pl-1 text-[var(--text-color)]">Subject</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full obsidian-well rounded-2xl p-4 text-[var(--text-color)] placeholder:text-[var(--text-muted)] focus:outline-none"
                                    placeholder="What's this about?"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold pl-1 text-[var(--text-color)]">Message</label>
                            <textarea
                                required
                                rows="4"
                                className="w-full obsidian-well rounded-2xl p-4 text-[var(--text-color)] placeholder:text-[var(--text-muted)] focus:outline-none resize-none"
                                placeholder="Your Message..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:opacity-95 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/10 cursor-pointer"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                            {isLoading ? 'Sending...' : 'Send Message'}
                        </button>

                        <AnimatePresence>
                            {status.message && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                                    className={`p-4 rounded-xl text-center font-medium ${status.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}
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
