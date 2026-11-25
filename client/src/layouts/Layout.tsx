import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const { pathname } = useLocation();

    useEffect(() => {
        const sectionRoutes = ['/services', '/gallery', '/contact'];
        if (!sectionRoutes.includes(pathname)) {
            window.scrollTo({ top: 0, behavior: 'auto' });
        }
    }, [pathname]);

    return (
        <div className="min-h-screen bg-primary text-white font-sans">
            <Navbar />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
