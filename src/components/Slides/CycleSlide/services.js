import { I18N } from "../../../i18n";

export const getCycleSlideConfig = (cycle, language) => {
  const typeConfig = {
    1: {
      secondaryBanner: "/img/slides/cycle-banner.jpeg",
      theme: "purple",
    },
    2: {
      secondaryBanner: "/img/slides/cycle-banner.jpeg",
      theme: "orange",
    },
    3: {
      secondaryBanner: "/img/slides/cycle-banner.jpeg",
      theme: "greenTeal",
    },
  };

  return typeConfig[cycle.type];
};
