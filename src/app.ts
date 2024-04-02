import "./sass/main.scss";
// main.ts

import {
  calculateSettingAsThemeString,
  updateButton,
  updateThemeOnHtmlEl,
  initializeThemeToggle,
} from "./theme";

/**
 * On page load:
 */
initializeThemeToggle();

/**
 * 1. Grab what we need from the DOM and system settings on page load
 */
const button = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");

const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

/**
 * 2. Work out the current site settings
 */
let currentThemeSetting = calculateSettingAsThemeString({
  localStorageTheme,
  systemSettingDark,
});

/**
 * 3. Update the theme setting and button text according to current settings
 */
if (button) {
  updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
  updateThemeOnHtmlEl({ theme: currentThemeSetting });
}

/**
 * 4. Add an event listener to toggle the theme
 */
if (button) {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

    localStorage.setItem("theme", newTheme);
    updateButton({ buttonEl: button, isDark: newTheme === "dark" });
    updateThemeOnHtmlEl({ theme: newTheme });

    currentThemeSetting = newTheme;
  });
}
