import { I18N } from "../../../i18n";

export const getCycleSlideConfig = (cycle, language) => {
  const typeConfig = {
    1: {
      label: I18N[language].cycle,
      secondaryBanner: "/img/slides/cycle-banner.jpeg",
      buyButtonText: I18N[language].buyTheCycle,
      theme: "purple",
    },
    2: {
      label: I18N[language].season,
      secondaryBanner: "/img/slides/cycle-banner.jpeg",
      buyButtonText: I18N[language].buyTheSeason,
      theme: "orange",
    },
    3: {
      label: I18N[language].essential,
      secondaryBanner: "/img/slides/cycle-banner.jpeg",
      buyButtonText: I18N[language].buyTheEssential,
      theme: "greenTeal",
    },
  };

  return typeConfig[cycle.type];
};
