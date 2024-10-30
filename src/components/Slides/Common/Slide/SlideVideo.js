"use client";

import React, { useRef, useState } from "react";
import styles from "./Slide.module.scss";
import cn from "classnames";
import { Shave } from "../../../../common/components/Shave";
import IconPlay from "../../../Icons/IconPlay";

const bgStyle = {
  background: "#000",
  display: "flex",
  justifyContent: "center",
  borderRadius: "14px",
  position: "relative",
  overflow: "hidden",
  width: "100%",
  height: "344px",
};
const textStyle = {
  position: "absolute",
  top: "0",
  left: "0",
  color: "white",
};

export function SlideVideo({ title, description, videoUrl, isSmall }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const handlePlay = () => {
    if (videoRef.current) {
      setIsPlaying(true);
      videoRef.current.play();
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      setIsPlaying(false);
      videoRef.current.pause();
    }
  };
  return (
    <div style={bgStyle}>
      <video
        ref={videoRef}
        src={videoUrl}
        height="100%"
        controls
        onPlay={handlePlay}
        onPause={handleStop}
      ></video>
      {!isPlaying && (
        <div className={styles.wrapper} style={textStyle}>
          <div className={styles.top}>
            <div className={styles.header}>
              <div className={styles.titles}>
                <div className={styles.title}>
                  <Shave maxHeight={!isSmall ? 125 : 65}>{title}</Shave>
                </div>
              </div>
            </div>

            <div className={styles.description}>
              <Shave maxHeight={120}>{description}</Shave>
            </div>
            <div onClick={handlePlay} className={styles.playButton}>
              <IconPlay />
            </div>
          </div>
        </div>
      )}
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
  isSmall,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.titles}>
        <div className={styles.label}>
          {label && (
            <span className={cn(styles.text, styles[theme])}>{label}</span>
          )}
          {clientImg && (
            <div className={styles.clientImg}>
              <img src={clientImg} alt="organization img" />
            </div>
          )}
        </div>
        {children}
        <a
          className={styles.title}
          href={onClick ? undefined : link}
          target={onClick ? undefined : "_blank"}
          rel={onClick ? undefined : "noopener noreferrer"}
          onClick={onClick ? () => onClick(id, type, pathname) : undefined}
        >
          <Shave maxHeight={!isSmall ? 125 : 65}>{title}</Shave>
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

SlideVideo.Header = Header;
SlideVideo.Body = Body;
SlideVideo.Footer = Footer;

export default SlideVideo;
