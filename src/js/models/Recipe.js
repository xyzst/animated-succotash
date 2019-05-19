import axios from "axios";
import { key } from "../config";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  /**
   * SAMPLE RECIPE OBJECT
   *
   * f2f_url: "http://food2fork.com/view/35478"
   * image_url: "http://static.food2fork.com/Pizza2BQuesadillas2B2528aka2BPizzadillas25292B5002B834037bf306b.jpg"
   * ingredients: [
   *    "2 (10 inch) tortilla",
   *    "1 cup mozzarella, shredded",
   *    "3 tablespoons pizza sauce",
   *    "16 slices pepperoni",
   *    "1 tablespoon sliced black olives",
   *    "3 tablespoons pizza sauce",
   *    "1/2 cup mozzarella, shredded",
   *    "3 slices pepperoni",
   *    "1 tablespoon sliced black olives",
   *    "2 (10 inch) tortilla",
   *    "1 cup mozzarella, shredded",
   *    "4 tablespoons pizza sauce",
   *    "16 slices pepperoni",
   *    "1 tablespoon sliced black olives↵"
   * ]
   * publisher: "Closet Cooking"
   * publisher_url: "http://closetcooking.com"
   * recipe_id: "35478"
   * social_rank: 99.99999999999835
   * source_url: "http://www.closetcooking.com/2012/11/pizza-quesadillas-aka-pizzadillas.html"
   * title: "Pizza Quesadillas (aka Pizzadillas)"
   */
  async getRecipe() {
    try {
      console.log(this.id, key);
      const result = await axios(
        `https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`
      );
      console.log(result);
      this.title = result.data.recipe.title;
      this.author = result.data.recipe.publisher;
      this.image = result.data.recipe.image_url;
      this.url = result.data.recipe.source_url;
      this.ingredients = result.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
      alert("Something went terribly wrong ☹️");
    }
  }

  /**
   * Rough estimate by ingredients.
   *
   * 3 ingredients == ~15 minutes
   */
  calcTime() {
    const numIngredients = this.ingredients.length;
    const periods = Math.ceil(numIngredients / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }
}
