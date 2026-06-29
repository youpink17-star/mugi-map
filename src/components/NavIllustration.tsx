// 사업 내비게이션 일러스트 (순수 SVG) — 폰 내비 화면 + 도로 + 자동차.
// "내비게이션처럼 사업 길을 안내한다"는 메시지를 전달한다.
export default function NavIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 360"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="사업 내비게이션 일러스트"
    >
      <defs>
        <linearGradient id="navSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EAF1FF" />
          <stop offset="0.55" stopColor="#F2EEFF" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="navRoad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CDD6EA" />
          <stop offset="1" stopColor="#E6ECF7" />
        </linearGradient>
        <linearGradient id="navPhone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5572FF" />
          <stop offset="1" stopColor="#3D5AFE" />
        </linearGradient>
        <linearGradient id="navCar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6E7BF2" />
          <stop offset="1" stopColor="#4F5FE0" />
        </linearGradient>
      </defs>

      {/* 배경 */}
      <rect x="0" y="0" width="360" height="360" fill="url(#navSky)" />

      {/* 스카이라인 (양옆, 옅게) */}
      <g fill="#D7E0F7" opacity="0.85">
        <rect x="8" y="170" width="26" height="78" rx="3" />
        <rect x="40" y="150" width="30" height="98" rx="3" />
        <rect x="74" y="186" width="22" height="62" rx="3" />
      </g>
      <g fill="#E4DCF6" opacity="0.85">
        <rect x="266" y="184" width="22" height="64" rx="3" />
        <rect x="292" y="150" width="30" height="98" rx="3" />
        <rect x="328" y="172" width="24" height="76" rx="3" />
      </g>
      {/* 창문 점들 */}
      <g fill="#FFFFFF" opacity="0.6">
        <rect x="48" y="160" width="5" height="5" rx="1" />
        <rect x="58" y="160" width="5" height="5" rx="1" />
        <rect x="48" y="172" width="5" height="5" rx="1" />
        <rect x="300" y="160" width="5" height="5" rx="1" />
        <rect x="310" y="160" width="5" height="5" rx="1" />
        <rect x="300" y="172" width="5" height="5" rx="1" />
      </g>

      {/* 도로 (원근) */}
      <path d="M150 238 L210 238 L320 360 L40 360 Z" fill="url(#navRoad)" />
      {/* 지나온 길(초록) */}
      <path d="M52 360 L122 360 L190 250 L176 250 Z" fill="#A7EEC0" opacity="0.6" />
      <path d="M64 360 L116 360 L186 252 L180 252 Z" fill="#7BE0A0" opacity="0.9" />
      {/* 중앙 차선 점선 (원근) */}
      <g fill="#FFFFFF">
        <path d="M178 250 L182 250 L183 262 L177 262 Z" />
        <path d="M176 274 L184 274 L186 292 L174 292 Z" />
        <path d="M173 306 L187 306 L190 330 L170 330 Z" />
      </g>

      {/* 자동차 (뒤에서 본 모습) */}
      <ellipse cx="180" cy="332" rx="32" ry="6" fill="#07071F" opacity="0.10" />
      <g>
        <rect x="156" y="296" width="48" height="36" rx="11" fill="url(#navCar)" />
        <rect x="162" y="301" width="36" height="15" rx="6" fill="#C7D6FF" />
        <rect x="160" y="320" width="8" height="6" rx="2" fill="#FF2F8F" />
        <rect x="192" y="320" width="8" height="6" rx="2" fill="#FF2F8F" />
        <rect x="158" y="328" width="44" height="5" rx="2.5" fill="#3F4FD0" />
      </g>

      {/* 폰 그림자 */}
      <ellipse cx="180" cy="242" rx="74" ry="11" fill="#07071F" opacity="0.07" />

      {/* 폰 */}
      <rect x="112" y="24" width="136" height="216" rx="26" fill="url(#navPhone)" />
      <rect x="170" y="32" width="20" height="3.5" rx="1.75" fill="#FFFFFF" opacity="0.5" />
      <rect x="120" y="42" width="120" height="190" rx="14" fill="#FFFFFF" />

      {/* 내비 상단 안내 배너 */}
      <rect x="128" y="50" width="104" height="34" rx="9" fill="#2E5BFF" />
      {/* 턴 화살표 */}
      <path
        d="M141 74 L141 65 Q141 61 145 61 L152 61 M148 57 L154 61 L148 65"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="162" y="64" fontSize="9.5" fontWeight="800" fill="#FFFFFF">다음 칸</text>
      <text x="162" y="76" fontSize="8.5" fontWeight="700" fill="#FFFFFF" opacity="0.92">내 무기 →</text>

      {/* 내비 지도 영역 */}
      <rect x="128" y="90" width="104" height="134" rx="9" fill="#EDF1FA" />
      {/* 도로(흰색) */}
      <rect x="172" y="90" width="16" height="134" fill="#FFFFFF" />
      <rect x="128" y="150" width="104" height="15" fill="#FFFFFF" />
      {/* 블록 음영 */}
      <g fill="#E2E8F5">
        <rect x="134" y="96" width="32" height="48" rx="3" />
        <rect x="194" y="96" width="32" height="48" rx="3" />
        <rect x="134" y="172" width="32" height="46" rx="3" />
        <rect x="194" y="172" width="32" height="46" rx="3" />
      </g>
      {/* 경로(핑크) */}
      <path
        d="M180 218 L180 165 Q180 158 188 158 L218 158"
        fill="none"
        stroke="#FF2F8F"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 목적지 */}
      <circle cx="219" cy="158" r="4.5" fill="#FF2F8F" />
      <circle cx="219" cy="158" r="1.8" fill="#FFFFFF" />
      {/* 현재 위치 */}
      <circle cx="180" cy="206" r="7" fill="#3D5AFE" />
      <circle cx="180" cy="206" r="7" fill="none" stroke="#FFFFFF" strokeWidth="2" />
      <path d="M180 201 L183 207 L177 207 Z" fill="#FFFFFF" />

      {/* 반짝임 */}
      <g fill="#FFB7D8">
        <path d="M300 96 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" opacity="0.8" />
        <path d="M60 120 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5 z" opacity="0.7" />
      </g>
    </svg>
  );
}
