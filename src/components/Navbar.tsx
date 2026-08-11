import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Menu,
    X,
    Camera,
    Monitor,
    Phone,
    Home,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const navLinks = [
        {
            name: 'Home',
            path: '/',
            target: 'home',
            icon: <Home size={18} />,
        },
        {
            name: 'Services',
            path: '/services',
            target: 'services',
            icon: <Monitor size={18} />,
        },
        {
            name: 'Gallery',
            path: '/gallery',
            target: 'gallery',
            icon: <Camera size={18} />,
        },
        {
            name: 'Contact',
            path: '/contact',
            target: 'contact',
            icon: <Phone size={18} />,
        },
    ];

    // ---------------------------------------------
    // Navigation
    // ---------------------------------------------
    const handleNavigation = (
        path: string,
        target: string
    ) => {
        // Close mobile menu
        setIsOpen(false);

        // Change URL without using #
        navigate(path);

        // Wait for route/component update
        setTimeout(() => {
            // Home
            if (target === 'home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });

                return;
            }

            // Find section
            const element = document.getElementById(target);

            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        }, 100);
    };

    // ---------------------------------------------
    // Active navigation item
    // ---------------------------------------------
    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/10">

            {/* =========================================
                MAIN NAVBAR
               ========================================= */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center justify-between h-16">

                    {/* =====================================
                        LOGO
                       ===================================== */}

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation('/', 'home')
                        }
                        className="flex-shrink-0 flex items-center gap-2 group"
                    >
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold transition-transform duration-300 group-hover:scale-110">
                            P
                        </div>

                        <span className="text-white font-bold text-xl tracking-wider">
                            PERFECT
                            <span className="text-accent">
                                PIXEL
                            </span>
                        </span>
                    </button>


                    {/* =====================================
                        DESKTOP NAVIGATION
                       ===================================== */}

                    <div className="hidden md:block">

                        <div className="ml-10 flex items-center space-x-2">

                            {navLinks.map((link) => {

                                const active = isActive(
                                    link.path
                                );

                                return (
                                    <button
                                        type="button"
                                        key={link.name}
                                        onClick={() =>
                                            handleNavigation(
                                                link.path,
                                                link.target
                                            )
                                        }
                                        className={`
                                            relative
                                            flex
                                            items-center
                                            gap-2
                                            px-4
                                            py-2
                                            rounded-md
                                            text-sm
                                            transition-all
                                            duration-300
                                            ${active
                                                ? 'text-accent bg-white/5'
                                                : 'text-muted hover:text-foreground hover:bg-muted-bg'
                                            }
                                        `}
                                    >


                                        {/* Navigation content */}

                                        <span className="relative z-10 flex items-center gap-2">
                                            {link.icon}
                                            {link.name}
                                        </span>

                                    </button>
                                );
                            })}

                        </div>

                    </div>


                    {/* =====================================
                        MOBILE MENU BUTTON
                       ===================================== */}

                    <div className="-mr-2 flex md:hidden">

                        <button
                            type="button"
                            onClick={() =>
                                setIsOpen((prev) => !prev)
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                p-2
                                rounded-xl
                                text-gray-400
                                hover:text-white
                                hover:bg-white/10
                                transition-all
                                duration-300
                                focus:outline-none
                            "
                            aria-label={
                                isOpen
                                    ? 'Close menu'
                                    : 'Open menu'
                            }
                            aria-expanded={isOpen}
                        >

                            <AnimatePresence
                                mode="wait"
                                initial={false}
                            >

                                {isOpen ? (

                                    <motion.span
                                        key="close"
                                        initial={{
                                            rotate: -90,
                                            opacity: 0,
                                        }}
                                        animate={{
                                            rotate: 0,
                                            opacity: 1,
                                        }}
                                        exit={{
                                            rotate: 90,
                                            opacity: 0,
                                        }}
                                        transition={{
                                            duration: 0.2,
                                        }}
                                    >
                                        <X size={24} />
                                    </motion.span>

                                ) : (

                                    <motion.span
                                        key="menu"
                                        initial={{
                                            rotate: 90,
                                            opacity: 0,
                                        }}
                                        animate={{
                                            rotate: 0,
                                            opacity: 1,
                                        }}
                                        exit={{
                                            rotate: -90,
                                            opacity: 0,
                                        }}
                                        transition={{
                                            duration: 0.2,
                                        }}
                                    >
                                        <Menu size={24} />
                                    </motion.span>

                                )}

                            </AnimatePresence>

                        </button>

                    </div>

                </div>

            </div>


            {/* =============================================
                MOBILE NAVIGATION
               ============================================= */}

            <AnimatePresence>

                {isOpen && (

                    <motion.div
                        initial={{
                            opacity: 0,
                            height: 0,
                        }}
                        animate={{
                            opacity: 1,
                            height: 'auto',
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                        }}
                        transition={{
                            duration: 0.25,
                            ease: 'easeInOut',
                        }}
                        className="
                            md:hidden
                            bg-[#0f172a]
                            border-b
                            border-white/10
                            overflow-hidden
                        "
                    >

                        <div className="px-3 pt-3 pb-4 space-y-2">

                            {navLinks.map((link, index) => {

                                const active = isActive(
                                    link.path
                                );

                                return (
                                    <motion.button
                                        type="button"
                                        key={link.name}

                                        initial={{
                                            opacity: 0,
                                            x: -20,
                                        }}

                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                        }}

                                        transition={{
                                            delay: index * 0.05,
                                            duration: 0.25,
                                        }}

                                        onClick={() =>
                                            handleNavigation(
                                                link.path,
                                                link.target
                                            )
                                        }

                                        className={`
                                            relative
                                            w-full
                                            flex
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            rounded-xl
                                            text-left
                                            font-medium
                                            transition-all
                                            duration-300
                                            ${active
                                                ? 'text-accent bg-white/5'
                                                : 'text-muted hover:text-foreground hover:bg-muted-bg'
                                            }
                                        `}
                                    >

                                        {link.icon}

                                        <span>
                                            {link.name}
                                        </span>

                                    </motion.button>
                                );
                            })}

                        </div>

                    </motion.div>

                )}

            </AnimatePresence>

        </nav>
    );
};

export default Navbar;