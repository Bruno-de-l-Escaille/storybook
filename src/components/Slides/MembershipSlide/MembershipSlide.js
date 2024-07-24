import React from "react";
import Slide from "../Common/Slide/Slide";
import { getByLanguage } from "../../../utils";
import ActionButton from "../Common/ActionButton/ActionButton";
import { Fetching } from "../Common/Slide/Fetching";
import styles from "./MembershipSlide.module.scss";
import { Shave } from "../../../common/components/Shave";

export const MembershipSlide = ({ membership, language, isFetching }) => {
  if (isFetching) {
    return <Fetching />;
  }
  const name = getByLanguage(membership, "name", language);
  const description = getByLanguage(membership, "description", language);
  const labelText = getByLanguage(membership, "sliderLabel", language);
  const buttonText = getByLanguage(membership, "sliderText", language);

  return (
    <Slide
      bannerSrc="/img/slides/membership-banner.jpeg"
      className={styles.membershipSlide}
    >
      <Slide.Header
        label={name}
        title={labelText}
        link="https://membership.unitedassociates.be/offers"
      />
      <Slide.Body>
        <div className={styles.description}>
          <Shave maxHeight={120}>{description}</Shave>
        </div>
      </Slide.Body>
      <Slide.Footer>
        <ActionButton
          name={buttonText}
          theme="lightBlue"
          link="https://membership.unitedassociates.be/offers"
        />
      </Slide.Footer>
    </Slide>
  );
};
