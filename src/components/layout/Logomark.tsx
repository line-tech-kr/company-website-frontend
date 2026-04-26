// TODO(slice-2, #2): swap placeholder geometry for traced real logo from
// docs/brand-reference/logo-crop.png. Keep currentColor + viewBox so the
// header brand color flows through.

type Props = { size?: number };

export function Logomark({ size = 22 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="1.5"
        y="1.5"
        width="19"
        height="19"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M11 5.5v11M5.5 11h11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
