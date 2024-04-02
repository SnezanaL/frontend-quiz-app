// themeUtils.ts

/**
 * Utility function to calculate the current theme setting.
 * Look for a local storage value.
 * Fall back to system setting.
 * Fall back to light mode.
 */
export function calculateSettingAsThemeString({
  localStorageTheme,
  systemSettingDark,
}: {
  localStorageTheme: string | null;
  systemSettingDark: MediaQueryList;
}): string {
  if (localStorageTheme !== null) {
    return localStorageTheme;
  }

  if (systemSettingDark.matches) {
    return "dark";
  }

  return "light";
}

/**
 * Utility function to update the button text and aria-label.
 */
export function updateButton({
  buttonEl,
  isDark,
}: {
  buttonEl: HTMLButtonElement;
  isDark: boolean;
}): void {
  const newCta = isDark ? "Change to light theme" : "Change to dark theme";
  // use an aria-label if you are omitting text on the button
  // and using a sun/moon icon, for example
  buttonEl.setAttribute("aria-label", newCta);
  buttonEl.innerText = newCta;
}

/**
 * Utility function to update the theme setting on the html tag
 */
export function updateThemeOnHtmlEl({ theme }: { theme: string }): void {
  document.querySelector("html")!.setAttribute("data-theme", theme);
}

export function initializeThemeToggle(): void {
  document.addEventListener("DOMContentLoaded", function (event) {
    event.preventDefault();
    const toggleTheme = document.getElementById(
      "theme-toggle"
    ) as HTMLButtonElement | null;

    if (toggleTheme) {
      toggleTheme.onclick = function () {
        const currTheme = document.documentElement.getAttribute("data-theme");
        const theme = currTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", theme);
      };
    }
  });
}
