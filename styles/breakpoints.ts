type BreakPointType = "sm" | "md" | "lg" | "xl" | "2xl";

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

export const getMediaQuery = (breakpoint: BreakPointType) => {
  switch (breakpoint) {
    case "sm":
      return `(min-width: ${breakpoints["sm"]})`;
    case "md":
      return `(min-width: ${breakpoints["md"]})`;
    case "lg":
      return `(min-width: ${breakpoints["lg"]})`;
    case "xl":
      return `(min-width: ${breakpoints["xl"]})`;
    case "2xl":
      return `(min-width: ${breakpoints["2xl"]})`;
  }
};
