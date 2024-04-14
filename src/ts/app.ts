import "../sass/main.scss";

import { initializeThemeToggle } from "./theme";
import { renderCurrentQuestion } from "./quiz";
// import htmlImg from "../../assets/images/icon-html.svg";
// import cssImg from "../../assets/images/icon-css.svg";

/**
 * On page load:
 */
initializeThemeToggle();

// Add Title to header on click of card
const header = document.querySelector("header");
// header div
const headerDiv = document.createElement("div");
const headerTitle = document.createElement("h1");
const HTMLImg = require("../../assets/images/icon-html.svg");
const CSSImg = require("../../assets/images/icon-css.svg");
const JavaScriptImg = require("../../assets/images/icon-js.svg");
const AccessibilityImg = require("../../assets/images/icon-accessibility.svg");

const headerImage = document.createElement("img");
function addTitleToHeader(title: string) {
  headerTitle.textContent = title;
  headerTitle.classList.add("header-title");
  headerDiv.classList.add("header-div");
  // if (title === "HTML") {
  //   headerImage.src = HTMLImg;
  // } else if (title === "CSS") {
  //   headerImage.src = CSSImg;
  // } else if (title === "JavaScript") {
  //   headerImage.src = JavaScriptImg;
  // } else if (title === "Accessibility") {
  //   headerImage.src = AccessibilityImg;
  // }

  interface TitleToImageMap {
    [title: string]: string;
  }
  const titleToImage: TitleToImageMap = {
    HTML: HTMLImg,
    CSS: CSSImg,
    JavaScript: JavaScriptImg,
    Accessibility: AccessibilityImg,
  };

  headerImage.src = titleToImage[title];

  headerImage.classList.add("header-image");
  header.appendChild(headerImage);
  header.style.justifyContent = "space-between";
  header.insertBefore(headerDiv, header.firstChild);
  headerDiv.appendChild(headerImage);
  headerDiv.appendChild(headerTitle);
}
// remove title from header
function removeTitleFromHeader() {
  header.removeChild(headerTitle);
}

// Define global variables
const welcome = document.getElementById("welcome");
let id = ""; // Initialize id with an empty string
const cards = document.querySelectorAll(".card");

// Iterate over each card and attach click event listener
cards.forEach((card) => {
  card.addEventListener("click", (e) => {
    e.preventDefault();
    // Retrieve id of the clicked card
    id = card.id;
    // Call the fillContainer function with the id
    renderCurrentQuestion(id);
    removeWelcome();
    addTitleToHeader(id);
  });
});

function removeWelcome() {
  welcome.style.display = "none";
}
