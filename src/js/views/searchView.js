import { elements } from "./base";

export const getInput = () => elements.searchInput.value;
export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
  // Render results of current page
  const start = (page - 1) * resultsPerPage;
  const end = page * resultsPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  // Render pagination buttons
  renderButtons(page, recipes.length, resultsPerPage);
};
export const clearInput = () => {
  elements.searchInput.value = "";
};
export const clearResults = () => {
  elements.searchResultList.innerHTML = "";
  elements.searchResultPages.innerHTML = "";
};

export const highlightSelected = id => {
  const resultsArray = Array.from(document.querySelectorAll(".result__link"));
  resultsArray.forEach(x => x.classList.remove("results__link--active"));

  document
    .querySelector(`.results__link[href*="${id}"]`)
    .classList.add("results__link--active");
};

/**
 * f2f_url: "http://food2fork.com/view/8061c3"
 * image_url: "http://static.food2fork.com/CheesecakeJars2Crop1of1eedb.jpg"
 * publisher: "My Baking Addiction"
 * publisher_url: "http://www.mybakingaddiction.com"
 * recipe_id: "8061c3"
 * social_rank: 100
 * source_url: "http://www.mybakingaddiction.com/cheesecake-in-a-jar-recipe/"
 * title: "Virtual Picnic- Cheesecake in a Jar"
 */
const renderRecipe = recipe => {
  const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
  elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};

/**
 * Helper method which shortens strings given in the title parameter by the defined limit parameter (default is 17)
 *
 * Example
 *  Given:
 *      title: Pasta with tomato and spinach",
 *      limit: 17
 *
 *  Then:
 *      begin...
 *          0th iteration: accumulator (0) + current.length = 5 / newTitle = ['Pasta']
 *          1st iteration: accumulator (5) + current.length = 9 / newTitle = ['Pasta', 'with']
 *          2nd iteration: accumulator (9) + current.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
 *          3rd iteration: accumulator (15) + current.length = 18 / newTitle = ['Pasta', 'with', 'tomato'] // No longer adding words
 *          4th iteration: accumulator (18) + current.length = 25 / newTitle = ['Pasta', 'with', 'tomato']
 *      ...done
 *
 * @param {string} title
 * @param {number} limit
 */
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    let words = title.split(" ");
    words.reduce((accumulator, current) => {
      if (accumulator + current.length <= limit) {
        newTitle.push(current);
      }
      return accumulator + current.length;
    }, 0);

    return `${newTitle.join(" ")} ...`;
  }

  return title;
};

/**
 *
 * @param {*} pageNumber
 * @param {string} type 'prev' or 'next'
 */
const createButton = (pageNumber, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${
  type == "prev" ? pageNumber - 1 : pageNumber + 1
}>
        <span>Page ${type == "prev" ? pageNumber - 1 : pageNumber + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${
              type == "prev" ? "left" : "right"
            }"></use>
        </svg>
    </button>
    `;

const renderButtons = (page, numberOfResults, resultsPerPage) => {
  const pages = Math.ceil(numberOfResults / resultsPerPage);
  let button;
  if (page === 1 && pages > 1) {
    // Only button go to next page
    button = createButton(page, "next");
  } else if (page < pages) {
    button = `
        ${createButton(page, "prev")}
        ${createButton(page, "next")}
    `;
  } else if (page === pages && pages > 1) {
    // Only button go to prev page
    button = createButton(page, "prev");
  }

  elements.searchResultPages.insertAdjacentHTML("afterbegin", button);
};
