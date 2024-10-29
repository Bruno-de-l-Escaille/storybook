import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { BREAK_POINTS } from "../../config";

export function useResponsive() {
  const [isClient, setIsClient] = useState(typeof window !== "undefined");

  const isMobile = useMediaQuery({
    maxWidth: BREAK_POINTS.MEDIUM,
  });

  const isTablet = useMediaQuery({
    minWidth: BREAK_POINTS.MEDIUM + 0.1,
    maxWidth: BREAK_POINTS.LARGE - 0.1,
  });

  const isDesktop = useMediaQuery({
    minWidth: BREAK_POINTS.LARGE,
  });

  return {
    isDesktop: isClient ? isDesktop : true,
    isTablet: isClient ? isTablet : false,
    isMobile: isClient ? isMobile : false,
  };
}
