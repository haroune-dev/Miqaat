import { MapPin, Building2, Loader, CheckCircle } from "lucide-react";
import classnames from "classnames";
import type { Wilaya, Baladiya } from "~/data/prayer-data";
import styles from "./wilaya-baladiya-selector.module.css";

export interface WilayaBaladiyaSelectorProps {
  className?: string;
  wilayas: Wilaya[];
  baladiyas: Baladiya[];
  selectedWilaya: Wilaya | null;
  selectedBaladiya: Baladiya | null;
  isLoadingWilayas: boolean;
  isLoadingBaladiyas: boolean;
  onWilayaChange: (wilaya: Wilaya) => void;
  onBaladiyaChange: (baladiya: Baladiya) => void;
  onConfirm: () => void;
  canConfirm: boolean;
}

export function WilayaBaladiyaSelector({
  className,
  wilayas,
  baladiyas,
  selectedWilaya,
  selectedBaladiya,
  isLoadingWilayas,
  isLoadingBaladiyas,
  onWilayaChange,
  onBaladiyaChange,
  onConfirm,
  canConfirm,
}: WilayaBaladiyaSelectorProps) {
  const handleWilayaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    const wilaya = wilayas.find((w) => w.id === id);
    if (wilaya) onWilayaChange(wilaya);
  };

  const handleBaladiyaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    const baladiya = baladiyas.find((b) => b.id === id);
    if (baladiya) onBaladiyaChange(baladiya);
  };

  return (
    <div className={classnames(styles.root, className)}>
      {/* Wilaya dropdown */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="wilaya-select">
          <MapPin size={16} className={styles.labelIcon} />
          Wilaya (Province)
        </label>
        {isLoadingWilayas ? (
          <div className={styles.loadingText}>
            <Loader size={14} className={styles.spinner} />
            Loading wilayas…
          </div>
        ) : (
          <select
            id="wilaya-select"
            className={styles.select}
            value={selectedWilaya?.id ?? ""}
            onChange={handleWilayaChange}
            aria-label="Select Wilaya (Province)"
          >
            <option value="" disabled>
              — Select a Wilaya —
            </option>
            {wilayas.map((w) => (
              <option key={w.id} value={w.id}>
                {w.id}. {w.name} ({w.nameAr})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Baladiya dropdown */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="baladiya-select">
          <Building2 size={16} className={styles.labelIcon} />
          Baladiya (Municipality)
        </label>
        {isLoadingBaladiyas ? (
          <div className={styles.loadingText}>
            <Loader size={14} className={styles.spinner} />
            Loading baladiyas…
          </div>
        ) : (
          <select
            id="baladiya-select"
            className={styles.select}
            value={selectedBaladiya?.id ?? ""}
            onChange={handleBaladiyaChange}
            disabled={!selectedWilaya || baladiyas.length === 0}
            aria-label="Select Baladiya (Municipality)"
          >
            <option value="" disabled>
              {selectedWilaya
                ? "— Select a Baladiya —"
                : "— Select a Wilaya first —"}
            </option>
            {baladiyas.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.nameAr})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Confirm button */}
      <button
        className={styles.confirmBtn}
        onClick={onConfirm}
        disabled={!canConfirm}
        aria-label="Confirm selected location"
      >
        <CheckCircle size={18} />
        Confirm Location
      </button>
    </div>
  );
}
