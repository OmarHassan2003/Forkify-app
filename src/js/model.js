import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { AJAX } from './helpers.js';
import { RES_PER_PAGE, KEY } from './config.js';

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

function createRecipeObject(data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    imageURL: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceURL: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
}

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id.slice(1)}?key=${KEY}`);
    // console.log(data);

    state.recipe = createRecipeObject(data);

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
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.query = query;

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        imageURL: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    const searchTitlesUnique = Array.from(
      new Set(state.search.results.map(rec => rec.title.toLowerCase()))
    );

    // const cleanSearches = searchTitlesUnique.map((title, i) => {
    //   console.log(i, title, state.search.results[i].title);
    //   if (title === state.search.results[i].title) {
    //     const retValue = state.search.results[i];
    //     state.search.results.map =
    //     return retValue;
    //   }
    // });
    // const cleanSearches = state.search.results.map((rec, i) => {
    //   rec.title = cleanSearches[]
    // })
    // console.log(cleanSearches);
    state.search.results.splice(
      1,
      state.search.results.length - searchTitlesUnique.length
    );

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

  storeBookmarks();
};

const storeBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const removeBookmark = function (id) {
  state.bookmarks.splice(
    state.bookmarks.findIndex(bm => bm.id === id),
    1
  );

  // Updating the recipe to be displayed as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  storeBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
clearBookmarks();

export const uplaodRecipe = async function (data) {
  try {
    const ingredients = Object.entries(data)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong Ingredient format! Please use the correct format'
          );

        const [quantityPre, unit, description] = ingArr;
        const quantity = +(quantityPre ? quantityPre : null);
        return {
          quantity,
          unit,
          description,
        };
      });

    const recipe = {
      title: data.title,
      cooking_time: +data.cookingTime,
      image_url: data.image,
      publisher: data.publisher,
      servings: +data.servings,
      source_url: data.sourceUrl,
      ingredients,
    };

    const data2 = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data2);
    state.recipe.bookmarked = true;

    // Adding the created element to the bookmarked recipes
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
