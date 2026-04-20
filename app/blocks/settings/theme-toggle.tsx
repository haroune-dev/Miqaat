import classnames from "classnames";
import { useColorScheme } from "@dazl/color-scheme/react";
import style from "./theme-toggle.module.css";

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { configScheme, setColorScheme } = useColorScheme();

  const options = [
    { id: "light" as const, label: "Light", emoji: "☀️", previewClass: style.previewLight },
    { id: "dark" as const, label: "Dark", emoji: "🌙", previewClass: style.previewDark },
    { id: "system" as const, label: "System", emoji: "💻", previewClass: style.previewSystem },
  ];

  return (
    <div className={classnames(style.root, className)}>
      <div className={style.sectionTitle}>Theme</div>
      <p className={style.sectionDesc}>Choose the app appearance. &ldquo;System&rdquo; follows your device settings.</p>
      <div className={style.options} role="radiogroup" aria-label="Theme selection">
        {options.map((opt) => (
          <div
            key={opt.id}
            className={classnames(style.option, configScheme === opt.id && style.optionSelected)}
            onClick={() => setColorScheme(opt.id)}
            role="radio"
            aria-checked={configScheme === opt.id}
            aria-label={`${opt.label} theme`}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setColorScheme(opt.id)}
          >
            <div className={classnames(style.previewBox, opt.previewClass)}>{opt.emoji}</div>
            <div className={style.label}>{opt.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
