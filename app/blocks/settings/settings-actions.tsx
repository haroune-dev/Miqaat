import { useState } from "react";
import { CheckCircle } from "lucide-react";
import classnames from "classnames";
import style from "./settings-actions.module.css";

export interface SettingsActionsProps {
  className?: string;
  onSave: () => void;
  onReset: () => void;
}

export function SettingsActions({ className, onSave, onReset }: SettingsActionsProps) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={classnames(style.root, className)}>
      <div className={style.buttons}>
        <button className={style.saveBtn} onClick={handleSave} aria-label="Save settings">
          Save Settings
        </button>
        <button className={style.resetBtn} onClick={onReset} aria-label="Reset all settings to defaults">
          Reset to Defaults
        </button>
      </div>
      {saved && (
        <div className={style.successMsg} role="status">
          <CheckCircle size={16} />
          Settings saved successfully!
        </div>
      )}
    </div>
  );
}
