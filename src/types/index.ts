export type Variation = {
  id: number;
  name: string;
};

export type RawDayData = {
  date: string;
  visits: Record<string, number>;
  conversions: Record<string, number>;
};

export type RawFile = {
  variations: Array<{ id?: number; name: string }>;
  data: RawDayData[];
};

export type ChartPoint = {
  date: string;               // "2025-01-01"
  variationId: number;        // 0 | 10001 | 10002 | 10003
  variationName: string;
  conversionRate: number;     // %
};
