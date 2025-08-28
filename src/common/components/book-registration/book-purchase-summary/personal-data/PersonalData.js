"use client";

import classNames from "classnames";
import React, { useState } from "react";
import { ReactComponent as ChevronIcon } from "../../assets/chevron-up.svg";
import styles from "../StepsSummary.module.scss";
import { I18N } from "../../../../../i18n";
import { SummaryBlock } from "../summary-block/SummaryBlock";
import { getUserAvatarUrl } from "../../../../../utils";
import { Avatar } from "../avatar";

function PersonalData({
  user,
  userInscriptionState,
  showDetails = true,
  language,
  isAdditionalRegistration,
}) {
  const [showMore, toggleShowMore] = useState(false);
  const translate = (text) => {
    return I18N[language][text];
  };

  const {
    firstName,
    lastName,
    mainEmail,
    mainPhone,
    birthday,
    organization,
    function: profession,
    membership,
  } = userInscriptionState ?? {};

  return (
    <div className="relative">
      <div
        className="flex-container"
        style={{
          justifyContent: "space-between",
          display: "flex",
          alignItems: "center",
        }}
      >
        <SummaryBlock
          title={translate("personalData")}
          empty={!userInscriptionState}
        />

        <div className="text-right">
          <button
            className={styles.showMore}
            onClick={() => toggleShowMore(!showMore)}
            type="button"
          >
            <ChevronIcon
              style={{ transform: !showMore ? "" : "rotate(180deg)" }}
            />
          </button>
        </div>
      </div>

      <div className={styles.container}>
        {userInscriptionState && user && (
          <div
            className="flex-container"
            style={{
              justifyContent: "space-between",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar
              url={getUserAvatarUrl(user) ?? ""}
              firstName={firstName ?? ""}
              lastName={lastName ?? ""}
              size={32}
              showInfos={false}
              className={styles.avatar}
            />
            <div className="flex-1">
              <div>
                <h3 className={classNames(styles.bigText, "m-b-0")}>
                  {`${firstName ?? ""} ${lastName ?? ""}`.trim()}
                </h3>
                <div className={styles.text}>{mainEmail}</div>
              </div>
              <div
                className={classNames(
                  styles.personalData,
                  showMore && styles.open,
                  styles.text,
                  "m-t-xs"
                )}
              >
                {mainPhone && (
                  <div>
                    {translate("phone")} : <strong>{mainPhone}</strong>
                  </div>
                )}
                {birthday && (
                  <div>
                    {translate("date_naissance")} : <strong>{birthday}</strong>
                  </div>
                )}
                {membership?.data?.certificationNumber && (
                  <div>
                    {translate("numItaa")} :{" "}
                    <strong>{membership?.data?.certificationNumber}</strong>
                  </div>
                )}
                {organization && (
                  <div className="greetings">
                    {translate("organisation")} :{" "}
                    <strong>{organization}</strong>
                  </div>
                )}
                {profession && (
                  <div className="greetings">
                    {translate("profession")} : <strong>{profession}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonalData;
