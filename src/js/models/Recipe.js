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
      const result = await axios(
        `https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`
      );
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

  parseIngredients() {
    // refactor this
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds"
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound"
    ];
    const units = [...unitsShort, "kg", "g"];
    const newIngredients = this.ingredients.map(x => {
      // Uniform units
      let ingredient = x.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitShort[i]);
      });
      // Remove parentheses
      ingredient = ingredient.replace("/[{()}]/g", " ");
      // Parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex(y => units.includes(y));
      let objIng;
      if (unitIndex > -1) {
        // unit found
        const arrCount = arrIng.slice(0, unitIndex); // example: 8 1/2 cups ... arrCount is [4, 1/2] --> 4 +  ,5 == 4.5; 4 cups ... arrCount is [4]
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" ")
        };
      } else if (parseInt(arrIng[0], 10)) {
        // Leverages type coercion here -- If the first element is found not to be a number, will return NaN and thus evaluate to falsy
        // No unit found, but first unit is number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" ")
        };
      } else if (unitIndex === -1) {
        objIng = {
          count: 1,
          unit: "",
          ingredient
        };
      }

      return objIng;
    });
    this.ingredients = newIngredients;
  }
}
