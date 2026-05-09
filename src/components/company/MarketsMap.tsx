import type { CSSProperties } from "react";
import { COUNTRY_PATHS } from "./world-map-paths";

export type MarketDestination = {
  iso: string;
  /** Decimal degrees, WGS84. */
  lat: number;
  /** Decimal degrees, WGS84. */
  lon: number;
};

type Props = {
  /** Origin point — arcs radiate from here. The country at `hqIso` is also
   * highlighted on the map. */
  hq: { iso: string; lat: number; lon: number };
  /** Overseas destinations. Each gets a highlighted country fill, an arc from
   * HQ, and a traveling pulse. */
  destinations: ReadonlyArray<MarketDestination>;
  /** ISO Alpha-2 → localized country name. Used for `<title>` tooltips on
   * highlighted countries. */
  countryNames: Record<string, string>;
  /** Localized accessible label for the SVG itself. */
  ariaLabel: string;
};

const VIEW_W = 1000;
const VIEW_H = 500;

function project(lat: number, lon: number) {
  return {
    x: ((lon + 180) * VIEW_W) / 360,
    y: ((90 - lat) * VIEW_H) / 180,
  };
}

/** Quadratic Bézier arc curving perpendicular to the chord, lifted toward the
 * viewer-left side. Lift caps at 120 units so transcontinental arcs don't fly
 * off the canvas. */
function arcPath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) return "";
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const nx = -dy / dist;
  const ny = dx / dist;
  const lift = Math.min(120, dist * 0.22);
  const cx = mx + nx * lift;
  const cy = my + ny * lift;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

export function MarketsMap({
  hq,
  destinations,
  countryNames,
  ariaLabel,
}: Props) {
  const selected = new Set<string>([hq.iso, ...destinations.map((d) => d.iso)]);
  const hqXY = project(hq.lat, hq.lon);

  return (
    <svg
      className="co-markets__map"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={ariaLabel}
    >
      <g className="co-markets__countries">
        {Object.entries(COUNTRY_PATHS).map(([iso, d]) => {
          const isSelected = selected.has(iso);
          return (
            <path
              key={iso}
              d={d}
              data-iso={iso}
              className={
                "co-markets__country" + (isSelected ? " is-selected" : "")
              }
            >
              {isSelected && countryNames[iso] ? (
                <title>{countryNames[iso]}</title>
              ) : null}
            </path>
          );
        })}
      </g>

      <g className="co-markets__arcs" aria-hidden="true">
        {destinations.map((dest, i) => {
          const p = project(dest.lat, dest.lon);
          const d = arcPath(hqXY.x, hqXY.y, p.x, p.y);
          const travelerStyle: CSSProperties = {
            offsetPath: `path('${d}')`,
            animationDelay: `${(i * 0.18).toFixed(2)}s`,
          };
          return (
            <g key={dest.iso}>
              <path d={d} className="co-markets__arc" />
              <circle
                r={2.2}
                className="co-markets__traveler"
                style={travelerStyle}
              />
            </g>
          );
        })}
      </g>

      <g className="co-markets__markers" aria-hidden="true">
        {destinations.map((dest) => {
          const p = project(dest.lat, dest.lon);
          return (
            <g
              key={dest.iso}
              transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}
            >
              <circle r={4} className="co-markets__dotGlow" />
              <circle r={2.4} className="co-markets__dot" />
            </g>
          );
        })}
      </g>

      <g
        className="co-markets__hq"
        transform={`translate(${hqXY.x.toFixed(1)} ${hqXY.y.toFixed(1)})`}
      >
        <circle r={9} className="co-markets__hqGlow" />
        <circle r={4.5} className="co-markets__hqDot" />
        {countryNames[hq.iso] ? <title>{countryNames[hq.iso]}</title> : null}
      </g>
    </svg>
  );
}
