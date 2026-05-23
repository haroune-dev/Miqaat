import { MapPin, Loader, CheckCircle, Search, ChevronDown } from "lucide-react";
import classnames from "classnames";
import { useState, useRef, useEffect } from "react";
import type { Wilaya } from "~/data/prayer-data";
import { useLanguage } from "~/i18n/language-context";
import styles from "./wilaya-baladiya-selector.module.css";

export interface WilayaSelectorProps {
  className?: string;
  wilayas: Wilaya[];
  selectedWilaya: Wilaya | null;
  isLoadingWilayas: boolean;
  onWilayaChange: (wilaya: Wilaya) => void;
  onConfirm: () => void;
  canConfirm: boolean;
  fetchError: string | null;
  onRetry: () => void;
  onClear: () => void;
  hideConfirm?: boolean;
}

export function WilayaSelector({
  className,
  wilayas,
  selectedWilaya,
  isLoadingWilayas,
  onWilayaChange,
  onConfirm,
  canConfirm,
  fetchError,
  onRetry,
  onClear,
  hideConfirm = false,
}: WilayaSelectorProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredWilayas = wilayas.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.nameAr.includes(searchQuery) ||
      w.id.toString().includes(searchQuery),
  );

  return (
    <div className={classnames(styles.root, className)}>
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="wilaya-select-trigger">
          <span className={styles.labelIcon} aria-hidden="true">
            <MapPin size={18} />
          </span>
          {t("location.wilaya.label")}
        </label>

        {isLoadingWilayas ? (
          <div className={styles.loadingText}>
            {t("location.wilaya.loading")}
            <Loader size={14} className={styles.spinner} />
          </div>
        ) : (
          <div className={styles.dropdown} ref={dropdownRef}>
            <button
              id="wilaya-select-trigger"
              type="button"
              className={classnames(styles.trigger, isOpen && styles.triggerOpen)}
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
            >
              <span className={styles.triggerText}>
                {selectedWilaya
                  ? `${selectedWilaya.id}. ${selectedWilaya.name} (${selectedWilaya.nameAr})`
                  : t("location.wilaya.placeholder")}
              </span>
              <ChevronDown
                size={20}
                className={classnames(styles.chevron, isOpen && styles.chevronOpen)}
                aria-hidden="true"
              />
            </button>

            {isOpen && (
              <div className={styles.menu} role="listbox">
                <div className={styles.searchWrap}>
                  <div className={styles.searchField}>
                    <Search size={16} className={styles.searchIcon} aria-hidden="true" />
                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder={t("location.wilaya.search")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
                <div className={styles.list}>
                  {filteredWilayas.length > 0 ? (
                    filteredWilayas.map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        role="option"
                        aria-selected={selectedWilaya?.id === w.id}
                        className={classnames(
                          styles.item,
                          selectedWilaya?.id === w.id && styles.itemSelected,
                        )}
                        onClick={() => {
                          onWilayaChange(w);
                          setIsOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <span className={styles.itemId}>
                          {w.id}. {w.name}
                        </span>
                        <span className={styles.itemName}>{w.nameAr}</span>
                      </button>
                    ))
                  ) : (
                    <div className={styles.empty}>{t("location.wilaya.noResults")}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {fetchError && (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{fetchError}</p>
            <button type="button" className={styles.retryBtn} onClick={onRetry}>
              {t("error.retry")}
            </button>
          </div>
        )}
      </div>

      {canConfirm && !hideConfirm && (
        <div className={styles.confirmActions}>
          <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
            <CheckCircle size={20} aria-hidden="true" />
            <span>{t("location.confirm")}</span>
          </button>
          {onClear && (
            <button type="button" className={styles.clearBtn} onClick={onClear}>
              {t("location.clear")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
