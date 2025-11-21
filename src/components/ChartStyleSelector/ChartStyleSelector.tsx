import { type FC, useState, useRef, useEffect } from "react";
import styles from "./ChartStyleSelector.module.css";

export type ChartStyle = "line" | "smooth" | "area";

interface ChartStyleSelectorProps {
  selectedStyle: ChartStyle;
  onChange: (style: ChartStyle) => void;
}

export const ChartStyleSelector: FC<ChartStyleSelectorProps> = ({
  selectedStyle,
  onChange,
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

  const options: { value: ChartStyle; label: string }[] = [
    { value: "line", label: "Line" },
    { value: "smooth", label: "Smooth" },
    { value: "area", label: "Area" },
  ];

  const handleSelect = (style: ChartStyle) => {
    onChange(style);
    setIsOpen(false);
  };

  const getDisplayLabel = () => {
    const option = options.find((opt) => opt.value === selectedStyle);
    return option ? option.label : "Line";
  };

  return (
    <div className={styles.container} ref={popoverRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        Chart Style: {getDisplayLabel()}
        <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className={styles.popover}>
          <div className={styles.popoverContent}>
            {options.map((option) => (
              <button
                key={option.value}
                className={`${styles.option} ${
                  selectedStyle === option.value ? styles.active : ""
                }`}
                onClick={() => handleSelect(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
