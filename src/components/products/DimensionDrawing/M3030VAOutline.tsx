type Props = {
  hover: string | null;
  setH: (id: string | null) => () => void;
};

export function M3030VAOutline({ hover, setH }: Props) {
  return (
    <svg
      viewBox="0 0 600 340"
      className="lt-pdp-dim__svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern
          id="ltgrid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="currentColor"
            strokeWidth=".3"
            opacity=".18"
          />
        </pattern>
        <pattern
          id="ltgrid2"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 100 0 L 0 0 0 100"
            fill="none"
            stroke="currentColor"
            strokeWidth=".5"
            opacity=".28"
          />
        </pattern>
        <marker
          id="lt-arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
        <marker
          id="lt-arrow-start"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
      </defs>
      <rect width="600" height="340" fill="url(#ltgrid)" />
      <rect width="600" height="340" fill="url(#ltgrid2)" />

      <line
        x1="0"
        y1="170"
        x2="600"
        y2="170"
        stroke="currentColor"
        strokeDasharray="2 4"
        strokeWidth=".5"
        opacity=".3"
      />
      <line
        x1="300"
        y1="0"
        x2="300"
        y2="340"
        stroke="currentColor"
        strokeDasharray="2 4"
        strokeWidth=".5"
        opacity=".3"
      />

      <g className="lt-pdp-dim__body">
        <rect
          x="170"
          y="210"
          width="260"
          height="45"
          fill="var(--dim-fill, var(--pd-bg))"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <rect
          x="200"
          y="120"
          width="200"
          height="90"
          fill="var(--dim-fill-2, var(--pd-surface-2))"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <rect
          x="215"
          y="108"
          width="170"
          height="12"
          fill="var(--dim-fill, var(--pd-bg))"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <rect
          x="360"
          y="130"
          width="50"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="365"
          y1="136"
          x2="405"
          y2="136"
          stroke="currentColor"
          strokeWidth=".6"
        />
        <line
          x1="365"
          y1="141"
          x2="405"
          y2="141"
          stroke="currentColor"
          strokeWidth=".6"
        />
        <line
          x1="365"
          y1="146"
          x2="405"
          y2="146"
          stroke="currentColor"
          strokeWidth=".6"
        />
        <text
          x="300"
          y="178"
          fontSize="6"
          textAnchor="middle"
          fill="currentColor"
          opacity=".6"
          fontFamily="var(--lt-mono)"
        >
          LINE TECH
        </text>
        <g>
          <rect
            x="140"
            y="220"
            width="30"
            height="25"
            fill="var(--dim-fill-2, var(--pd-surface-2))"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle
            cx="140"
            cy="232.5"
            r="8"
            fill="var(--pd-surface)"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="140" cy="232.5" r="3" fill="currentColor" opacity=".15" />
        </g>
        <g>
          <rect
            x="430"
            y="220"
            width="30"
            height="25"
            fill="var(--dim-fill-2, var(--pd-surface-2))"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle
            cx="460"
            cy="232.5"
            r="8"
            fill="var(--pd-surface)"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="460" cy="232.5" r="3" fill="currentColor" opacity=".15" />
        </g>
        <circle
          cx="190"
          cy="250"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth=".8"
        />
        <circle
          cx="410"
          cy="250"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth=".8"
        />
      </g>

      <DimLine
        active={hover === "A"}
        from={[200, 85]}
        to={[400, 85]}
        tick1={[200, 108]}
        tick2={[400, 108]}
        labelPos={[300, 78]}
        text="28.0"
        onEnter={setH("A")}
        onLeave={setH(null)}
      />
      <DimLine
        active={hover === "B"}
        from={[495, 108]}
        to={[495, 255]}
        tick1={[430, 108]}
        tick2={[430, 255]}
        labelPos={[505, 185]}
        text="115.5"
        vertical
        onEnter={setH("B")}
        onLeave={setH(null)}
      />
      <DimLine
        active={hover === "C"}
        from={[140, 285]}
        to={[460, 285]}
        tick1={[140, 258]}
        tick2={[460, 258]}
        labelPos={[300, 302]}
        text="123.0"
        onEnter={setH("C")}
        onLeave={setH(null)}
      />
      <DimLine
        active={hover === "D"}
        from={[140, 200]}
        to={[460, 200]}
        tick1={[140, 220]}
        tick2={[460, 220]}
        labelPos={[300, 193]}
        text="88.9"
        onEnter={setH("D")}
        onLeave={setH(null)}
      />

      <g
        className="lt-pdp-dim__leader"
        onMouseEnter={setH("E")}
        onMouseLeave={setH(null)}
      >
        <path
          d="M190,250 L120,305 L90,305"
          fill="none"
          stroke="currentColor"
          strokeWidth=".9"
        />
        <circle cx="190" cy="250" r="2" fill="currentColor" />
        <text
          x="85"
          y="303"
          textAnchor="end"
          fontSize="10"
          fontFamily="var(--lt-mono)"
          fill="currentColor"
        >
          M4 × 2
        </text>
      </g>

      <CalloutDot
        x={252}
        y={85}
        letter="A"
        active={hover === "A"}
        onEnter={setH("A")}
        onLeave={setH(null)}
      />
      <CalloutDot
        x={515}
        y={130}
        letter="B"
        active={hover === "B"}
        onEnter={setH("B")}
        onLeave={setH(null)}
      />
      <CalloutDot
        x={252}
        y={285}
        letter="C"
        active={hover === "C"}
        onEnter={setH("C")}
        onLeave={setH(null)}
      />
      <CalloutDot
        x={348}
        y={193}
        letter="D"
        active={hover === "D"}
        onEnter={setH("D")}
        onLeave={setH(null)}
      />
      <CalloutDot
        x={70}
        y={295}
        letter="E"
        active={hover === "E"}
        onEnter={setH("E")}
        onLeave={setH(null)}
      />
    </svg>
  );
}

