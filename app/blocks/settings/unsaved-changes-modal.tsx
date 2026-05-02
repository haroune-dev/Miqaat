import classnames from "classnames";
import { useLanguage } from "~/i18n/language-context";
import style from "./unsaved-changes-modal.module.css";
import { AlertCircle } from "lucide-react";

export interface UnsavedChangesModalProps {
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export function UnsavedChangesModal({ onSave, onDiscard, onCancel }: UnsavedChangesModalProps) {
  const { t } = useLanguage();

  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <div className={style.header}>
          <AlertCircle className={style.icon} size={24} />
          <h2 className={style.title}>
            {t("settings.unsavedChanges") || "Unsaved Changes"}
          </h2>
        </div>
        
        <p className={style.message}>
          {t("settings.unsavedChanges.message")}
        </p>
        
        <div className={style.actions}>
          <button onClick={onCancel} className={style.buttonCancel}>
            {t("settings.unsavedChanges.cancel")}
          </button>
          <div className={style.mainActions}>
            <button onClick={onDiscard} className={style.buttonDiscard}>
              {t("settings.unsavedChanges.discard")}
            </button>
            <button onClick={onSave} className={style.buttonSave}>
              {t("settings.unsavedChanges.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
