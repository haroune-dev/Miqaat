import { useAppContext } from "~/context/app-context";
import type { CalculationMethod } from "~/data/prayer-data";
import { CalculationMethodSelector } from "../blocks/settings/calculation-method-selector";
import { TimeFormatToggle } from "../blocks/settings/time-format-toggle";
import { ThemeToggle } from "../blocks/settings/theme-toggle";
import { SettingsActions } from "../blocks/settings/settings-actions";
import styles from "./settings.module.css";

const DEFAULT_METHOD: CalculationMethod = "MWL";

const DEFAULT_LOCATION = {
  city: "Algiers",
  country: "Algeria",
  timezone: "Africa/Algiers",
  latitude: 36.75,
  longitude: 3.06,
};

export default function Settings() {
  const { calculationMethod, setCalculationMethod, timeFormat, setTimeFormat, setLocation } = useAppContext();

  const handleSave = () => {
    // Settings are already persisted reactively via context
  };

  const handleReset = () => {
    setCalculationMethod(DEFAULT_METHOD);
    setTimeFormat("12h");
    setLocation(DEFAULT_LOCATION);
  };

  return (
    <main className={styles.root}>
      <h1 className={styles.pageTitle}>Settings</h1>
      <CalculationMethodSelector
        value={calculationMethod}
        onChange={setCalculationMethod}
      />
      <TimeFormatToggle
        value={timeFormat}
        onChange={setTimeFormat}
      />
      <ThemeToggle />
      <SettingsActions onSave={handleSave} onReset={handleReset} />
    </main>
  );
}
