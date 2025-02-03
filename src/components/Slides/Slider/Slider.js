import React, { useEffect, useRef, useState } from "react";
import styles from "./Slider.module.scss";
import IconArrow from "../../Icons/IconArrow";
import cn from "classnames";

export const Slider = ({ cards, autoPlay = true, className }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const cardsRef = useRef(null);

  const getIndexPrev = (index) =>
    index - 1 < 0 ? cards.length - 1 : index - 1;
  const getIndexNext = (index) => (index + 1 >= cards.length ? 0 : index + 1);

  const prevIndex = cards.length > 2 ? getIndexPrev(activeIndex) : null;
  const nextIndex = cards.length > 1 ? getIndexNext(activeIndex) : null;

  const prevPrevIndex = cards.length > 3 ? getIndexPrev(prevIndex) : null;
  const nextNextIndex = cards.length > 3 ? getIndexNext(nextIndex) : null;

  useEffect(() => {
    let timerId;

    const isPageVisible = () => document.visibilityState === "visible";

    if (autoPlay && !isHovered && cards.length > 1 && isPageVisible()) {
      timerId = setTimeout(() => {
        setActiveIndex(nextIndex);
      }, 8000);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [autoPlay, activeIndex, isHovered]);

  if (!cards || cards.length === 0) {
    return null;
  }

  const renderArrow = (direction) => {
    if (cards.length <= 1 || (cards.length <= 2 && direction === "left")) {
      return null;
    }

    const onClick = () => {
      if (isTransitioning) {
        return;
      }

      setActiveIndex(direction === "left" ? prevIndex : nextIndex);

      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
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
                  index === prevPrevIndex && styles.prevPrevCard,
                  index === nextNextIndex && styles.nextNextCard,
                  ![
                    prevIndex,
                    activeIndex,
                    nextIndex,
                    prevPrevIndex,
                    nextNextIndex,
                  ].includes(index) && styles.hiddenCard
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
};
