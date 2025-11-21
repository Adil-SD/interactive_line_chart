import { type FC, useState, useRef, useEffect } from "react";
import styles from "./VariationSelector.module.css";

interface Variation {
  id: number;
  name: string;
}

interface VariationSelectorProps {
  variations: Variation[];
  activeVariations: number[];
  onChange: (variationIds: number[]) => void;
}

export const VariationSelector: FC<VariationSelectorProps> = ({
  variations,
  activeVariations,
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

  const handleToggle = (variationId: number) => {
    if (activeVariations.includes(variationId)) {
      onChange(activeVariations.filter((id) => id !== variationId));
    } else {
      onChange([...activeVariations, variationId]);
    }
  };

  const handleSelectAll = () => {
    onChange(variations.map((v) => v.id));
  };

  const handleDeselectAll = () => {
    onChange([]);
  };

  return (
    <div className={styles.container} ref={popoverRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        Select Variations
        <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className={styles.popover}>
          <div className={styles.popoverHeader}>
            <span className={styles.popoverTitle}>Variations</span>
            <div className={styles.popoverActions}>
              <button onClick={handleSelectAll} className={styles.actionBtn} type="button">
                Select All
              </button>
              <button onClick={handleDeselectAll} className={styles.actionBtn} type="button">
                Clear
              </button>
            </div>
          </div>

          <div className={styles.popoverContent}>
            {variations.map((variation) => (
              <label key={variation.id} className={styles.option}>
                <input
                  type="checkbox"
                  checked={activeVariations.includes(variation.id)}
                  onChange={() => handleToggle(variation.id)}
                />
                <span>{variation.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
