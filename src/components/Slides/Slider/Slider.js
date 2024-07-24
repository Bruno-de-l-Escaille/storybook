import React, { useEffect, useRef, useState } from "react";
import styles from "./Slider.module.scss";
import IconArrow from "../../Icons/IconArrow";
import cn from "classnames";

export default function Slider({ cards, autoPlay = true, className }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardsRef = useRef(null);

  const prevIndex =
    cards.length > 2
      ? activeIndex - 1 < 0
        ? cards.length - 1
        : activeIndex - 1
      : null;
  const nextIndex =
    cards.length > 1
      ? activeIndex + 1 >= cards.length
        ? 0
        : activeIndex + 1
      : null;

  useEffect(() => {
    let timerId;

    if (autoPlay && !isHovered && cards.length > 1) {
      timerId = setTimeout(() => {
        setActiveIndex(nextIndex);
      }, 8000);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [autoPlay, activeIndex, isHovered]);

  useEffect(() => {
    cardsRef.current.addEventListener("mousedown", (e) => {
      const isPressed = true;
      const cursorX = e.offsetX - cards.offsetLeft;
      cardsRef.style.cursor = "grabbing";
    });
  }, [activeIndex]);

  const renderArrow = (direction) => {
    if (cards.length <= 1 || (cards.length <= 2 && direction === "left")) {
      return null;
    }

    const onClick = () => {
      setActiveIndex(direction === "left" ? prevIndex : nextIndex);
    };

    return (
      <div className={cn(styles.arrow, styles[direction])} onClick={onClick}>
        <IconArrow />
      </div>
    );
  };

  const renderDots = () => {
    return (
      <div className={styles.dots}>
        {cards.map((_, index) => {
          return (
            <div
              key={index}
              className={cn(
                styles.dot,
                index === activeIndex && styles.activeDot
              )}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={styles.container}
    >
      <div className={cn(styles.slider, className)}>
        {renderArrow("left")}
        <div className={styles.cards} ref={cardsRef}>
          {cards.map((card, index) => {
            return (
              <div
                className={cn(
                  styles.card,
                  index === prevIndex && styles.prevCard,
                  index === nextIndex && styles.nextCard,
                  index === activeIndex && styles.activeCard,
                  ![prevIndex, activeIndex, nextIndex].includes(index) &&
                    styles.hiddenCard
                )}
                key={index}
              >
                {card}
              </div>
            );
          })}
        </div>
        {renderArrow("right")}
      </div>
      <div className={cn(styles.sliderMobile, className)}>
        <div className={styles.cards}>
          {cards.map((card, index) => {
            return (
              <div
                className={cn(
                  styles.card,
                  index === prevIndex && styles.prevCard,
                  index === nextIndex && styles.nextCard,
                  index === activeIndex && styles.activeCard,
                  ![prevIndex, activeIndex, nextIndex].includes(index) &&
                    styles.hiddenCard
                )}
                key={index}
              >
                {card}
              </div>
            );
          })}
        </div>
        <div className={styles.actions}>
          {renderArrow("left")}
          {renderDots()}
          {renderArrow("right")}
        </div>
      </div>
    </div>
  );
}
