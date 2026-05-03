import "./CategoryHero.css";

type Props = {
  kickerLabel: string;
  title: string;
  code: string;
  lede: string;
};

export function CategoryHero({ kickerLabel, title, code, lede }: Props) {
  return (
    <header className="lt-cat-hero">
      <div className="lt-cat-hero__lead">
        <div className="lt-cat-hero__kicker">
          {code} — {kickerLabel}
        </div>
        <h1 className="lt-cat-hero__title">{title}</h1>
        <p className="lt-cat-hero__lede">{lede}</p>
      </div>
    </header>
  );
}
