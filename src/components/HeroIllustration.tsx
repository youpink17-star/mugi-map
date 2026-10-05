// 히어로 일러스트 (순수 SVG, 16:9, 텍스트 없음) — 접힌 사업 지도 + 경로 + 도착 핀.
// 밝은 배경 위에 올라가도록 흰 지도 카드 + 부드러운 그림자.
export default function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 180"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="한 장의 사업 지도와 목적지 핀"
    >
      <defs>
        <clipPath id="heroMapClip">
          <rect x="66" y="26" width="188" height="126" rx="16" />
        </clipPath>
      </defs>

      {/* 지도 카드 */}
      <rect x="68" y="31" width="188" height="126" rx="16" fill="#1A1340" opacity="0.10" />
      <rect x="66" y="26" width="188" height="126" rx="16" fill="#FFFFFF" stroke="#E9ECF3" strokeWidth="1" />

      {/* 지도 내부 (카드 안으로 클립) */}
      <g clipPath="url(#heroMapClip)">
        {/* 물 / 공원 (옅게) */}
        <ellipse cx="96" cy="150" rx="52" ry="24" fill="#D9E6FB" opacity="0.8" />
        <rect x="196" y="112" width="44" height="30" rx="6" fill="#D2EBD8" opacity="0.9" />
        {/* 접힘 주름 */}
        <line x1="128" y1="26" x2="128" y2="152" stroke="#EEF1F7" strokeWidth="1.5" />
        <line x1="190" y1="26" x2="190" y2="152" stroke="#EEF1F7" strokeWidth="1.5" />
        <line x1="66" y1="90" x2="254" y2="90" stroke="#EEF1F7" strokeWidth="1.5" />
        {/* 옅은 길 */}
        <path d="M70 118 H250" stroke="#F0F2F7" strokeWidth="7" strokeLinecap="round" />
        {/* 경로(핑크) */}
        <path
          d="M90 136 C 104 118 96 100 130 95 C 162 90 186 80 212 62"
          fill="none"
          stroke="#E0487C"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        {/* 출발 마커 */}
        <circle cx="90" cy="136" r="5.5" fill="#FFFFFF" stroke="#E0487C" strokeWidth="3" />
      </g>

      {/* 도착 핀 */}
      <path d="M212 64 C 198 50 202 37 212 37 C 222 37 226 50 212 64 Z" fill="#E0487C" />
      <circle cx="212" cy="47" r="4.6" fill="#FFFFFF" />

      {/* 반짝임 */}
      <g fill="#FFB7D8">
        <path d="M236 40 l1.5 3.8 3.8 1.5 -3.8 1.5 -1.5 3.8 -1.5 -3.8 -3.8 -1.5 3.8 -1.5 z" opacity="0.85" />
        <path d="M62 70 l1.2 3.2 3.2 1.2 -3.2 1.2 -1.2 3.2 -1.2 -3.2 -3.2 -1.2 3.2 -1.2 z" opacity="0.7" />
      </g>
    </svg>
  );
}
