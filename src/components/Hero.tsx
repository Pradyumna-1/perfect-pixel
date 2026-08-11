import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-primary z-10"></div>

            {/* Background Image (Placeholder) */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80")'
                }}
            ></div>

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-accent font-semibold tracking-wider uppercase mb-4">One Stop Solution</h2>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Digital Services & <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-200">
                            Creative Photography
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        From high-quality printing and online applications to capturing your life's best moments with our drone and wedding photography.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/services"
                            className="px-8 py-4 bg-accent hover:bg-accent-hover text-white rounded-full font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                        >
                            Explore Services <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/contact"
                            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-bold transition-all backdrop-blur-sm"
                        >
                            Book Now
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}

        </section>
    );
};

export default Hero;
