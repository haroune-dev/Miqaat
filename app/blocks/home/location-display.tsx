import { MapPin, Globe } from "lucide-react";
import classnames from "classnames";
import { useState, useRef, useCallback, useEffect } from "react";
import { useAppContext } from "~/context/app-context";
import { useLanguage } from "~/i18n/language-context";
import style from "./location-display.module.css";

export interface LocationDisplayProps {
  className?: string;
  isModalOpen?: boolean;
  onOpenModal: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

export function LocationDisplay({ className, isModalOpen, onOpenModal, buttonRef }: LocationDisplayProps) {
  const { location } = useAppContext();
  const { t, locale } = useLanguage();
  const [animState, setAnimState] = useState<"idle" | "complete">("idle");
  const innerRef = useRef<HTMLDivElement>(null);
  const prevLocationRef = useRef(location);
  const awaitingChangeRef = useRef(false);
  const prevModalOpenRef = useRef(!!isModalOpen);

  const city = locale === "ar" ? location.cityAr || location.city : location.city;

  useEffect(() => {
    if (awaitingChangeRef.current && location !== prevLocationRef.current) {
      awaitingChangeRef.current = false;
      setAnimState("complete");
      setTimeout(() => setAnimState("idle"), 3000);
    }
    prevLocationRef.current = location;
  }, [location]);

  useEffect(() => {
    if (prevModalOpenRef.current && !isModalOpen && awaitingChangeRef.current) {
      awaitingChangeRef.current = false;
      setAnimState("idle");
    }
    prevModalOpenRef.current = !!isModalOpen;
  }, [isModalOpen]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (animState !== "idle") return;

      prevLocationRef.current = location;
      awaitingChangeRef.current = true;

      const rect = e.currentTarget.getBoundingClientRect();
      const ripple = document.createElement("div");
      ripple.className = style.ripple;
      ripple.style.setProperty("--ripple-x", `${e.clientX - rect.left}px`);
      ripple.style.setProperty("--ripple-y", `${e.clientY - rect.top}px`);
      innerRef.current?.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);

      onOpenModal();
    },
    [animState, location, onOpenModal]
  );

  return (
    <div className={classnames(style.root, className)}>
      <div className={style.locationLink}>
        <div className={style.icon} aria-hidden="true">
          <MapPin size={22} strokeWidth={2.25} />
        </div>
        <div className={style.text}>
          <span className={style.label}>{t("location.current")}</span>
          <span className={style.city}>{city}</span>
        </div>
      </div>

      <span className={style.divider} aria-hidden="true" />

      <button
        ref={buttonRef}
        onClick={handleClick}
        className={classnames(style.animBtn, animState === "complete" && style.isComplete)}
      >
        <div ref={innerRef} className={style.animInner}>
          <div className={style.animIcon}>
            <Globe size={24} strokeWidth={2.25} />
          </div>
          <div className={style.animText}>
            <span className={style.textDesktop}>
              {animState === "complete" ? t("location.doneFull") : t("location.change")}
            </span>
            <span className={style.textMobile}>{t("location.changeShort")}</span>
          </div>
        </div>
      </button>
    </div>
  );
}
