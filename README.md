# Forkify

Forkify is a dynamic web application for finding and managing recipes. Users can search for recipes, view details, adjust servings, bookmark favorites, and even upload their own recipes. The app uses the MVC architecture for better structure and performance optimization.

## Features

- **Search for Recipes**: Enter a keyword in the search bar to find relevant recipes.
- **Display Search Results**: Search results are displayed dynamically for the user's keyword.
- **Render Selected Recipe**: Click on a recipe from the results to display detailed information including ingredients, cooking instructions, and more.
- **Update Recipe Servings**: Users can adjust the number of servings, and the ingredients will automatically update.
- **Bookmark Recipes**: Favorite recipes can be bookmarked for later access.
- **Persist Bookmarks with Local Storage**: Bookmarked recipes are stored using `localStorage`, so they remain saved even after the page is refreshed.
- **Upload User Recipes**: Users can upload their own custom recipes to the application.
- **MVC Architecture**: The project follows the Model-View-Controller (MVC) pattern for better code organization and maintainability.
- **Performance Enhancements**: Various algorithms and optimizations are implemented to ensure smooth and fast performance.

## Technologies Used

- **HTML5**: For structuring the content of the application.
- **CSS3**: For styling the user interface.
- **JavaScript (ES6+)**: For functionality and dynamic behavior.
- **MVC Architecture**: Implemented to separate concerns and structure the code effectively.
- **LocalStorage**: Used to persist user data (bookmarked recipes).

## Project Structure

```bash
forkify/
│
├── index.html        # Main HTML file
├── style.css         # CSS file for styling
├── app.js            # JavaScript entry point and controller
├── model.js          # Manages the data (Model)
├── view/             # Contains all the view components
│   ├── searchView.js     # Handles the search input view
│   ├── resultsView.js    # Handles rendering search results
│   ├── recipeView.js     # Handles rendering individual recipe details
│   ├── bookmarksView.js  # Handles the bookmarks functionality
│   └── uploadRecipeView.js # Handles uploading user recipes
└── helpers/          # Utility functions and algorithms
    └── helpers.js    # Performance enhancing functions, formatting utilities
```

## How to Use

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/forkify.git
   ```

2. **Open `index.html`** in your web browser to launch the application.

3. **Search for a recipe**:

   - Enter a keyword in the search bar (e.g., "pizza", "pasta").
   - A list of recipes matching the keyword will be displayed.

4. **View Recipe Details**:

   - Click on a recipe from the search results to view ingredients, cooking steps, and other information.

5. **Adjust Recipe Servings**:

   - Modify the number of servings, and the ingredient amounts will automatically recalculate.

6. **Bookmark Recipes**:

   - Save favorite recipes by clicking on the bookmark icon. Bookmarked recipes can be accessed anytime.

7. **Upload a Recipe**:
   - Upload your own recipe via the upload button and share it with others.

## Future Enhancements

- Implement pagination for search results.
- Enable user comments and ratings for recipes.
- Add more advanced search filters (e.g., by ingredient, cuisine, etc.).
- Improve the user experience for uploading recipes.
