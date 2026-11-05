export default function KoreaLogoIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full group-hover:scale-105 transition-transform duration-300 ease-out drop-shadow-xs"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="대한민국 태극 문양 (Taegeuk)"
      >
        {/* Subtle outer white border ring for contrast on both light and dark backgrounds */}
        <circle cx="50" cy="50" r="48" fill="#ffffff" />

        {/* Official Republic of Korea Flag (태극기) Taegeuk Geometry:
            - Inclined at arctan(2/3) = 33.6900675° clockwise
            - Upper half: Red (#CD2E3A) with left-downward red lobe (r = R/2)
            - Lower half: Blue (#0047A0) with right-upward blue lobe (r = R/2)
        */}
        <g transform="rotate(33.6900675 50 50)">
          {/* Base full circle in Official Taegeuk Blue (#0047A0) */}
          <circle cx="50" cy="50" r="46" fill="#0047A0" />

          {/* Upper semicircle in Official Taegeuk Red (#CD2E3A) */}
          <path d="M 4,50 A 46,46 0 0,1 96,50 Z" fill="#CD2E3A" />

          {/* Left inner circle (Red lobe, r = 23) */}
          <circle cx="27" cy="50" r="23" fill="#CD2E3A" />

          {/* Right inner circle (Blue lobe, r = 23) */}
          <circle cx="73" cy="50" r="23" fill="#0047A0" />
        </g>
      </svg>
    </div>
  );
}
