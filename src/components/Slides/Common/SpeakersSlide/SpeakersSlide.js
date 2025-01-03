import React, { useState } from "react";
import cn from "classnames";
import styles from "./SpeakersSlide.module.scss";
import { getUserNameForAvatar } from "../../../../utils";
import "swiper/swiper-bundle.min.css"; // Import Swiper styles
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
import ChevronRight from "../../../Icons/ChevronRight";
import ChevronLeft from "../../../Icons/ChevronLeft";

SwiperCore.use([Navigation]);

export const SpeakersSlide = ({ speakers, className }) => {
  const [swiper, setSwiper] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const size = 36;
  const slidesPerView = 3;

  const handlePrevClick = (event) => {
    event.stopPropagation();
    if (swiper) {
      swiper.slidePrev();
    }
  };

  const handleNextClick = (event) => {
    event.stopPropagation();
    if (swiper) {
      swiper.slideNext();
    }
  };

  const renderPrevButton = () => (
    <span
      className={cn(styles.arrow_button, styles.prev_button)}
      onClick={(event) => handlePrevClick(event)}
    >
      <ChevronLeft />
    </span>
  );

  const renderNextButton = () => (
    <span
      className={cn(styles.arrow_button, styles.next_button)}
      onClick={(event) => handleNextClick(event)}
    >
      <ChevronRight />
    </span>
  );

  const handleSlideChange = (swiperChanged) => {
    setCurrentSlideIndex(swiperChanged.activeIndex);
  };

  const swiperStyle = {
    width: "100%",
    maxWidth: "100%",
    maxHeight: "100vh",
    minHeight: "0",
    minWidth: "0",
    // CSS Grid/Flexbox bug size workaround
  };

  const renderSpeaker = (speaker) => {
    const firstName = speaker.firstName;
    const lastName = speaker.lastName;
    const avatarUrl = speaker.pictureUrl || speaker.avatarUrl;
    return (
      <span className={cn(styles.speaker)}>
        <div
          className={avatarUrl ? styles.avatar : styles.emptyAvatar}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            minWidth: `${size}px`,
            minHeight: `${size}px`,
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${firstName}-${lastName} avatar`}
              width={size - 4}
              height={size - 4}
              className={styles.image}
            />
          ) : (
            <span>{getUserNameForAvatar(firstName, lastName)}</span>
          )}
        </div>
        <div className={styles.infos}>
          <span className={styles.name}>{firstName}</span>
          <span className={styles.name}>{lastName}</span>
        </div>
      </span>
    );
  };

  return (
    <div className={cn(styles.slider_container, className)}>
      <div className={styles.swiper_wrapper}>
        {(swiper?.activeIndex ?? 0) > 0 && renderPrevButton()}
        <Swiper
          style={swiperStyle}
          slidesPerView={slidesPerView ?? "auto"}
          spaceBetween={10}
          onSwiper={setSwiper}
          onSlideChange={handleSlideChange}
        >
          {speakers.map((speaker, index) => (
            <SwiperSlide key={`speakers-${index}`}>
              {renderSpeaker(speaker)}
            </SwiperSlide>
          ))}
        </Swiper>
        {(swiper?.activeIndex ?? 0) < speakers?.length - slidesPerView &&
          renderNextButton()}
      </div>
    </div>
  );
};
