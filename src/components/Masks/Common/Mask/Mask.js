import React, { useEffect, useRef } from "react";
import styles from "./Mask.module.scss";
import cn from "classnames";

export function Mask({
  actions,
  renderForm,
  isActive,
  closeForm,
  ...restProps
}) {
  const maskRef = useRef(null);

  const handleClickOutside = (event) => {
    const target = event.target;

    const isCardClick =
      maskRef.current?.parentElement &&
      maskRef.current?.parentElement.contains(target);

    if (!isCardClick && isActive) {
      // closeForm();
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [maskRef.current, isActive]);

  return (
    <>
      <div
        className={cn(styles.mask, { [styles.active]: isActive })}
        ref={maskRef}
        {...restProps}
      >
        <div className={styles.actions}>
          {actions.map(({ ...actionProps }) => (
            <button {...actionProps} />
          ))}
        </div>
      </div>
      {renderForm()}
    </>
  );
}
