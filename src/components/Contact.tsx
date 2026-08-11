import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        // Check if message was just sent
        const messageSent = sessionStorage.getItem('messageSent');
        if (messageSent) {
            setShowToast(true);
            sessionStorage.removeItem('messageSent');
            // Hide toast after 5 seconds
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <section id="contact" className="py-20 bg-secondary relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            {/* Elite Minimalist Toaster (Top Center) */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className="fixed top-6 left-1/2 z-[100] px-5 py-2 rounded-full shadow-2xl flex items-center gap-3 border border-green-500/50 bg-black/80 backdrop-blur-md text-white whitespace-nowrap"
                    >
                        <CheckCircle size={18} className="text-green-400" />
                        <span className="text-sm font-medium tracking-tight">Message Sent! Opening WhatsApp...</span>
                        <button onClick={() => setShowToast(false)} className="ml-1 p-0.5 hover:bg-white/10 rounded-full transition-colors text-gray-400">
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-accent font-semibold tracking-wider uppercase mb-2">Get In Touch</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Visit Our Shop</h3>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            We are here to help you with all your digital and photography needs. Drop by our shop or give us a call.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-accent shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg text-capitalize">Our Location</h4>
                                    <p className="text-gray-400"> Jagannath Mandir Chowk Main Road, Kalampur<br />Kalahandi, Odisha - 766013</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-accent shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Phone Number</h4>
                                    <p className="text-gray-400">+91 9078373859</p>
                                    <p className="text-gray-400">+91 6371713384</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-accent shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Email Address</h4>
                                    <p className="text-gray-400">PHOTOGRAPHY9@GMAIL.COM</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-accent shrink-0">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Working Hours</h4>
                                    <p className="text-gray-400">Mon - Sun: 9:00 AM - 9:00 PM</p>
                                    <p className="text-gray-400">Never: <span className="line-through text-red-500">Closed</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary p-8 rounded-2xl border border-white/10">
                        <h4 className="text-2xl font-bold text-white mb-6">Contact Us </h4>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.currentTarget;
                                const formData = new FormData(form);
                                const firstName = formData.get('firstName');
                                const lastName = formData.get('lastName');
                                const phone = formData.get('phone');
                                const message = formData.get('message');

                                const whatsappMessage = `*New Inquiry from Website*%0A%0A*Name:* ${firstName} ${lastName}%0A*Phone:* ${phone}%0A*Message:* ${message}`;

                                // Replace with the actual shop owner's number
                                const ownerNumber = "916371713384";

                                // Set flag for toaster
                                sessionStorage.setItem('messageSent', 'true');

                                // Reset form
                                form.reset();

                                // Open WhatsApp immediately
                                window.open(`https://wa.me/${ownerNumber}?text=${whatsappMessage}`, '_blank');

                                // Also show toast immediately in case they don't leave the tab or it opens in background
                                setShowToast(true);
                                setTimeout(() => setShowToast(false), 5000);
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">First Name</label>
                                    <input
                                        name="firstName"
                                        required
                                        type="text"
                                        className="w-full bg-secondary border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Last Name</label>
                                    <input
                                        name="lastName"
                                        required
                                        type="text"
                                        className="w-full bg-secondary border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Phone Number</label>
                                <input
                                    name="phone"
                                    required
                                    type="tel"
                                    className="w-full bg-secondary border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                                    placeholder="+91 6371713384"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    className="w-full bg-secondary border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors h-32"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded-lg transition-colors">
                                Send via WhatsApp
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
