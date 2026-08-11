import Hero from '../components/Hero';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Home = () => {
    const location = useLocation();

    useEffect(() => {
        const sectionMap: Record<string, string> = {
            '/services': 'services',
            '/gallery': 'gallery',
            '/contact': 'contact',
        };

        const targetId = sectionMap[location.pathname];

        if (!targetId) {
            window.scrollTo({
                top: 0,
                behavior: 'auto',
            });

            return;
        }

        const timer = setTimeout(() => {
            const element = document.getElementById(targetId);

            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <>
            <Hero />
            <Services />
            <Gallery />
            <Contact />
        </>
    );
};


export default Home;
