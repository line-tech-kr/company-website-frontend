import "./TabNav.css";

type Tab = { id: string; num: string; label: string };

type Props = { tabs: Tab[] };

export function TabNav({ tabs }: Props) {
  return (
    <nav className="lt-pdp-tabs" aria-label="Section navigation">
      {tabs.map((t) => (
        <a key={t.id} className="lt-pdp-tabs__tab" href={`#${t.id}`}>
          <span className="lt-pdp-tabs__num">{t.num}</span>
          <span>{t.label}</span>
        </a>
      ))}
    </nav>
  );
}
