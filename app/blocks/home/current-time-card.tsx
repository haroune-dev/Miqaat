import classnames from "classnames";
import { useClock } from "~/hooks/use-clock";
import { useAppContext } from "~/context/app-context";
import style from "./current-time-card.module.css";

export interface CurrentTimeCardProps {
  className?: string;
}

export function CurrentTimeCard({ className }: CurrentTimeCardProps) {
  const { timeFormat } = useAppContext();
  const { timeString, dateString, hijriDate } = useClock(timeFormat);

  return (
    <div className={classnames(style.root, className)}>
      <div className={style.timeWrapper}>
        <div className={style.time}>{timeString}</div>
        <div className={style.date}>{dateString}</div>
        <div className={style.hijri}>{hijriDate}</div>
      </div>
    </div>
  );
}
