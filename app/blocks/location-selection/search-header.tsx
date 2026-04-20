import classnames from "classnames";
import style from "./search-header.module.css";

export interface SearchHeaderProps {
  className?: string;
}

export function SearchHeader({ className }: SearchHeaderProps) {
  return (
    <div className={classnames(style.root, className)}>
      <h1 className={style.title}>Choose Location</h1>
      <p className={style.subtitle}>Select your Wilaya and Baladiya in Algeria to get accurate prayer times.</p>
    </div>
  );
}
