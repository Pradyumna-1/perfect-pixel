interface BrandProps {
    className?: string;
}

const Brand = ({ className = '' }: BrandProps) => {
    return (
        <span className={`inline-flex items-center gap-2 ${className}`}>
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-[#e11d48]/20 bg-[#1c2028] text-lg font-extrabold text-[#e11d48] transition-transform duration-300 group-hover:scale-110">
                P
            </span>
            <span className="font-bold text-xl tracking-wider">
                <span className="text-[#e11d48]">P</span><span className="text-[#20242b]">ERFECT</span><span className="text-[#e11d48]">P</span><span className="text-[#2f7fd1]">IXEL</span>
            </span>
        </span>
    );
};

export default Brand;
