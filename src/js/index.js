// Global app controller
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";
/**
 * Global state of app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

/**
 * Search Controller
 */
const controlSearch = async () => {
  // 1. get query from view
  const query = searchView.getInput();
  if (query) {
    // 2. new search object and add to state
    state.search = new Search(query);

    // 3. prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResultArea);

    // 4. Search for recipes
    await state.search.getResults();

    // 5. Render results on UI
    searchView.renderResults(state.search.result);
    clearLoader();
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault(); // prevent page refresh on form submit
  controlSearch();
});

// Use of event delegation ...
elements.searchResultPages.addEventListener("click", e => {
  const button = e.target.closest(".btn-inline");
  if (button) {
    const goToPage = parseInt(button.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 * Recipe Controller
 */
const recipe = new Recipe(47746);
recipe.getRecipe();
recipe.calcTime();
// console.log(recipe);
