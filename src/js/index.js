// Global app controller
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
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
    try {
      // 4. Search for recipes
      await state.search.getResults();

      // 5. Render results on UI
      searchView.renderResults(state.search.result);
      clearLoader();
    } catch (error) {
      alert("Oh noes, the search has failed!");
      clearLoader();
    }
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
const controlRecipe = async () => {
  // Fetch hash id from url
  const id = parseInt(window.location.hash.replace("#", ""));
  if (id) {
    // prepare ui
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // highlight selected search item
    if (state.search) searchView.highlightSelected(id);
    // create new recipe object
    state.recipe = new Recipe(id);
    // get recipe data  & parse ingredients
    try {
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // calculate servers and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      alert("Error processing recipe!");
    }

    // render recipe
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);

// Way to add event listeners to multiple events without repeating self
[("hashchange", "load")].forEach(e =>
  window.addEventListener(e, controlRecipe)
);
