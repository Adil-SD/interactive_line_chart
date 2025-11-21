import { useMemo } from "react";
import type { RawFile, ChartPoint } from "../types";

export function useData(raw: RawFile) {
  return useMemo<ChartPoint[]>(() => {
    const variations = raw.variations.map((v) => ({
      id: v.id ?? 0,
      name: v.name,
    }));

    const variationMap = new Map<number, string>();
    for (const v of variations) {
      variationMap.set(v.id, v.name);
    }

    const result: ChartPoint[] = [];

    for (const day of raw.data) {
      const date = day.date;

      for (const [key, visits] of Object.entries(day.visits)) {
        const variationId = Number(key);
        const conversions = day.conversions[key] ?? 0;

        const conversionRate =
          visits > 0 ? (conversions / visits) * 100 : 0;

        result.push({
          date,
          variationId,
          variationName: variationMap.get(variationId) ?? "Unknown",
          conversionRate,
        });
      }
    }

    return result;
  }, [raw]);
}
