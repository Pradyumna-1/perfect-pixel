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
        `relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all duration-300 ${isActive
            ? 'text-accent bg-white/5'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
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
                        <div className="w-8 h-8 rounded-lg border border-[#e11d48]/20 bg-[#1c2028] flex items-center justify-center text-[#e11d48] text-lg font-extrabold transition-transform duration-300 group-hover:scale-110">
                            P
                        </div>
                        <span className="font-bold text-xl tracking-wider">
                            <span className="text-[#e11d48]">P</span><span className="text-[#20242b]">ERFECT</span><span className="text-[#e11d48]">P</span><span className="text-[#2f7fd1]">IXEL</span>
                        </span>
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
                            className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 focus:outline-none"
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
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="md:hidden bg-[#0f172a] border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-3 pt-3 pb-4 space-y-2">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.25 }}
                                >
                                    <NavLink
                                        to={link.path}
                                        end={link.path !== '/notifications'}
                                        onClick={() => handleNavClick(link.section)}
                                        className={mobileClass}
                                    >
                                        {link.icon}
                                        <span>{link.name}</span>
                                    </NavLink>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
