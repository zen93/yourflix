import Vue from 'vue';
import Router from 'vue-router';
import Search from './components/Search';
import Login from './components/Login';
import MovieDetails from './components/MovieDetails';
import Lists from './components/Lists';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Search',
            component: Search
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/moviedetails',
            name: 'MovieDetails',
            component: MovieDetails
        },
        {
            path: '/lists',
            name: 'Lists',
            component: Lists
        }
    ]
});