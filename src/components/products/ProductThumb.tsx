type Props = { large?: boolean };

export function ProductThumb({ large }: Props) {
  const w = large ? 96 : 44;
  const h = large ? 64 : 30;
  return (
    <svg
      className="lt-prod-thumb"
      width={w}
      height={h}
      viewBox="0 0 96 64"
      aria-hidden
    >
      <rect
        x="22"
        y="18"
        width="52"
        height="34"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="38"
        y="8"
        width="20"
        height="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M22 30 L12 30 M12 26 L12 38 L18 38 L18 26 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M74 30 L84 30 M84 26 L84 38 L78 38 L78 26 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="30" cy="46" r="1.4" fill="currentColor" />
      <circle cx="66" cy="46" r="1.4" fill="currentColor" />
      <line
        x1="30"
        y1="34"
        x2="66"
        y2="34"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="2 2"
        opacity="0.5"
      />
    </svg>
  );
}
