"use client";

import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
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

const PALETTE = {
  dark: {
    grid: "rgba(255,255,255,0.08)",
    fill: "rgba(34,211,238,0.18)",
    stroke: "#22D3EE",
    dot: "#67E8F9",
    label: "#94A3B8",
    value: "#E2E8F0",
  },
  light: {
    grid: "rgba(15,23,42,0.12)",
    fill: "rgba(14,116,144,0.14)",
    stroke: "#0E7490",
    dot: "#0891B2",
    label: "#475569",
    value: "#0F172A",
  },
} as const;

function point(index: number, radius: number): [number, number] {
  const angle = (Math.PI * 2 * index) / DIMS.length - Math.PI / 2;
  return [CX + Math.cos(angle) * radius, CY + Math.sin(angle) * radius];
}

export default function RadarChart({ scores }: { scores: Scores }) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const colors = PALETTE[theme];

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
            stroke={colors.grid}
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
              stroke={colors.grid}
              strokeWidth={1}
            />
          );
        })}

        <polygon
          points={polygon}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={2}
        />

        {dataPoints.map(([x, y], index) => (
          <circle key={DIMS[index].key} cx={x} cy={y} r={3.5} fill={colors.dot} />
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
                fill={colors.label}
              >
                {t(dim.label)}
              </text>
              <text
                x={x}
                y={y + 12}
                textAnchor={anchor}
                fontSize={9.5}
                fontWeight={700}
                fill={colors.value}
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
