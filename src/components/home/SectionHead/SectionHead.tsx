type Props = { kicker: string; title: string; sub?: string };

export function SectionHead({ kicker, title, sub }: Props) {
  return (
    <header className="ho-sechd">
      <div className="ho-sechd__kicker">{kicker}</div>
      <h2 className="ho-sechd__title">{title}</h2>
      {sub && <p className="ho-sechd__sub">{sub}</p>}
    </header>
  );
}
