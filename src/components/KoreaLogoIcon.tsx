export default function KoreaLogoIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full group-hover:rotate-[15deg] transition-transform duration-500 ease-out"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Transparent background or subtle white base */}
        <circle cx="50" cy="50" r="46" fill="white" stroke="#1c1917" strokeWidth="6" />
        
        {/* Elegant Taegeuk Swirl */}
        {/* Red portion (Top) */}
        <path
          d="M 50,10 A 40,40 0 0,1 50,90 A 20,20 0 0,1 50,50 A 20,20 0 0,0 50,10"
          fill="#CD2E3A"
        />
        {/* Blue portion (Bottom) */}
        <path
          d="M 50,10 A 40,40 0 0,0 50,90 A 20,20 0 0,1 50,50 A 20,20 0 0,0 50,10"
          fill="#0047A0"
        />
        
        {/* Minimalist modern concentric circular ring */}
        <circle cx="50" cy="50" r="41" fill="none" stroke="#1c1917" strokeWidth="2" strokeDasharray="6 3" className="opacity-30" />
      </svg>
    </div>
  );
}
