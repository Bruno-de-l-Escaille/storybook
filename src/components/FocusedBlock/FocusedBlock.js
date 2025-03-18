import React from "react";
import styles from "./FocusedBlock.module.scss";
import { EventSlide } from "../Slides/EventSlide/EventSlide";
import { CycleSlide } from "../Slides/CycleSlide/CycleSlide";
import {
  capFirstLetterInSentence,
  getByLanguage,
  parseJson,
} from "../../utils";
import moment from "moment";

const prepareFocusedItems = (events, cycles, language) => {
  const items = [
    ...cycles.map((cycle) => ({
      item: cycle,
      type: "cycle",
    })),
    ...events.map((event) => ({
      item: event,
      type: "event",
    })),
  ];

  const filteredItems = items.filter(({ item }) => {
    const focusConfig = parseJson(item.focusConfig);

    if (!focusConfig) {
      return false;
    }

    const position =
      focusConfig["position" + capFirstLetterInSentence(language)];
    if (position == 0) {
      return false;
    }

    const displayDate =
      focusConfig["displayDate" + capFirstLetterInSentence(language)];
    if (!displayDate) {
      return true;
    }

    return moment(displayDate).isAfter(moment());
  });

  const sortedItems = filteredItems.sort((a, b) => {
    const focusConfigA = parseJson(a.item.focusConfig);
    const focusConfigB = parseJson(b.item.focusConfig);

    const positionA =
      focusConfigA["position" + capFirstLetterInSentence(language)];
    const positionB =
      focusConfigB["position" + capFirstLetterInSentence(language)];

    return positionA - positionB;
  });

  return sortedItems.slice(0, 4);
};

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
  Link = "a",
  isAdmin,
  isOFFFcourse,
  token,
}) => {
  const focusedItems = prepareFocusedItems(events, cycles, language);

  const renderFocusedBlock = () => {
    const blocks = [];

    const focusedElements = focusedItems.map(({ item, type }) => ({
      ...item,
      elementType: type,
    }));

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
      const focusConfig = parseJson(focusedElement.focusConfig);
      const focusTitle = getByLanguage(focusConfig, "title", language) || " ";

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
            Link={Link}
            isAdmin={isAdmin}
            isOFFFcourse={isOFFFcourse}
            token={token}
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
            Link={Link}
            isAdmin={isAdmin}
            isOFFFcourse={isOFFFcourse}
            token={token}
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
