import { elements } from "./base";

export const toggleLikesBtn = isLiked => {
  // icon-heart-outlined

  const iconString = isLiked ? "icon-heart" : "icon-heart-outlined";
  document
    .querySelector(".recipe__love use")
    .setAttribute("href", `img/icons.svg#${iconString}`);
};
