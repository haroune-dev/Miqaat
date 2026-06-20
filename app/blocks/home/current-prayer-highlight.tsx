import { AlertTriangle, CircleDot } from "lucide-react";
import classnames from "classnames";
import { useAppContext } from "~/context/app-context";
import { useLanguage } from "~/i18n/language-context";
import { usePrayerStatus } from "~/hooks/use-prayer-status";
import type { TranslationKey } from "~/i18n/translations";
import style from "./current-prayer-highlight.module.css";
import { formatTime } from "~/utils/time-utils";
import { renderPrayerIcon } from "./prayer-icons";


export interface CurrentPrayerHighlightProps {
  className?: string;
}

export function CurrentPrayerHighlight({ className }: CurrentPrayerHighlightProps) {
  const { currentPrayer, prayerTimes } = useAppContext();
  const { t } = useLanguage();
  const prayerStatus = usePrayerStatus(prayerTimes);

  if (!currentPrayer) return null;

  const prayerKey = `prayer.${currentPrayer.name}` as TranslationKey;
  let displayName = t(prayerKey);
  let displayIcon = renderPrayerIcon(currentPrayer.icon);

  if (prayerStatus === "forbidden") {
    displayName = t("home.forbiddenPrayer");
    displayIcon = <AlertTriangle size={28} />;
  } else if (prayerStatus === "duha") {
    displayName = t("home.duha");
    displayIcon = renderPrayerIcon("sun-dim");
  }

  return (
    <div className={classnames(style.root, "transition-all duration-300 hover:shadow-xl hover:-translate-y-1", className)}>
      <div className={style.header}>
        <CircleDot size={18} aria-hidden="true" />
        <span className={style.headerLabel}>{t("home.currentPrayer")}</span>
      </div>

      <div className={style.content}>
        <div className={style.iconWrapper}>
          {displayIcon}
        </div>
        <div className={classnames(style.name, {
          [style.forbiddenName]: prayerStatus === "forbidden"
        })}>{displayName}</div>
      </div>

      {prayerStatus !== "forbidden" && (
        <div className={style.footer}>
          <div className={style.timeLabel}>{t("home.prayerTime")}</div>
          <div className={style.time}>
            <span dir="ltr">{formatTime(currentPrayer.time)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
