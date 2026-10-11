import { useState, useEffect } from 'react';
import { 
    Lock, User, LogOut, RefreshCw, Trash2, Mail, Calendar, 
    MessageSquare, ShieldCheck, Search, ArrowLeft, KeyRound, 
    AlertCircle, Inbox, Tag, Clock, Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const AdminPanel = ({ onBackToHome }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return sessionStorage.getItem('codearcade_admin_logged_in') === 'true';
    });
    
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [notification, setNotification] = useState(null);

    // Default Credentials
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123';

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setLoginError('');

        setTimeout(() => {
            if (credentials.username.trim() === ADMIN_USERNAME && credentials.password === ADMIN_PASSWORD) {
                setIsLoggedIn(true);
                sessionStorage.setItem('codearcade_admin_logged_in', 'true');
                fetchMessages();
            } else {
                setLoginError('Invalid Username or Password. Hint: admin / admin123');
            }
            setIsLoggingIn(false);
        }, 500);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        sessionStorage.removeItem('codearcade_admin_logged_in');
        setCredentials({ username: '', password: '' });
    };

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            const fetchedMessages = querySnapshot.docs.map(docSnap => {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    ...data,
                    formattedDate: data.timestamp 
                        ? (data.timestamp.toDate ? data.timestamp.toDate().toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          }) : new Date(data.timestamp).toLocaleString())
                        : 'Just now'
                };
            });
            setMessages(fetchedMessages);
        } catch (error) {
            console.error("Error fetching messages:", error);
            showNotification('Failed to load messages from database.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMessage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        setDeletingId(id);
        try {
            await deleteDoc(doc(db, 'messages', id));
            setMessages(prev => prev.filter(msg => msg.id !== id));
            showNotification('Message deleted successfully.', 'success');
        } catch (error) {
            console.error("Error deleting message:", error);
            showNotification('Failed to delete message.', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const showNotification = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 4000);
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchMessages();
        }
    }, [isLoggedIn]);

    const filteredMessages = messages.filter(msg => 
        (msg.name && msg.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (msg.email && msg.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (msg.subject && msg.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (msg.message && msg.message.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] py-12 px-4 md:px-12 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-[var(--primary-color)]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-[var(--secondary-color)]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-[1200px] mx-auto relative z-10">
                {/* Header Navigation */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[var(--glass-border)]">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={onBackToHome}
                            className="p-3 bg-[var(--glass-bg)] hover:bg-[var(--primary-color)]/20 border border-[var(--glass-border)] rounded-2xl transition-all text-[var(--text-color)] flex items-center gap-2 font-bold text-sm"
                        >
                            <ArrowLeft size={18} />
                            <span>Back to Site</span>
                        </button>
                        <div className="h-6 w-[1px] bg-[var(--glass-border)] hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="text-[var(--primary-color)]" size={24} />
                            <h1 className="text-2xl font-black tracking-tight">
                                Code <span className="text-[var(--primary-color)]">Arcade</span> Admin
                            </h1>
                        </div>
                    </div>

                    {isLoggedIn && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchMessages}
                                disabled={isLoading}
                                title="Refresh messages"
                                className="p-3 bg-[var(--glass-bg)] hover:bg-[var(--secondary-color)]/20 border border-[var(--glass-border)] rounded-2xl transition-all text-[var(--text-color)] flex items-center gap-2 font-semibold text-sm"
                            >
                                <RefreshCw size={18} className={isLoading ? "animate-spin text-[var(--secondary-color)]" : ""} />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-2xl transition-all text-red-400 flex items-center gap-2 font-bold text-sm"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <AnimatePresence>
                    {notification && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`mb-6 p-4 rounded-2xl border font-medium flex items-center gap-3 ${
                                notification.type === 'error' 
                                    ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                                    : 'bg-green-500/10 border-green-500/30 text-green-400'
                            }`}
                        >
                            <AlertCircle size={20} />
                            <span>{notification.msg}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isLoggedIn ? (
                    /* LOGIN FORM */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto my-12"
                    >
                        <div className="bg-[var(--glass-bg)] p-8 md:p-10 rounded-[2.5rem] border border-[var(--glass-border)] shadow-2xl backdrop-blur-xl relative overflow-hidden">
                            <div className="w-16 h-16 bg-[var(--primary-color)]/10 rounded-2xl flex items-center justify-center text-[var(--primary-color)] mx-auto mb-6">
                                <Lock size={32} />
                            </div>

                            <h2 className="text-3xl font-extrabold text-center mb-2">Admin Portal</h2>
                            <p className="text-[var(--text-muted)] text-center text-sm mb-8">
                                Enter your credentials to view user contact submissions.
                            </p>

                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[var(--text-color)] flex items-center gap-2 pl-1">
                                        <User size={16} className="text-[var(--secondary-color)]" /> Username
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter admin username"
                                        value={credentials.username}
                                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-[var(--text-color)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary-color)] transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[var(--text-color)] flex items-center gap-2 pl-1">
                                        <KeyRound size={16} className="text-[var(--secondary-color)]" /> Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Enter password"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-[var(--text-color)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary-color)] transition-colors"
                                    />
                                </div>

                                {loginError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold flex items-center gap-2"
                                    >
                                        <AlertCircle size={16} className="shrink-0" />
                                        <span>{loginError}</span>
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoggingIn}
                                    className="w-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-[var(--primary-color)]/20 disabled:opacity-50"
                                >
                                    {isLoggingIn ? <RefreshCw className="animate-spin" size={20} /> : <Lock size={20} />}
                                    <span>{isLoggingIn ? 'Authenticating...' : 'Sign In'}</span>
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-[var(--glass-border)] text-center">
                                <span className="text-xs text-[var(--text-muted)]">
                                    Default login: <code className="bg-[var(--glass-bg)] px-2 py-1 rounded text-[var(--primary-color)]">admin</code> / <code className="bg-[var(--glass-bg)] px-2 py-1 rounded text-[var(--primary-color)]">admin123</code>
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* MESSAGES DASHBOARD */
                    <div className="space-y-8">
                        {/* Summary Bar & Search */}
                        <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--glass-bg)] p-6 rounded-3xl border border-[var(--glass-border)]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[var(--primary-color)]/10 rounded-2xl flex items-center justify-center text-[var(--primary-color)]">
                                    <Inbox size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Contact Messages</h2>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        Total received: <span className="font-bold text-[var(--primary-color)]">{messages.length}</span> message(s)
                                    </p>
                                </div>
                            </div>

                            {/* Search Input */}
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, subject..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[var(--bg-color)] border border-[var(--glass-border)] rounded-2xl pl-11 pr-4 py-3 text-sm text-[var(--text-color)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--secondary-color)] transition-colors"
                                />
                            </div>
                        </div>

                        {/* Messages List */}
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <RefreshCw className="animate-spin text-[var(--primary-color)]" size={36} />
                                <p className="text-[var(--text-muted)] font-medium">Fetching contact entries...</p>
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="text-center py-20 bg-[var(--glass-bg)] rounded-3xl border border-[var(--glass-border)] space-y-4">
                                <MessageSquare size={48} className="mx-auto text-[var(--text-muted)] opacity-50" />
                                <h3 className="text-xl font-bold">No Messages Found</h3>
                                <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto">
                                    {searchQuery ? "No form submissions match your search criteria." : "No contacts have submitted the form yet."}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredMessages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-[var(--glass-bg)] p-6 md:p-8 rounded-3xl border border-[var(--glass-border)] hover:border-[var(--primary-color)]/50 transition-all flex flex-col justify-between gap-6 relative group shadow-lg"
                                    >
                                        <div className="space-y-4">
                                            {/* Card Top: Sender & Date */}
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                                                        {msg.name ? msg.name.charAt(0).toUpperCase() : '?'}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-[var(--text-color)]">{msg.name || 'Anonymous'}</h3>
                                                        {msg.email && (
                                                            <a 
                                                                href={`mailto:${msg.email}`} 
                                                                className="text-xs text-[var(--secondary-color)] hover:underline flex items-center gap-1 mt-0.5"
                                                            >
                                                                <Mail size={12} />
                                                                <span>{msg.email}</span>
                                                            </a>
                                                        )}
                                                        {msg.phone && (
                                                            <a 
                                                                href={`tel:${msg.phone}`} 
                                                                className="text-xs text-[var(--primary-color)] hover:underline flex items-center gap-1 mt-0.5"
                                                            >
                                                                <Phone size={12} />
                                                                <span>{msg.phone}</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleDeleteMessage(msg.id)}
                                                    disabled={deletingId === msg.id}
                                                    title="Delete message"
                                                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all opacity-80 group-hover:opacity-100 disabled:opacity-30 shrink-0"
                                                >
                                                    <Trash2 size={16} className={deletingId === msg.id ? "animate-spin" : ""} />
                                                </button>
                                            </div>

                                            {/* Subject Tag */}
                                            {msg.subject && (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 rounded-lg text-xs font-semibold text-[var(--primary-color)]">
                                                    <Tag size={12} />
                                                    <span>{msg.subject}</span>
                                                </div>
                                            )}

                                            {/* Message Content */}
                                            <div className="p-4 bg-[var(--bg-color)]/60 rounded-2xl border border-[var(--glass-border)] text-sm text-[var(--text-color)] opacity-90 leading-relaxed whitespace-pre-wrap">
                                                {msg.message}
                                            </div>
                                        </div>

                                        {/* Card Footer: Timestamp */}
                                        <div className="flex items-center justify-end gap-2 text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--glass-border)]">
                                            <Clock size={12} />
                                            <span>Received: {msg.formattedDate}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
