"use client";

import React from "react";
import styles from "./Slide.module.scss";
import { CardFlag } from "../../../../common/components/CardFlag";
import cn from "classnames";
import { Shave } from "../../../../common/components/Shave";
import { useResponsive } from "../../../../common/hooks/useResponsive";

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
  onClick,
  id,
  type,
  pathname,
  titleStyle,
}) => {
  const { isMobile } = useResponsive();

  const onLinkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(id, type, pathname);
    } else {
      window.open(link, "_blank", "noreferrer");
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.titles}>
        <div className={styles.label}>
          <div>
            {label && (
              <span className={cn(styles.text, styles[theme])}>{label}</span>
            )}
            {!isMobile && type === "CYCLE" && children}
          </div>
          {clientImg && (
            <div className={styles.clientImg}>
              <img src={clientImg} alt="organization img" />
            </div>
          )}
        </div>
        {((isMobile && type === "CYCLE") || type !== "CYCLE") && children}
        <a
          className={styles.title}
          href={link}
          onClick={onLinkClick}
          style={titleStyle}
        >
          <Shave maxHeight={80}>{title}</Shave>
        </a>
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
