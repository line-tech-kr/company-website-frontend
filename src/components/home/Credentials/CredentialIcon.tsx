type Category = "quality" | "compliance" | "innovation" | "partnership";

type Props = { category: Category };

export function CredentialIcon({ category }: Props) {
  return (
    <span
      className="ho-credentials__icon"
      data-category={category}
      aria-hidden="true"
    >
      {ICONS[category]}
    </span>
  );
}

const ICONS: Record<Category, React.ReactNode> = {
  quality: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
      <path
        d="M12 2.5 4 5.5v6.2c0 4.4 3.2 8.3 8 9.8 4.8-1.5 8-5.4 8-9.8V5.5l-8-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m8.5 12 2.5 2.5L15.5 10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  compliance: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
      <path
        d="M6 3h9l4 4v14H6V3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M15 3v4h4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M10 15.5 9 19l3-1.5L15 19l-1-3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  innovation: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
      <path
        d="M12 3v2M5 6l1.4 1.4M3 12h2M19 12h2M17.6 7.4 19 6M9.5 17h5M10 20h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 7a5 5 0 0 0-3 9c.6.4 1 1 1 1.6V18h4v-.4c0-.6.4-1.2 1-1.6a5 5 0 0 0-3-9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  partnership: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
      <path
        d="M3 13h4l3-3 3 3 4-1 4 3-3 3-2-1-3 2-3-2-3 1-4-2 0-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m10 10 2 2 2-2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};
