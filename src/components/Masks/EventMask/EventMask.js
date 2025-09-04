import React, { useState } from "react";
import { Mask } from "../Common/Mask/Mask";
import IconHash from "../Assets/IconHash";
import IconCalendarWhite from "../Assets/IconCalendarWhite";
import { getApiUrl, parseJson } from "../../../utils";
import { FocusForm } from "../Common/FocusForm/FocusForm";
import TagsForm from "../Common/TagForm/TagsForm";
import { updateEventWatchConfig } from "../../../api";
import { FlashMessage, Toast } from "../../ToastContainer/ToastContainer";
import { I18N } from "../../../i18n";
import { Tooltip } from "antd";
import {
  BeatLoader,
  CircleLoader,
  ClipLoader,
  DotLoader,
  MoonLoader,
} from "react-spinners";
import { Help } from "../../Icons/Help";
import { Image } from "../../Icons/Image";

export const EventMask = ({
  event,
  language,
  token,
  env,
  isHovered,
  ...restProps
}) => {
  const [activeForm, setActiveForm] = useState(null);
  const [watchConfig, setWatchConfig] = useState(event.watchConfig === 1);
  const iconUrl = "	https://unitedassociates.be/img/apps/offfcourse.svg";
  const [isUpdating, setIsUpdating] = useState(false);

  const handleWatchConfigChange = (newWatchConfig) => {
    setIsUpdating(true);
    const id = event.id;
    const updatedWatchConfig = newWatchConfig ? 1 : 0;
    const apiUrl = getApiUrl(env);

    updateEventWatchConfig({ id, apiUrl, updatedWatchConfig, token })
      .then(({ data }) => {
        const updatedEvent = data.data;
        setWatchConfig(updatedEvent.watchConfig == 1);

        Toast.success(
          newWatchConfig
            ? I18N[language]["watchAdded"]
            : I18N[language]["watchRemoved"]
        );
        setIsUpdating(false);
      })
      .catch((error) => {
        Toast.error(
          error.response?.data?.message ||
            I18N[language]["errorUpdatingWatchConfig"]
        );
        setIsUpdating(false);
      });
  };

  const toggleForm = (form) => {
    if (activeForm === form) {
      setActiveForm(null);
    } else {
      setActiveForm(form);
    }
  };

  const closeForm = (value) => {
    setActiveForm(null);
  };

  const renderForm = () => {
    switch (activeForm) {
      case "tags":
        return (
          <TagsForm
            setShowAddTags={closeForm}
            eventId={event.id}
            language={language}
            token={token}
            env={env}
          />
        );
      case "focus":
        return (
          <FocusForm
            setShowFocusConfig={closeForm}
            eventId={event.id}
            focusConfig={parseJson(event.focusConfig)}
            carouselConfig={parseJson(event.carouselConfig)}
            language={language}
            token={token}
            env={env}
            updateFocusConfig={(newFocusConfig) => {
              event.focusConfig = newFocusConfig;
            }}
            updateCarouselConfig={(newCarouselConfig) => {
              event.carouselConfig = newCarouselConfig;
            }}
            endDateTime={event.endDateTime}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Mask
        actions={[
          {
            children: (
              <Tooltip title={I18N[language]["tagConfig"]}>
                <IconHash width="17px" height="20px" />
              </Tooltip>
            ),
            onClick: () => toggleForm("tags"),
          },
          {
            children: (
              <Tooltip title={I18N[language]["focusConfig"]}>
                <IconCalendarWhite width="17px" height="20px" />
              </Tooltip>
            ),
            onClick: () => toggleForm("focus"),
          },
          {
            children: (
              <Tooltip title={I18N[language]["watchConfig"]}>
                <div
                  style={{
                    marginLeft: "12%",
                    marginTop: "18%",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      maxHeight: "100%",
                      maxWidth: "100%",
                    }}
                  >
                    <ClipLoader
                      color="#fff"
                      loading={isUpdating}
                      size={"32px"}
                    />
                  </span>
                  <img
                    src={iconUrl}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      opacity: !watchConfig ? "0.2" : 1,
                    }}
                  ></img>
                </div>
              </Tooltip>
            ),
            onClick: () => handleWatchConfigChange(!watchConfig),
          },
          {
            children: (
              <Tooltip title={I18N[language]["faqConfig"]}>
                <Help style={{ paddingLeft: "0.25rem" }} />
              </Tooltip>
            ),
            onClick: () => {
              const url = new URL(window.location.href);
              url.searchParams.set("appSelected", "EVENT");
              url.searchParams.set("eventId", event.id);
              window.history.pushState({}, "", url.toString());
            },
          },
          {
            children: (
              <Tooltip title={I18N[language]["galleryConfig"]}>
                <Image style={{ paddingLeft: "0.25rem" }} />
              </Tooltip>
            ),
            onClick: () => {
              const url = new URL(window.location.href);
              url.searchParams.set("eventId", event.id);
              window.history.pushState({}, "", url.toString());
            },
          },
        ]}
        renderForm={renderForm}
        isActive={isHovered || activeForm !== null}
        closeForm={closeForm}
        {...restProps}
      />
    </>
  );
};
