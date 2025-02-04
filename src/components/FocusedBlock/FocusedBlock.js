import React from "react";
import styles from "./FocusedBlock.module.scss";
import { EventSlide } from "../Slides/EventSlide/EventSlide";
import { CycleSlide } from "../Slides/CycleSlide/CycleSlide";
import { getByLanguage } from "../../utils";

export const FocusedBlock = ({
  events,
  cycles,
  language,
  env,
  isUserMember,
  isUserPremium,
  isFetching,
  queryParams = {},
  isMasterChaine,
}) => {
  const focusedEvents = events.slice(0, 4);
  const remainingBlocks = 4 - focusedEvents.length;
  const focusedCycles =
    remainingBlocks > 0 ? cycles.slice(0, remainingBlocks) : [];

  if (focusedEvents.length === 0 && focusedCycles.length === 0) {
    return null;
  }

  const renderFocusedBlock = () => {
    const blocks = [];

    const focusedElements = [
      ...focusedCycles.map((cycle) => ({
        ...cycle,
        elementType: "cycle",
      })),
      ...focusedEvents.map((event) => ({
        ...event,
        elementType: "event",
      })),
    ];

    const elementsCount = focusedElements.length;

    const containerStyles = {
      gridTemplateColumns:
        elementsCount === 1
          ? "100%"
          : elementsCount === 2
          ? "calc(50% - 10px) calc(50% - 10px)"
          : elementsCount === 3
          ? "calc(50% - 10px) calc(25% - 10px) calc(25% - 10px)"
          : "repeat(4, calc(25% - 15px))",
    };

    focusedElements.forEach((focusedElement, index) => {
      const focusTitle = getByLanguage(focusedElement, "focusTitle", language);
      const isEvent = focusedElement.elementType === "event";
      blocks.push(
        isEvent ? (
          <EventSlide
            event={focusedElement}
            language={language}
            isFetching={isFetching}
            env={env}
            isUserMember={isUserMember}
            isUserPremium={isUserPremium}
            queryParams={queryParams}
            focusTitle={focusTitle}
            isSmall={(elementsCount === 3 && index > 0) || elementsCount === 4}
            isMasterChaine={isMasterChaine}
          />
        ) : (
          <CycleSlide
            cycle={focusedElement}
            language={language}
            isFetching={isFetching}
            env={env}
            isUserMember={isUserMember}
            isUserPremium={isUserPremium}
            queryParams={queryParams}
            focusTitle={focusTitle}
            isSmall={(elementsCount === 3 && index > 0) || elementsCount === 4}
            isMasterChaine={isMasterChaine}
          />
        )
      );
    });

    return (
      <div className={styles.slidesContainer} style={containerStyles}>
        {blocks}
      </div>
    );
  };

  return <>{renderFocusedBlock()}</>;
};
