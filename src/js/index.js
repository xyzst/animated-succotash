import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
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
      console.log(error);
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
      console.log(state);
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
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

// handle delete and update list item events

elements.shopping.addEventListener("click", e => {
  const id = e.target.closest(".shopping__item").dataset.itemid;
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    state.list.deleteItem(id);
    listView.deleteItem(id);
  } else if (e.target.matches(".shopping__count-value" && e.target.value > 0)) {
    const val = parseFloat(e.target.value);
    state.list.updateCount(id, val);
  }
});

/**
 * Shopping List Controller
 */
const controlList = () => {
  // create a new list of there is none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

/**
 * Like Controller
 */
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentId = state.recipe.id;
  console.log(state.likes);
  if (!state.likes.isLiked(currentId)) {
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.image
    );
    likesView.toggleLikesBtn(true);
    likesView.renderLike(newLike);
  } else {
    state.likes.removeLike(currentId);
    likesView.toggleLikesBtn(false);
    likesView.deleteLike(currentId);
  }

  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// handling recipe button clicks
elements.recipe.addEventListener("click", e => {
  if (
    e.target.matches(".btn-decrease, btn-decrease *") &&
    state.recipe.servings > 1
  ) {
    state.recipe.updateServings("dec");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".btn-increase, btn-increase *")) {
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  }
});

window.addEventListener("load", () => {
  state.likes = new Likes();
});
