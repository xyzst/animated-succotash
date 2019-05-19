// Global app controller
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
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
      clearLoader();
      searchView.renderResults(state.search.result);
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
  const id = window.location.hash.replace("#", "");
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
      console.log(error);
      alert("Error processing recipe!");
    }

    // render recipe
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);

// Way to add event listeners to multiple events without repeating self
["hashchange", "load"].forEach(e => window.addEventListener(e, controlRecipe));

/**
 * Shopping List Controller
 */
const controlList = () => {
  // create a new list of there is none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.addItem(item);
  });
};

// handling recipe button clicks
elements.recipe.addEventListener[
  ("click",
  e => {
    if (
      e.target.matches(".btn-decrease, btn-decrease *") &&
      state.recipe.servings > 1
    ) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches(".btn-increase, btn-increase *")) {
      state.recipe.updateServings("inc");
      recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches(".recipe__btn--add .recipe__btn--add *")) {
      controlList();
    }
  })
];