type DimLineProps = {
  from: [number, number];
  to: [number, number];
  tick1: [number, number];
  tick2: [number, number];
  labelPos: [number, number];
  text: string;
  active: boolean;
  vertical?: boolean;
  onEnter: () => void;
  onLeave: () => void;
};

function DimLine({
  from,
  to,
  tick1,
  tick2,
  labelPos,
  text,
  active,
  vertical,
  onEnter,
  onLeave,
}: DimLineProps) {
  return (
    <g
      className={`lt-pdp-dim__dimline${active ? " is-active" : ""}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <line
        x1={tick1[0]}
        y1={tick1[1]}
        x2={from[0]}
        y2={from[1]}
        stroke="currentColor"
        strokeWidth=".7"
      />
      <line
        x1={tick2[0]}
        y1={tick2[1]}
        x2={to[0]}
        y2={to[1]}
        stroke="currentColor"
        strokeWidth=".7"
      />
      <line
        x1={from[0]}
        y1={from[1]}
        x2={to[0]}
        y2={to[1]}
        stroke="currentColor"
        strokeWidth="1"
        markerStart="url(#lt-arrow-start)"
        markerEnd="url(#lt-arrow)"
      />
      <text
        x={labelPos[0]}
        y={labelPos[1]}
        textAnchor="middle"
        fontSize="11"
        fontFamily="var(--lt-mono)"
        fill="currentColor"
        transform={
          vertical ? `rotate(-90 ${labelPos[0]} ${labelPos[1]})` : undefined
        }
      >
        {text}
      </text>
    </g>
  );
}

type CalloutDotProps = {
  x: number;
  y: number;
  letter: string;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
};

function CalloutDot({
  x,
  y,
  letter,
  active,
  onEnter,
  onLeave,
}: CalloutDotProps) {
  return (
    <g
      className={`lt-pdp-dim__cdot${active ? " is-active" : ""}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <circle cx={x} cy={y} r="8.5" />
      <text
        x={x}
        y={y + 3.5}
        textAnchor="middle"
        fontSize="9.5"
        fontFamily="var(--lt-sans)"
        fontWeight="600"
      >
        {letter}
      </text>
    </g>
  );
}
