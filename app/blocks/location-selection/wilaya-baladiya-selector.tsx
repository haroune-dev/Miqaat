import { MapPin, Loader, CheckCircle, Search, ChevronDown } from "lucide-react";
import classnames from "classnames";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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

interface MenuPosition {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<MenuPosition>({ left: 0, width: 0 });

  const updateMenuPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const isMobile = window.innerWidth < 640;
    setMenuPos({
      ...(isMobile
        ? { bottom: window.innerHeight - rect.top + 8 }
        : { top: rect.bottom + 8 }),
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updateMenuPosition();

    window.addEventListener("scroll", updateMenuPosition, true);
    window.addEventListener("resize", updateMenuPosition);
    return () => {
      window.removeEventListener("scroll", updateMenuPosition, true);
      window.removeEventListener("resize", updateMenuPosition);
    };
  }, [isOpen, updateMenuPosition]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedTrigger = triggerRef.current?.contains(target);
      const clickedMenu = menuRef.current?.contains(target);
      if (!clickedTrigger && !clickedMenu) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const filteredWilayas = wilayas.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.nameAr.includes(searchQuery) ||
      w.id.toString().includes(searchQuery),
  );

  const dropdownMenu = isOpen
    ? createPortal(
        <div
          ref={menuRef}
          className={styles.menu}
          role="listbox"
          style={{
            top: menuPos.top,
            bottom: menuPos.bottom,
            left: menuPos.left,
            width: menuPos.width,
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.stopPropagation()}
        >
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
        </div>,
        document.body,
      )
    : null;

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
          <div className={styles.dropdown}>
            <button
              ref={triggerRef}
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
            {dropdownMenu}
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
