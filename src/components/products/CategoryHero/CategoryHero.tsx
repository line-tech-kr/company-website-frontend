import "./CategoryHero.css";

type Props = {
  kickerNum: string;
  kickerLabel: string;
  title: string;
  code: string;
  lede: string;
};

export function CategoryHero({
  kickerNum,
  kickerLabel,
  title,
  code,
  lede,
}: Props) {
  return (
    <header className="lt-cat-hero">
      <div className="lt-cat-hero__lead">
        <div className="lt-cat-hero__kicker">
          <span className="lt-cat-hero__kicker-num">{kickerNum}</span>
          <span>{kickerLabel}</span>
        </div>
        <h1 className="lt-cat-hero__title">
          {title} <span className="lt-cat-hero__code">{code}</span>
        </h1>
        <p className="lt-cat-hero__lede">{lede}</p>
      </div>
    </header>
  );
}
