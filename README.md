# yourflix
Description
Movie browser and favoriting app. You can search for movies and view their details and ratings. You can also make lists of movies i.e. "Horror movies", "Comedies" etc. There is a sign-up page and a login page.
What I have done:
- Movie Search Page
- Login and signup Pages
- Lists sidebar
- Create/delete lists page

What I have yet to do:
- Nothing, everything is finished except for testing the app thoroughly

Project Structure:
- api/omdb.js - This file contains the api calls to the omdb api
- components/Lists.vue - Contains code for the create/delete lists page
- components/Login.vue - code for login/signup page
- components/MovieDetails.vue - code for movie details page
- components/Movies.vue - code for movies listing in the search page
- components/Navbar.vue - code for navbar
- components/Search.vue - code for movies search page
- components/Sidebar.vue - code for sidebar in movies search page and MovieDetails page
- store/index.js - main vuex store which stores user data and status
- store/modules/list.js - vuex module which stores list related data
- store/modules/movie.js - vuex module which stores movie related data
- App.vue - Main template for the app
- Main.js - Initializes the app
- Router.js - Defines paths and their corresponding components

This app can be accessed at https://yourflix-interaction.firebaseapp.com/
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
