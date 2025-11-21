import { formatDate } from "../../utils/format-date";
import styles from "./ChartTooltip.module.css";

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    dataKey?: string;
    name?: string;
  }>;
  label?: string;
  colorMap: Map<string, string>;
}

export const ChartTooltip = ({ active, payload, label, colorMap }: ChartTooltipProps) => {
  if (!active || !payload || !payload.length || !label) {
    return null;
  }

  const sortedPayload = [...payload].sort((a, b) => {
    const aValue = typeof a.value === "number" ? a.value : 0;
    const bValue = typeof b.value === "number" ? b.value : 0;
    return bValue - aValue;
  });

  const maxValue = sortedPayload[0]?.value;

  return (
    <div className={styles.tooltip}>
      <div className={styles.header}>
        <span className={styles.calendarIcon}>📅</span>
        <span className={styles.date}>{formatDate(label)}</span>
      </div>
      <div className={styles.content}>
        {sortedPayload.map((entry) => {
          const color = colorMap.get(entry.dataKey as string) || "#000";
          const value = typeof entry.value === "number" ? entry.value : 0;
          const isMax = value === maxValue;

          return (
            <div key={entry.dataKey} className={styles.item}>
              <div className={styles.itemLeft}>
                <span
                  className={styles.bullet}
                  style={{ backgroundColor: color }}
                />
                <span className={styles.name}>{entry.name}</span>
              </div>
              <div className={styles.itemRight}>
                <span className={styles.value}>{value.toFixed(2)}%</span>
                {isMax && <span className={styles.badge}>TOP</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
