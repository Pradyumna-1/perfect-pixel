import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock3 } from 'lucide-react';
import heroPhoto from '../assets/de38a848-65bb-43c1-ab3f-7ade69707a65.png';

const Hero = () => {
    return (
        <section id="home" className="wp-hero">
            <div className="wp-light" aria-hidden="true" />
            <div className="wp-hero-inner">
                <motion.div
                    className="wp-hero-copy"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="wp-kicker">Perfect Pixel, Kalampur</span>
                    <h1>Every print.<br /><span>Every moment.</span></h1>
                    <p>Printing, online services and photography, handled with care in one calm place.</p>
                    <div className="wp-actions">
                        <Link to="/services" className="wp-btn wp-btn--primary">See services <ArrowRight size={18} /></Link>
                        <Link to="/contact" className="wp-btn wp-btn--quiet">Book a visit</Link>
                    </div>
                    <div className="wp-hours"><Clock3 size={16} /> Open 9:00 AM – 9:00 PM, all week</div>
                </motion.div>

                <motion.div
                    className="wp-hero-visual"
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="wp-photo">
                        <img src={heroPhoto} alt="Perfect Pixel storefront artwork" fetchPriority="high" />
                    </div>
                    <div className="wp-note">
                        <span>At the shop</span>
                        <strong>Printing, paperwork, photography</strong>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
