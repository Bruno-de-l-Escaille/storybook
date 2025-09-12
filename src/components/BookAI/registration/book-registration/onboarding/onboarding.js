import cn from "classnames";
import toArray from "rc-util/lib/Children/toArray";
import React, { ReactNode } from "react";
import TabePane, { Tab, TabPaneProps } from "./onboarding-page";
import s from "./onboarding.module.scss";
import { useResponsive } from "../../../hooks/useResponsive";
// import { Shave } from "@/common/components/commun/shave";
// import { LayoutTheme } from "@/common/constants/themes";

export function Responsive({ children, ...rest }) {
  const { isMobile, isDesktop, isTablet } = useResponsive();

  const screens = "screens" in rest ? rest.screens : [rest.screen];

  if (
    (screens.includes("mobile") && isMobile) ||
    (screens.includes("tablet") && isTablet) ||
    (screens.includes("desktop") && isDesktop)
  ) {
    return children;
  }

  return null;
}

export function parseTabList(children) {
  const result = toArray(children)
    .map((node) => {
      if (React.isValidElement(node)) {
        const { tab } = node.props;
        return tab;
      }

      return null;
    })
    .filter((tab) => tab);

  return result;
}

export default function Onboarding({
  children,
  title,
  theme = "",
  className,
  classNameTabs,
  selectedTab,
  allowDisable,
  Navigation,
}) {
  const tabs = parseTabList(children);

  const renderTabs = toArray(children)
    .map((node) => {
      if (node.type !== TabePane) {
        return null;
      }

      if (selectedTab !== node.props?.tab?.id) {
        return null;
      }

      return node;
    })
    .filter((node) => node);

  const selectedTabIndex = tabs.findIndex((tab) => tab.id === selectedTab);

  return (
    <div className={cn(s.onboarding, className, s[theme])}>
      <div className={cn(s.header, "align-justify")}>
        <span className={s.space} />
        {title && <div className={s.title}>{title}</div>}
        {Navigation || (
          <Responsive screens={["desktop", "tablet"]}>
            <ul className={cn(s.navs, classNameTabs, "m-r-xl")}>
              {tabs.map((tab, index) => {
                const isActive = index === selectedTabIndex;
                const isDone = selectedTabIndex > index;
                const isDisabled =
                  tabs.length === 5
                    ? selectedTabIndex > 2 &&
                      (index === 0 || index === 1 || index === 2)
                    : selectedTabIndex > 1 && (index === 0 || index === 1);
                return (
                  <li
                    key={`${tab.title}-${index}`}
                    onClick={() => tab.onClick?.(tab.id)}
                    className={cn(
                      isActive && s.activeNav,
                      isDone && s.done,
                      allowDisable && isDisabled && s.disabled
                    )}
                    style={!tab.onClick ? { cursor: "default" } : undefined}
                  >
                    <span className={s.circle} />
                    {tab.title}
                  </li>
                );
              })}
            </ul>
          </Responsive>
        )}
      </div>
      {renderTabs}
    </div>
  );
}
