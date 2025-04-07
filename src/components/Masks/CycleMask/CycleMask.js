import React, { useRef, useState } from "react";
import { Mask } from "../Common/Mask/Mask";
import IconCalendarWhite from "../Assets/IconCalendarWhite";
import { parseJson } from "../../../utils";
import { FocusForm } from "../Common/FocusForm/FocusForm";

export const CycleMask = ({
  cycle,
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
      case "focus":
        return (
          <FocusForm
            setShowFocusConfig={closeForm}
            cycleId={cycle.id}
            focusConfig={parseJson(cycle.focusConfig)}
            carouselConfig={parseJson(cycle.carouselConfig)}
            language={language}
            token={token}
            env={env}
            updateFocusConfig={(newFocusConfig) => {
              cycle.focusConfig = newFocusConfig;
            }}
            updateCarouselConfig={(newCarouselConfig) => {
              cycle.carouselConfig = newCarouselConfig;
            }}
            endDateTime={cycle.endDateTime}
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
