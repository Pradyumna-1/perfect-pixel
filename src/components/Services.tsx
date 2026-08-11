import { motion } from 'framer-motion';
import { Printer, FileText, Camera, Video, CreditCard, Globe } from 'lucide-react';

const Services = () => {
    const services = [
        {
            icon: <Printer size={40} />,
            title: 'Printing & Photocopy',
            description: 'High-quality color and B&W printing, xerox, and lamination services.',
            color: 'bg-blue-500'
        },
        {
            icon: <Globe size={40} />,
            title: 'Online Services',
            description: 'Apply for Government schemes, Pan Card, Aadhar updates, and more.',
            color: 'bg-green-500'
        },
        {
            icon: <Camera size={40} />,
            title: 'Wedding Photography',
            description: 'Capturing your special moments with professional equipment and lighting.',
            color: 'bg-purple-500'
        },
        {
            icon: <Video size={40} />,
            title: 'Drone Shoots',
            description: 'Cinematic 4K drone footage for weddings, events, and real estate.',
            color: 'bg-orange-500'
        },
        {
            icon: <FileText size={40} />,
            title: 'Document Typing',
            description: 'Professional typing for Hindi and English documents, affidavits, and resumes.',
            color: 'bg-red-500'
        },
        {
            icon: <CreditCard size={40} />,
            title: 'Money Transfer',
            description: 'Instant money transfer to any bank account and bill payments.',
            color: 'bg-teal-500'
        }
    ];

    return (
        <section id="services" className="py-20 bg-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-accent font-semibold tracking-wider uppercase mb-2">What We Do</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">Our Premium Services</h3>
                    <div className="w-20 h-1 bg-accent mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-primary/50 border border-white/5 p-8 rounded-2xl hover:bg-primary hover:border-accent/30 transition-all group"
                        >
                            <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                {service.icon}
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">{service.title}</h4>
                            <p className="text-gray-400 leading-relaxed">{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
