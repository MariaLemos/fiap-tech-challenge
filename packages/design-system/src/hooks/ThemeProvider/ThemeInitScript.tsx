import Script from "next/script";

const themeInitScript = `
(function () {
  try {
    var savedTheme = window.localStorage.getItem("theme");
    var systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    var theme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : systemTheme;
    document.documentElement.setAttribute("data-theme", theme);
  } catch (error) {}
})();
`;

export const ThemeInitScript = () => {
  return (
    <Script
      id="theme-init-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: themeInitScript,
      }}
    />
  );
};
