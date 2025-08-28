"use client";
import React from "react";
import cn from "classnames";

import style from "./BookAI.module.scss";
import CheckMarkIcon from "../Icons/CheckMarkv2";
import { I18N } from "../../i18n";
import { useEventBookRegistrationModal } from "../../common/components/modal/event-book-registration/use-event-book-registration-modal";

export default function BookAI({
  product,
  productsLength = 3,
  isBought,
  expireAt = "",
  organizationImage,
  language = "fr",
  token,
  user,
}) {
  const { openBookEventRegistrationModal } = useEventBookRegistrationModal();

  const TTP_OECCBB_URL_AI = "https://www.oeccbb.be/fr/ia";

  const showPaymentModal = () => {
    openBookEventRegistrationModal(token, product, user);
  };
  return (
    <div
      className={cn(
        productsLength == 1
          ? style.channel_book
          : productsLength == 2
          ? style.channel_two_book
          : style.channel_book_list,
        isBought ? style.bought : ""
      )}
    >
      {/* <div className={style.book_image} style={{ backgroundImage: `url(${product.thumbnail})` }}>
        {isMobile && (
          <div className={style.book_channel_avatar}>
            <img src={Book.communityprofile} alt="" className="src" />
          </div>
        )}
        </div> 
         */}
      <div className={style.book_image}>
        <img src={product.thumbnail} alt="" className="src" />
      </div>

      <div className={style.book_content}>
        <div
          className={style.book_channel_avatar}
          style={{ backgroundImage: `url(${organizationImage})` }}
        >
          {/* <img src={organizationImage} alt="" className="src" /> */}
        </div>

        <div className={style.book_title}>{product.title}</div>
        {Array.isArray(product.author) && (
          <div
            className={style.book_author_wrapper}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
              display: "inline-block", // important
            }}
          >
            {product.author.map((author) => author.full_name).join(", ")}
          </div>
        )}
        {!isBought ? (
          <div className={style.book_price}>
            {I18N[language].book.only} {product.unitPrice} €
          </div>
        ) : (
          <div className={style.book_bought}>
            <CheckMarkIcon />
            {I18N[language].book.bought}
          </div>
        )}
        <div className={style.book_action}>
          <div className={style.book_button_section}>
            <div className={style.book_button}>
              {isBought ? (
                <a
                  target="_blank"
                  rel="noreferrer"
                  className={style.book_access_button}
                  href={`${TTP_OECCBB_URL_AI}?token=${token}`}
                >
                  {I18N[language].book.accessAI}
                </a>
              ) : (
                <a
                  target="_blank"
                  rel="noreferrer"
                  className={style.book_buy_button}
                  onClick={showPaymentModal}
                >
                  {I18N[language].book.purchaseAccessToTheBookViaAI}
                </a>
              )}
            </div>
            <div className={style.book_version}>
              {!isBought
                ? `${I18N[language].book.untilTheReleaseOfTheVersion}`
                : `${I18N[language].book.accessExpiration} ${expireAt}`}
            </div>
          </div>
          <div className={style.book_paper}>
            {" "}
            <a
              target="_blank"
              rel="noreferrer"
              href={"https://taxandmanagement.be"}
            >
              {" "}
              {I18N[language].book.wantToBuyThePrintedVersion}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
