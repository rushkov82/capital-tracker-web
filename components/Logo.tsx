export default function Logo() {
  return (
    <div className="flex h-[44px] w-[44px] items-center justify-center">
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="22" cy="22" r="18" fill="#22c55e" />

        <text
          x="22"
          y="23.5"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="22"
          fontWeight="700"
          fontFamily='"JetBrains Mono", "IBM Plex Sans", "Inter", system-ui, sans-serif'
        >
          ₽
        </text>
      </svg>
    </div>
  );
}