import { forwardRef } from "react";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
} from "recharts";
import type { ChartPoint } from "../../types";
import { formatDate } from "../../utils/format-date";
import styles from "./Chart.module.css";
import type { ChartStyle } from "../ChartStyleSelector/ChartStyleSelector";
import { ChartTooltip } from "./ChartTooltip";

type Props = {
  data: ChartPoint[];
  activeVariations: number[];
  chartStyle: ChartStyle;
};

const COLOR_PALETTE = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

const getColor = (index: number): string => {
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
};

export const Chart = forwardRef<HTMLDivElement, Props>(
  ({ data, activeVariations, chartStyle }, ref) => {
    const grouped = groupByDate(data, activeVariations);
    console.log(grouped)

    const lineType = chartStyle === "smooth" ? "monotone" : "linear";
    const isArea = chartStyle === "area";

    // Create color map for tooltip
    const colorMap = new Map<string, string>();
    activeVariations.forEach((id, index) => {
      colorMap.set(String(id), getColor(index));
    });

    return (
      <div ref={ref} className={styles.chartContainer}>
      <ResponsiveContainer>
        {isArea ? (
          <AreaChart data={grouped}>
            <CartesianGrid strokeDasharray="10" horizontal={false} />
            <XAxis dataKey="date" tickFormatter={(v) => formatDate(v, { showYear: false })} />
            <YAxis tickFormatter={(v) => `${v.toFixed(1)}%`} />

            <Tooltip content={<ChartTooltip colorMap={colorMap} />} />
            {activeVariations.map((id, index) => {
              const color = getColor(index);
              return (
                <Area
                  key={id}
                  type={lineType}
                  dataKey={String(id)}
                  name={`Variation ${id}`}
                  stroke={color}
                  fill={color}
                  strokeWidth={2}
                  fillOpacity={0.2}
                  dot={false}
                />
              );
            })}
          </AreaChart>
        ) : (
          <LineChart data={grouped}>
            <CartesianGrid strokeDasharray="10" horizontal={false} />

            <XAxis dataKey="date" tickFormatter={(v) => formatDate(v, { showYear: false })} />
            <YAxis tickFormatter={(v) => `${v.toFixed(1)}%`} />

            <Tooltip content={<ChartTooltip colorMap={colorMap} />} />

            {activeVariations.map((id, index) => {
              const color = getColor(index);
              return (
                <Line
                  key={id}
                  type={lineType}
                  dataKey={String(id)}
                  name={`Variation ${id}`}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                />
              );
            })}
          </LineChart>)}
      </ResponsiveContainer>
    </div>
    );
  }
);

function groupByDate(data: ChartPoint[], active: number[]) {
  const map = new Map<string, any>();

  for (const p of data) {
    if (!active.includes(p.variationId)) continue;

    if (!map.has(p.date)) {
      map.set(p.date, { date: p.date });
    }
    map.get(p.date)[p.variationId] = p.conversionRate;
  }

  return Array.from(map.values());
}
