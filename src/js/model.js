import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { getJSON } from './helpers.js';
import { RES_PER_PAGE } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id.slice(1)}`);
    // console.log(data);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      cookingTime: recipe.cooking_time,
      imageURL: recipe.image_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      servings: recipe.servings,
      sourceURL: recipe.source_url,
      title: recipe.title,
    };

    if (state.bookmarks.some(bm => bm.id === id.slice(1)))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err} 💥💥💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await getJSON(`${API_URL}?search=${query}`);
    console.log(data);

    state.search.query = query;

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        imageURL: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (numServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (numServings / state.recipe.servings) * ing.quantity;
  });

  // Updating the servings as if we didnt, and wanted to re-change them the servings will still be the original
  state.recipe.servings = numServings;
};

export const addBookmark = function (recipe) {
  // Adding the recipe to the bookmarks array
  state.bookmarks.push(recipe);

  // Updating the recipe to be displayed as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const removeBookmark = function (id) {
  state.bookmarks.splice(
    state.bookmarks.findIndex(bm => bm.id === id),
    1
  );

  // Updating the recipe to be displayed as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
};
