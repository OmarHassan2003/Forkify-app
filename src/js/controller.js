import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// import icons from '../img/icons.svg'; // parcel 1
import icons from 'url:../img/icons.svg'; // parcel 2
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    // 1) getting the hash from the url
    const id = window.location.hash;

    if (!id) return;
    recipeView.renderSpinner();

    // 2) Update the results view to mark the selected search result
    resultsView.update(model.getSearchResultsPage());

    // 2) loading recipe
    await model.loadRecipe(id);

    // 3) Updating bookmarks to mark if the current recipe is selected in the bookmarks drop menu
    bookmarksView.update(model.state.bookmarks);

    // 4) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1) Display the spinner till the searches load
    resultsView.renderSpinner();

    // 2) Get search value
    const query = searchView.getQuery();
    if (!query) return;

    // 3) Update the state object
    await model.loadSearchResults(query);

    // 4) Render results
    // Here we display all the results but we want to have them in pages
    // resultsView.render(model.state.search.results);

    resultsView.render(model.getSearchResultsPage());

    // 5) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) render the results after changing the pagination
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render new pagination buttons
  paginationView.render(model.state.search);
};

/////// This is my way of doing it
// const controlServings = function (incOrDec) {
//   // if incOrDec is -1 this means we will decrease the servings and else we will increase it

//   // Update the recipe servings (in state)
//   if (incOrDec < 0) model.updateServings(model.state.recipe.servings - 1);
//   else model.updateServings(model.state.recipe.servings + 1);

//   // Update the displayed recipe accordingly
//   recipeView.render(model.state.recipe);
// };

function controlServings(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the displayed recipe accordingly
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

function controlBookmarks() {
  // 1) Add/ Remove bookmarks
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.removeBookmark(model.state.recipe.id);
  }

  // 2) Update recipe view to display bookmarked icon
  recipeView.update(model.state.recipe);

  // 3) Rendering the bookmarked recipes on the drop down menu
  bookmarksView.render(model.state.bookmarks);
}
function controlBookmarkStart() {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    // upload the new recipe data
    await model.uplaodRecipe(newRecipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Re-render the bookmarks in their drip down menu
    bookmarksView.render(model.state.bookmarks);

    // Change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close the form window and re-render the original
    await addRecipeView.renderForm();
  } catch (err) {
    console.error('💥💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarkStart);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
