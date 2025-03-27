"use client";

import React from "react";
import styles from "./Slide.module.scss";
import { CardFlag } from "../../../../common/components/CardFlag";
import cn from "classnames";
import { Shave } from "../../../../common/components/Shave";
import { useResponsive } from "../../../../common/hooks/useResponsive";
import LiveCounter from "./LiveCounter/LiveCounter";
import { TimeCounter } from "../../../../common/components/TimeCounter";

export function Slide({
  children,
  bannerSrc,
  flag,
  style,
  className,
  language,
  isSmall = false,
}) {
  const bgStyle = {
    background: `linear-gradient(to right, #29394d, #29394db2, #29394d00), url(${bannerSrc}) center/cover`,
    ...style,
  };

  const header = React.Children.toArray(children).find(
    (child) => child.type === Header
  );
  const body = React.Children.toArray(children).find(
    (child) => child.type === Body
  );
  const footer = React.Children.toArray(children).find(
    (child) => child.type === Footer
  );

  return (
    <div
      className={cn(
        !isSmall ? styles.wrapper : styles.wrapper_small,
        className
      )}
      style={bgStyle}
    >
      <CardFlag language={language} flag={flag} />
      <div className={styles.top}>
        {header}
        {body}
      </div>
      {footer}
    </div>
  );
}

const Header = ({
  title,
  link,
  label,
  children,
  theme,
  clientImg,
  type,
  titleStyle,
  showLiveBadge,
  showTimeCounter,
  startDateTime,
  endDateTime,
  language,
  openNewTab,
  isSmall,
  Link = "a",
  isVirtual = false,
}) => {
  const { isMobile } = useResponsive();

  return (
    <div className={styles.header}>
      <div className={styles.titles}>
        <div className={styles.label}>
          {!showLiveBadge ? (
            <div>
              {label && (
                <span className={cn(styles.text, styles[theme])}>{label}</span>
              )}
              {!isMobile && !isSmall && type === "CYCLE" && children}
            </div>
          ) : (
            <LiveCounter
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              language={language}
              isVirtual={isVirtual}
            />
          )}
          {clientImg && (
            <div className={styles.clientImg}>
              <img src={clientImg} alt="organization img" />
            </div>
          )}
        </div>
        {showTimeCounter && (
          <div className={styles.timeCounterWrapper}>
            <TimeCounter
              date={startDateTime}
              language={language}
              showDays={true}
            />
          </div>
        )}
        {(((isMobile || isSmall) && type === "CYCLE") || type !== "CYCLE") &&
          children}
        <Link
          className={styles.title}
          href={link}
          style={titleStyle}
          target={openNewTab ? "_blank" : "_self"}
          rel={openNewTab ? "noopener noreferrer" : undefined}
        >
          <Shave maxHeight={80}>{title}</Shave>
        </Link>
      </div>
    </div>
  );
};

const Body = ({ children, className }) => {
  return <div className={cn(styles.body, className)}>{children}</div>;
};

const Footer = ({ children, className }) => {
  return <div className={cn(styles.footer, className)}>{children}</div>;
};

Slide.Header = Header;
Slide.Body = Body;
Slide.Footer = Footer;

export default Slide;
