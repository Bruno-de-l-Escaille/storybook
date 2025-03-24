import React, { useState } from "react";
import { Mask } from "../Common/Mask/Mask";
import IconHash from "../Assets/IconHash";
import IconCalendarWhite from "../Assets/IconCalendarWhite";
import { parseJson } from "../../../utils";
import { FocusForm } from "../Common/FocusForm/FocusForm";
import TagsForm from "../Common/TagForm/TagsForm";

export const EventMask = ({
  event,
  language,
  token,
  env,
  isHovered,
  ...restProps
}) => {
  const [activeForm, setActiveForm] = useState(null);

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
            language={language}
            token={token}
            env={env}
            updateFocusConfig={(newFocusConfig) => {
              event.focusConfig = newFocusConfig;
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
      ]}
      renderForm={renderForm}
      isActive={isHovered || activeForm !== null}
      closeForm={closeForm}
      {...restProps}
    />
  );
};
