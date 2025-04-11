import React, { useState } from "react";
import { Mask } from "../Common/Mask/Mask";
import IconHash from "../Assets/IconHash";
import IconCalendarWhite from "../Assets/IconCalendarWhite";
import { getApiUrl, parseJson } from "../../../utils";
import { FocusForm } from "../Common/FocusForm/FocusForm";
import TagsForm from "../Common/TagForm/TagsForm";
import { updateEventWatchConfig } from "../../../api";
import { Toast } from "../../ToastContainer/ToastContainer";
import { I18N } from "../../../i18n";

export const EventMask = ({
  event,
  language,
  token,
  env,
  isHovered,
  ...restProps
}) => {
  const [activeForm, setActiveForm] = useState(null);
  const [watchConfig, setWatchConfig] = useState(
    event.watchConfig === 1 ? true : false
  );
  const iconUrl = "	https://unitedassociates.be/img/apps/offfcourse.svg";

  const handleWatchConfigChange = (newWatchConfig) => {
    const id = event.id;
    const updatedWatchConfig = newWatchConfig ? 1 : 0;
    const apiUrl = getApiUrl(env);

    updateEventWatchConfig({ id, apiUrl, updatedWatchConfig, token })
      .then(({ data }) => {
        const updatedEvent = data.data;
        setWatchConfig(updatedEvent.watchConfig);

        Toast.success(
          newWatchConfig
            ? I18N[language]["watchAdded"]
            : I18N[language]["watchRemoved"]
        );
      })
      .catch((error) => {
        Toast.error(
          error.response?.data?.message ||
            I18N[language]["errorUpdatingWatchConfig"]
        );
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
    <Mask
      actions={[
        {
          children: <IconHash width="17px" height="20px" />,
          onClick: () => toggleForm("tags"),
        },
        {
          children: <IconCalendarWhite width="17px" height="20px" />,
          onClick: () => toggleForm("focus"),
        },
        {
          children: (
            <div
              style={{
                marginLeft: "12%",
                marginTop: "15%",
              }}
            >
              <img
                src={iconUrl}
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  opacity: !watchConfig ? "0.2" : 1,
                }}
              />
            </div>
          ),
          onClick: () => handleWatchConfigChange(!watchConfig),
        },
      ]}
      renderForm={renderForm}
      isActive={isHovered || activeForm !== null}
      closeForm={closeForm}
      {...restProps}
    />
  );
};
