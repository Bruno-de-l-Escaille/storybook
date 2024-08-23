import React from "react";
import Slide from "../Common/Slide/Slide";
import { getByLanguage } from "../../../utils";
import ActionButton from "../Common/ActionButton/ActionButton";
import { Fetching } from "../Common/Slide/Fetching";
import styles from "./CustomisedSlide.module.scss";
import { Shave } from "../../../common/components/Shave";

export const CustomisedSlide = ({ data, language, isFetching }) => {
  if (isFetching) {
    return <Fetching />;
  }
  const title = getByLanguage(data, "title", language);
  const description = getByLanguage(data, "description", language);
  const buttonText = getByLanguage(data, "buttonText", language);
  const hasButton = getByLanguage(data, "hasButton", language);
  const link = getByLanguage(data, "link", language);

  return (
    <Slide bannerSrc={data.image} className={styles.customisedSlide}>
      <Slide.Header label="" title={title} link={link} />
      <Slide.Body>
        <div className={styles.description}>
          <Shave maxHeight={120}>{description}</Shave>
        </div>
      </Slide.Body>
      {hasButton && (
        <Slide.Footer>
          <ActionButton name={buttonText} theme="lightBlue" link={link} />
        </Slide.Footer>
      )}
    </Slide>
  );
};
