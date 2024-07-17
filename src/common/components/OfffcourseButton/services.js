import styles from "./button.module.scss";

export const buttonVariants = ({
  size,
  textSize,
  uppercase,
  radius,
  shadow,
  variant,
  isOutlined,
  isBlock,
  link,
  contentAlignment,
}) => [
  styles.btn,
  { [styles.btnBlock]: isBlock },
  { [styles.btnLink]: link && link !== "" },
  // button content alignment
  {
    [styles.contentLeft]: contentAlignment === "left",
    [styles.contentRight]: contentAlignment === "right",
    [styles.contentCenter]: contentAlignment === "center",
    [styles.contentBetween]: contentAlignment === "between",
  },
  // button sizes
  {
    [styles.btnSm]: size === "sm",
    [styles.btnMd]: size === "md",
    [styles.btnIcon]: size === "icon",
  },
  // button text sizes & appearance
  {
    [styles.textXs]: textSize === "xs",
    [styles.textSm]: textSize === "sm",
    [styles.textMd]: textSize === "md",
    [styles.textUppercase]: uppercase,
  },
  // button variants
  {
    [styles.btnNoShadow]: shadow === "none",
    [styles.btnShadowSm]: shadow === "sm",
    [styles.btnShadowMd]: shadow === "md",
  },
  // borders
  {
    [styles.btnNoRadius]: radius === "none",
    [styles.btnRadiusSm]: radius === "sm",
    [styles.btnRadiusMd]: radius === "md",
    [styles.btnRadiusFull]: radius === "full",
  },
  // variants/colors
  {
    [styles.btnPrimary]: variant === "primary" && isOutlined === false,
    [styles.btnPrimaryOutlined]: variant === "primary" && isOutlined === true,
    [styles.btnSecondary]: variant === "secondary",
    [styles.btnTertiary]: variant === "tertiary" && isOutlined === false,
    [styles.btnTertiaryOutlined]: variant === "tertiary" && isOutlined === true,
    [styles.btnSuccess]: variant === "success" && isOutlined === false,
    [styles.btnSuccessOutlined]: variant === "success" && isOutlined === true,
    [styles.btnDanger]: variant === "danger" && isOutlined === false,
    [styles.btnDangerOutlined]: variant === "danger" && isOutlined === true,
  },
];
