import styles from './App.module.css';
import rawData from "./data/data.json";
import { useData } from "./hooks/useData";
import { useTheme } from "./hooks/useTheme";
import type { RawFile } from "./types";
import { Chart } from "./components/Chart/Chart";
import { VariationSelector } from "./components/VariationSelector/VariationSelector";
import { DateRangeSelector } from "./components/DateRangeSelector/DateRangeSelector";
import { ChartStyleSelector, type ChartStyle } from "./components/ChartStyleSelector/ChartStyleSelector";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import { ExportButton } from "./components/ExportButton/ExportButton";
import { useState, useMemo, useRef } from "react";

function App() {
  const data = useData(rawData as RawFile);
  const { theme, toggleTheme } = useTheme();
  const chartRef = useRef<HTMLDivElement>(null);

  const variations = useMemo(() => {
    const uniqueVariations = new Map<number, string>();
    data.forEach((d) => {
      if (!uniqueVariations.has(d.variationId)) {
        uniqueVariations.set(d.variationId, d.variationName);
      }
    });
    return Array.from(uniqueVariations.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [data]);

  const { minDate, maxDate } = useMemo(() => {
    if (data.length === 0) return { minDate: undefined, maxDate: undefined };
    const dates = data.map((d) => d.date).sort();
    return {
      minDate: dates[0],
      maxDate: dates[dates.length - 1],
    };
  }, [data]);

  const [activeVariations, setActiveVariations] = useState<number[]>(() =>
    variations.map((v) => v.id)
  );

  const [dateRange, setDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({ startDate: null, endDate: null });

  const [chartStyle, setChartStyle] = useState<ChartStyle>("smooth");

  const filteredData = useMemo(() => {
    return data.filter((point) => {
      if (dateRange.startDate && point.date < dateRange.startDate) {
        return false;
      }
      if (dateRange.endDate && point.date > dateRange.endDate) {
        return false;
      }
      return true;
    });
  }, [data, dateRange]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Conversion Rate Chart</h1>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      <div className={styles.filters}>
        <div>
          <VariationSelector
            variations={variations}
            activeVariations={activeVariations}
            onChange={setActiveVariations}
          />

          <DateRangeSelector
            dateRange={dateRange}
            onChange={setDateRange}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
        <div className={styles.rightFilters}>
          <ChartStyleSelector
            selectedStyle={chartStyle}
            onChange={setChartStyle}
          />
          <ExportButton chartRef={chartRef} />
        </div>
      </div>

      <Chart ref={chartRef} data={filteredData} activeVariations={activeVariations} chartStyle={chartStyle} />
    </div>
  );
}

export default App;
