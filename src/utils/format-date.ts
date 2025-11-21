type FormatDateOptions = {
  showYear?: boolean;
  showMonth?: boolean;
  month?: "short" | "long" | "numeric";
  locale?: string;
};

export function formatDate(
  dateStr: string,
  {
    showYear = true,
    showMonth = true,
    month = "short",
    locale = "en-US",
  }: FormatDateOptions = {}
): string {
  const date = new Date(dateStr);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
  };

  if (showMonth) options.month = month;
  if (showYear) options.year = "numeric";

  return date.toLocaleDateString(locale, options);
}
