import classnames from "classnames";
import { CALCULATION_METHODS, type CalculationMethod } from "~/data/prayer-data";
import style from "./calculation-method-selector.module.css";

export interface CalculationMethodSelectorProps {
  className?: string;
  value: CalculationMethod;
  onChange: (method: CalculationMethod) => void;
}

export function CalculationMethodSelector({ className, value, onChange }: CalculationMethodSelectorProps) {
  return (
    <div className={classnames(style.root, className)}>
      <div className={style.sectionTitle}>Calculation Method</div>
      <p className={style.sectionDesc}>
        Select the prayer time calculation method that matches your region and Islamic school of thought.
      </p>
      <div className={style.options}>
        {CALCULATION_METHODS.map((method) => {
          const isSelected = value === method.id;
          return (
            <div
              key={method.id}
              className={classnames(style.option, isSelected && style.optionSelected)}
              onClick={() => onChange(method.id)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onChange(method.id)}
            >
              <div className={classnames(style.radio, isSelected && style.radioSelected)}>
                {isSelected && <div className={style.radioDot} />}
              </div>
              <div className={style.optionText}>
                <div className={style.optionName}>{method.name}</div>
                <div className={style.optionDesc}>{method.description}</div>
                <div className={style.optionRegion}>{method.region}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
