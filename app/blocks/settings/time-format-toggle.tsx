import classnames from "classnames";
import style from "./time-format-toggle.module.css";

export interface TimeFormatToggleProps {
  className?: string;
  value: "12h" | "24h";
  onChange: (format: "12h" | "24h") => void;
}

export function TimeFormatToggle({ className, value, onChange }: TimeFormatToggleProps) {
  return (
    <div className={classnames(style.root, className)}>
      <div className={style.sectionTitle}>Time Format</div>
      <p className={style.sectionDesc}>Choose how prayer times are displayed throughout the app.</p>
      <div className={style.options} role="radiogroup" aria-label="Time format selection">
        <div
          className={classnames(style.option, value === "12h" && style.optionSelected)}
          onClick={() => onChange("12h")}
          role="radio"
          aria-checked={value === "12h"}
          aria-label="12-hour format (AM/PM)"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onChange("12h")}
        >
          <div className={style.preview}>5:30 PM</div>
          <div className={style.label}>12-Hour</div>
          <div className={style.subLabel}>AM / PM format</div>
        </div>
        <div
          className={classnames(style.option, value === "24h" && style.optionSelected)}
          onClick={() => onChange("24h")}
          role="radio"
          aria-checked={value === "24h"}
          aria-label="24-hour format (military)"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onChange("24h")}
        >
          <div className={style.preview}>17:30</div>
          <div className={style.label}>24-Hour</div>
          <div className={style.subLabel}>Military format</div>
        </div>
      </div>
    </div>
  );
}
