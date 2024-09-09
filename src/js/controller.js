import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

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

    // 2) loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);

    // // Testing the update serving function
    // setTimeout(controlServings, 1000);
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
  recipeView.render(model.state.recipe);
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
