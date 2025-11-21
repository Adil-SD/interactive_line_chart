import type { FC } from "react";
import html2canvas from "html2canvas";
import styles from "./ExportButton.module.css";

interface ExportButtonProps {
  chartRef: React.RefObject<HTMLDivElement | null>;
}

export const ExportButton: FC<ExportButtonProps> = ({ chartRef }) => {
  const handleExport = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim() || '#ffffff',
        scale: 2, // Higher quality
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().split('T')[0];
        link.download = `conversion-rate-chart-${timestamp}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error('Failed to export chart:', error);
    }
  };

  return (
    <button
      className={styles.button}
      onClick={handleExport}
      type="button"
      title="Export chart as PNG"
    >
      📥 Export PNG
    </button>
  );
};
