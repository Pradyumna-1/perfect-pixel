import logo from '../assets/perfect-pixel.jpg';

interface BrandProps {
    className?: string;
}

const Brand = ({ className = '' }: BrandProps) => {
    return (
        <span className={`inline-flex items-center gap-3 ${className}`}>
            <img
                src={logo}
                alt="Perfect Pixel logo"
                className="h-10 w-10 rounded-full object-cover border border-white/10 shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-bold text-xl tracking-wider leading-none">
                <span className="text-[#e11d48]">P</span><span className="text-[#20242b]">ERFECT</span><span className="text-[#e11d48]">P</span><span className="text-[#2f7fd1]">IXEL</span>
            </span>
        </span>
    );
};

export default Brand;
