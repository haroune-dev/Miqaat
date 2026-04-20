import classnames from "classnames";
import styles from "./loading-skeleton.module.css";

export interface LoadingSkeletonProps {
  className?: string;
  /** Number of skeleton rows to render */
  rows?: number;
}

export function LoadingSkeleton({ className, rows = 6 }: LoadingSkeletonProps) {
  return (
    <div className={classnames(styles.root, className)} aria-label="Loading content" role="status">
      <div className={classnames(styles.bar, styles.barShort)} />
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={classnames(
            styles.bar,
            i % 3 === 0 ? styles.barTall : styles.barMedium
          )}
        />
      ))}
    </div>
  );
}
