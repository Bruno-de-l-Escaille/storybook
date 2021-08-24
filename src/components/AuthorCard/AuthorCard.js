import React from "react";

import { IconFacebook, IconTwitter, IconLinkedin } from "../Icons";
import styles from "./AuthorCard.module.scss";
import { TTP_API_URL, SOCIAL_NETWORKS_HOSTS } from "../../config";
import { addLandaSize, getUserNameForAvatar } from "../../utils";
import { Fetching } from "./Fetching";
import { I18N } from "../../i18n";

export const AuthorCard = ({
  lng = "en",
  author = null,
  isFetching = false,
}) => {
  const renderAvatar = () => {
    const { avatar, avatarUrl } = author;

    if (avatar || avatarUrl)
      return (
        <div
          id={`avatar-${author.id}`}
          onClick={() => console.log("handle click")}
          className={styles.avatar}
          style={{
            backgroundImage: `url(${
              avatarUrl
                ? addLandaSize(avatarUrl, 260)
                : TTP_API_URL + "/" + avatar
            })`,
          }}
        ></div>
      );
    else
      return (
        <div
          id={`avatar-${author.id}`}
          onClick={() => console.log("handle click")}
          className={styles.avatar}
        >
          {getUserNameForAvatar(author.firstName, author.lastName)}
        </div>
      );
  };
  const renderSocialNetwork = (name) => {
    const { contactSocialNetworks } = author;

    if (!contactSocialNetworks) {
      return null;
    }

    let socialNetwork = contactSocialNetworks[name];

    if (socialNetwork) {
      let accessValue =
        name === "twitter" ? socialNetwork.username : socialNetwork.id;
      let snUrl =
        name === "linkedin"
          ? socialNetwork.publicProfileUrl
            ? socialNetwork.publicProfileUrl
            : ""
          : `${SOCIAL_NETWORKS_HOSTS[name.toUpperCase()]}/${accessValue}`;
      let icon = null;

      switch (name) {
        case "facebook":
          icon = <IconFacebook />;
          break;
        case "twitter":
          icon = <IconTwitter />;
          break;
        case "linkedin":
          icon = <IconLinkedin />;
          break;
        default:
          icon = null;
      }

      return (
        <li>
          <a
            href={`${snUrl}`}
            target="_blank"
            rel="noreferrer"
            className="m-xs"
          >
            {icon}
          </a>
        </li>
      );
    }

    return null;
  };
  const renderHeadline = () => {
    const { blogRoleInOrganization } = author;
    if (blogRoleInOrganization && blogRoleInOrganization.length > 0) {
      return <p>{I18N[lng][blogRoleInOrganization[0].role]}</p>;
    }
    return null;
  };

  if (isFetching) {
    return <Fetching />;
  } else {
    const { roles, contactSocialNetworks } = author;
    let organization = null;
    if (roles && roles.length > 0) {
      organization = roles[0].organization;
    }

    return (
      <div className={styles["author-card"]}>
        {renderAvatar()}
        <h3>
          <span>{author.firstName}</span>&nbsp; <span>{author.lastName}</span>
        </h3>
        {renderHeadline()}
        {contactSocialNetworks && (
          <ul className={styles.social}>
            {renderSocialNetwork("facebook")}
            {renderSocialNetwork("twitter")}
            {renderSocialNetwork("linkedin")}
          </ul>
        )}
        <div className={styles.footer}>
          {organization && organization.avatarUrl ? (
            <a href={organization.url} target="_blank" rel="noreferrer">
              <img
                height={40}
                className="org-img"
                src={organization.avatarUrl}
                alt={organization.name}
              />
            </a>
          ) : (
            <span></span>
          )}
          <div>{`${author.countArticle} ${I18N[lng]["ARTCILES"]}`}</div>
        </div>
      </div>
    );
  }
};
