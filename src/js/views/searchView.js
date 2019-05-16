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
                <h4 class="results__name">${recipe.title}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
  elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};
