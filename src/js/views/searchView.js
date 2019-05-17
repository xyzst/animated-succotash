import { elements } from "./base";

export const getInput = () => elements.searchInput.value;
export const renderResults = recipes => {
  recipes.forEach(renderRecipe);
};
export const clearInput = () => {
  elements.searchInput.value = "";
};
export const clearResults = () => {
  elements.searchResultList.innerHTML = "";
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
const limitRecipeTitle = (title, limit = 17) => {
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
