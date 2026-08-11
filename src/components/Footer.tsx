import { Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary border-t border-white/10 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold">
                            P
                        </div>
                        <span className="text-white font-bold text-xl tracking-wider">PERFECT<span className="text-accent">PIXEL</span></span>
                    </div>

                    <div className="text-gray-400 text-sm text-center md:text-left">
                        &copy; {new Date().getFullYear()} Perfect Pixel. All rights reserved.
                    </div>

                    <div className="flex gap-4">
                        <a href="https://www.facebook.com/sumanta.bag.56808" target='_blank' className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-500 transition-all">
                            <Facebook size={20} />
                        </a>
                        <a href="https://www.instagram.com/perfect_pixel_photography9/" target='_blank' className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-gray-400 hover:text-white hover:bg-rose-600 transition-all">
                            <Instagram size={20} />
                        </a>
                        <a href="https://youtube.com/@perfectpixelphotography9?si=H03YJEo8pk_TTfhJ" target='_blank' className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-all">
                            <Youtube size={20} />
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
