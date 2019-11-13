import omdb from '../../api/omdb';
import firebase from 'firebase';

const state = {
    lists: [],
    currentList: { id: '', name: null},  //Stores id of current list
}

const getters = {
    lists: state => state.lists,
    currentList: state => state.currentList,
    getMovies: state => id => {
        if(id == '') return { movies: [] };
        return state.lists.filter( list => list.id == id)[0];
    },
    getMovie: state => (listId, movieId) => {
        if(listId == '') return {};
        let list = state.lists.filter(list => list.id == listId)[0];
        if(list) {
            let movie = list.movies.filter(movie => movie.imdbID == movieId)[0];
            if(movie)
                return { Poster: movie.Poster, Title: movie.Title, Type: movie.Type, Year: movie.Year, imdbID: movie.imdbID};
        }
        return {};
    }
}

const actions = {
    async searchMovies(context, title) {
        context.commit('setStatus', 'Loading...', { root: true });
        let moviesList = await omdb.searchByTitle(title);
        context.commit('setMoviesList', moviesList);
    },
    loadLists(context, user) {
        if(user) {
            const db = firebase.firestore();
            var unsubscribe = db
                .collection('users')
                .doc(user.uid)
                .collection('lists')
                .onSnapshot((docs) => {
                    let allData = [];
                    docs.forEach((doc) => {
                        let idObject = { id: doc.id };
                        let dataObject = { createdAt: doc.data().createdAt,
                                        movies: doc.data().movies,
                                        name: doc.data().name };
                        allData.push({...idObject, ...dataObject});
                    });
                    context.commit('setLists', allData);
                });
            context.commit('setUnsubscribe', unsubscribe, { root: true });
        }
            
    }
}

const mutations = {
    setLists(state, lists) {
        state.lists = lists;
    },
    setCurrentList(state, currentList) {
        state.currentList = currentList;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}