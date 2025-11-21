import { type FC, useState, useRef, useEffect } from "react";
import styles from "./DateRangeSelector.module.css";

interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

interface DateRangeSelectorProps {
  dateRange: DateRange;
  onChange: (dateRange: DateRange) => void;
  minDate?: string;
  maxDate?: string;
}

export const DateRangeSelector: FC<DateRangeSelectorProps> = ({
  dateRange,
  onChange,
  minDate,
  maxDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...dateRange, startDate: e.target.value || null });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...dateRange, endDate: e.target.value || null });
  };

  const handleClear = () => {
    onChange({ startDate: null, endDate: null });
  };

  const handlePreset = (preset: "7days" | "30days" | "all") => {
    if (preset === "all") {
      onChange({ startDate: null, endDate: null });
      setIsOpen(false);
      return;
    }

    const end = maxDate || new Date().toISOString().split("T")[0];
    const endDate = new Date(end);
    const startDate = new Date(endDate);

    if (preset === "7days") {
      startDate.setDate(startDate.getDate() - 6);
    } else if (preset === "30days") {
      startDate.setDate(startDate.getDate() - 29);
    }

    onChange({
      startDate: startDate.toISOString().split("T")[0],
      endDate: end,
    });
    setIsOpen(false);
  };

  const formatDisplayText = () => {
    if (!dateRange.startDate && !dateRange.endDate) {
      return "All dates";
    }
    if (dateRange.startDate && dateRange.endDate) {
      return `${dateRange.startDate} - ${dateRange.endDate}`;
    }
    if (dateRange.startDate) {
      return `From ${dateRange.startDate}`;
    }
    if (dateRange.endDate) {
      return `Until ${dateRange.endDate}`;
    }
    return "All dates";
  };

  return (
    <div className={styles.container} ref={popoverRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        Date Range
        <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className={styles.popover}>
          <div className={styles.popoverHeader}>
            <span className={styles.popoverTitle}>Select Date Range</span>
          </div>

          <div className={styles.popoverContent}>
            <div className={styles.presets}>
              <button
                onClick={() => handlePreset("7days")}
                className={styles.presetBtn}
                type="button"
              >
                Last 7 days
              </button>
              <button
                onClick={() => handlePreset("30days")}
                className={styles.presetBtn}
                type="button"
              >
                Last 30 days
              </button>
              <button
                onClick={() => handlePreset("all")}
                className={styles.presetBtn}
                type="button"
              >
                All time
              </button>
            </div>

            <div className={styles.divider} />

            <div className={styles.customRange}>
              <div className={styles.dateInput}>
                <label htmlFor="startDate">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  value={dateRange.startDate || ""}
                  onChange={handleStartDateChange}
                  min={minDate}
                  max={dateRange.endDate || maxDate}
                />
              </div>

              <div className={styles.dateInput}>
                <label htmlFor="endDate">End Date</label>
                <input
                  id="endDate"
                  type="date"
                  value={dateRange.endDate || ""}
                  onChange={handleEndDateChange}
                  min={dateRange.startDate || minDate}
                  max={maxDate}
                />
              </div>
            </div>

            <div className={styles.currentRange}>
              {formatDisplayText()}
            </div>

            {(dateRange.startDate || dateRange.endDate) && (
              <button
                onClick={handleClear}
                className={styles.clearBtn}
                type="button"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
