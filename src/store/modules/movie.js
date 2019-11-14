import omdb from '../../api/omdb';

const state = {
    moviesList: {
        Search: []
    },
    movieDetails: {},
}

const getters = {
    moviesList: state => state.moviesList,
    movieDetails: state => state.movieDetails,
    getCurrentMovieDetails: state => id => {
        if(id)
            return state.moviesList.Search.filter((movie) => id == movie.imdbID)[0]; 
        return null;
    }
}

const actions = {
    async searchMovies(context, payload) {
        context.commit('setStatus', 'Loading...', { root: true });
        let moviesList = await omdb.searchByTitle(payload.title, payload.page);
        context.commit('setMoviesList', moviesList);
    },
    async movieDetails(context, id) {
        context.commit('setStatus', 'Loading..', { root: true });
        let movieDetails = await omdb.movieDetails(id);
        context.commit('setMovieDetails', movieDetails);
    }
}

const mutations = {
    setMoviesList(state, moviesList) {
        state.moviesList = moviesList;
    },
    setMovieDetails(state, movieDetails) {
        state.movieDetails = movieDetails;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}