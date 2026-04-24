import "./Chip.css";

type Tone = "neutral" | "success" | "info" | "warning" | "danger";

type Props = {
  children: React.ReactNode;
  tone?: Tone;
  small?: boolean;
  dot?: boolean;
};

export function Chip({ children, tone = "neutral", small, dot }: Props) {
  return (
    <span className={`lt-chip lt-chip--${tone}${small ? " lt-chip--sm" : ""}`}>
      {dot && <span className="lt-chip__dot" aria-hidden />}
      {children}
    </span>
  );
}
