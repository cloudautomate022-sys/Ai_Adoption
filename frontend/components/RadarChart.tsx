"use client";

import { useI18n } from "@/lib/i18n";
import type { Scores } from "@/lib/types";

const DIMS: { key: keyof Scores; label: string }[] = [
  { key: "data_maturity", label: "radar.data" },
  { key: "digital_infrastructure", label: "radar.infra" },
  { key: "ai_readiness", label: "radar.ai" },
  { key: "change_readiness", label: "radar.change" },
  { key: "pain_intensity", label: "radar.pain" },
  { key: "budget_capacity", label: "radar.budget" },
];

const CX = 170;
const CY = 168;
const R = 100;

function point(index: number, radius: number): [number, number] {
  const angle = (Math.PI * 2 * index) / DIMS.length - Math.PI / 2;
  return [CX + Math.cos(angle) * radius, CY + Math.sin(angle) * radius];
}

export default function RadarChart({ scores }: { scores: Scores }) {
  const { t } = useI18n();

  const rings = [0.25, 0.5, 0.75, 1];
  const dataPoints = DIMS.map((dim, index) =>
    point(index, (Math.max(0, Math.min(100, scores[dim.key])) / 100) * R)
  );
  const polygon = dataPoints.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <div className="mx-auto w-full max-w-[340px]">
      <svg viewBox="0 0 340 340" className="h-auto w-full" role="img" aria-label="Assessment radar chart">
        {rings.map((ratio) => (
          <polygon
            key={ratio}
            points={DIMS.map((_, index) => point(index, R * ratio).join(",")).join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        ))}

        {DIMS.map((dim, index) => {
          const [x, y] = point(index, R);
          return (
            <line
              key={dim.key}
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
          );
        })}

        <polygon
          points={polygon}
          fill="rgba(34,211,238,0.18)"
          stroke="#22D3EE"
          strokeWidth={2}
        />

        {dataPoints.map(([x, y], index) => (
          <circle key={DIMS[index].key} cx={x} cy={y} r={3.5} fill="#67E8F9" />
        ))}

        {DIMS.map((dim, index) => {
          const [x, y] = point(index, R + 28);
          const anchor =
            Math.abs(x - CX) < 6 ? "middle" : x > CX ? "start" : "end";
          return (
            <g key={dim.key}>
              <text
                x={x}
                y={y}
                textAnchor={anchor}
                fontSize={10}
                fill="#94a3b8"
              >
                {t(dim.label)}
              </text>
              <text
                x={x}
                y={y + 12}
                textAnchor={anchor}
                fontSize={9.5}
                fontWeight={700}
                fill="#e2e8f0"
              >
                {scores[dim.key]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
