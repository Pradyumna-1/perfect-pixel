import { useState, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
    Menu,
    X,
    Camera,
    Monitor,
    Phone,
    Home,
    Bell,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Brand from './Brand';

interface NavItem {
    name: string;
    path: string;
    section?: string;
    icon: ReactNode;
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks: NavItem[] = [
        { name: 'Home', path: '/', section: 'home', icon: <Home size={18} /> },
        { name: 'Services', path: '/services', section: 'services', icon: <Monitor size={18} /> },
        { name: 'Gallery', path: '/gallery', section: 'gallery', icon: <Camera size={18} /> },
        { name: 'Notifications', path: '/notifications', icon: <Bell size={18} /> },
        { name: 'Contact', path: '/contact', section: 'contact', icon: <Phone size={18} /> },
    ];

    const handleNavClick = (section?: string) => {
        setIsOpen(false);

        if (!section) return;

        setTimeout(() => {
            if (section === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            document.getElementById(section)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }, 100);
    };

    const desktopClass = ({ isActive }: { isActive: boolean }) =>
        `relative flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all duration-300 ${isActive
            ? 'text-accent bg-white/5'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`;

    const mobileClass = ({ isActive }: { isActive: boolean }) =>
        `group relative flex w-full items-center overflow-hidden px-4 py-2.5 text-left text-[15px] font-semibold transition-colors duration-300 ${isActive
            ? 'text-accent'
            : 'text-[color:var(--color-ink)] hover:text-accent'
        }`;

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link
                        to="/"
                        onClick={() => handleNavClick('home')}
                        className="flex-shrink-0 flex items-center gap-2 group"
                    >
                        <Brand />
                    </Link>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-2">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    end={link.path !== '/notifications'}
                                    onClick={() => handleNavClick(link.section)}
                                    className={desktopClass}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {link.icon}
                                        {link.name}
                                    </span>
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            type="button"
                            onClick={() => setIsOpen((prev) => !prev)}
                            className="inline-flex items-center justify-center rounded-xl border border-[var(--color-rule)] bg-[var(--color-light)] p-2.5 text-[color:var(--color-ink)] transition-all duration-300 hover:bg-[var(--color-paper-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isOpen}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {isOpen ? (
                                    <motion.span
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X size={24} />
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu size={24} />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                        className="md:hidden overflow-hidden rounded-b-2xl border-b border-[var(--color-rule)] bg-[var(--color-light)] shadow-[0_28px_50px_-30px_rgba(15,23,42,0.35)]"
                    >
                        <div className="px-4 pb-3 pt-1 sm:px-6 lg:px-8">
                            <p className="px-4 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-muted)]">
                                Explore
                            </p>
                            <div className="space-y-0.5">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.045, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <NavLink
                                            to={link.path}
                                            end={link.path !== '/notifications'}
                                            onClick={() => handleNavClick(link.section)}
                                            className={mobileClass}
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    {isActive && (
                                                        <span className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-r-full bg-accent" aria-hidden="true" />
                                                    )}
                                                    <span className="relative z-10">{link.name}</span>
                                                </>
                                            )}
                                        </NavLink>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
