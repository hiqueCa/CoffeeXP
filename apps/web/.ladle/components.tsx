import { type GlobalProvider } from "@ladle/react";
import { ThemeProvider, useColorScheme } from "@mui/material/styles";
import { useEffect } from "react";
import { theme } from "../src/theme/theme";

const ColorSchemeUpdater = ({ isDark }: { isDark: boolean }) => {
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(isDark ? "dark" : "light");
  }, [setColorScheme, isDark]);

  return null;
};

export const Provider: GlobalProvider = ({ children, globalState }) => {
  const isDark = globalState.theme === "dark";

  return (
    <ThemeProvider theme={theme}>
      <ColorSchemeUpdater isDark={isDark} />
      {children}
    </ThemeProvider>
  );
};
