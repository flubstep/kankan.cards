import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  config: { initialColorMode: "light" },
  styles: {
    global: {
      body: {
        bg: "#ECEAE8",
        fontFamily: "Inter, sans-serif",
      },
      h1: { fontSize: "2.5rem" },
      h2: { fontSize: "2.0rem" },
      h3: { fontSize: "1.5rem" },
      h4: { fontSize: "1.2rem" },
    },
  },
  colors: {
    "paper.extralight": "#F0F0F0",
    "paper.light": "#ECEAE8",
    "paper.medium": "#E1DBCB",
  },
  components: {
    Table: {
      baseStyle: {
        backgroundColor: "#E1DBCB",
      },
    },
    Skeleton: {
      baseStyle: {
        borderRadius: 16,
        ["skeleton-start-color"]: "yellow.300",
        endColor: "black",
        default: {
          startColor: "red.300",
          endColor: "blue.300",
        },
      },
    },
    SkeletonText: {
      defaultProps: {
        startColor: "#ECEAE8",
        endColor: "blue.300",
      },
    },
  },
});
