// Global app controller
import Search from "./models/Search";

/**
 * Global state of app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

const controlSearch = async () => {
  // 1. get query from view
  const query = "pizza"; // todo!

  if (query) {
    // 2. new search object and add to state
    state.search = new Search(query);

    // 3. prepare UI for results

    // 4. Search for recipes
    await state.search.getResults();

    // 5. Render results on UI
    console.log(state.search.result);
  }
};
document.querySelector(".search").addEventListener("submit", e => {
  e.preventDefault(); // prevent page refresh on form submit
  controlSearch();
});

const search = new Search("pizza");
