import store from '../store/index';
import firebase from 'firebase';

export default {
    isInList(id) {
        if(this.$store.getters['list/getMovies'](this.$store.getters['list/currentList'].id).movies.filter( movie => movie.imdbID == id).length > 0) {
            return true;
        }
        else
            return false;
    },
    addMovieToList: function (id) {
        if(this.isInList(id)) {
            this.deleteMovieFromList(id);
            return;
        }
        const db = firebase.firestore();
        let listId = store.getters['list/currentList'].id;
        if(listId) {
            db
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('lists')
            .doc(listId)
            .update({
                movies: firebase.firestore.FieldValue.arrayUnion(store.getters['movie/getCurrentMovieDetails'](id))
            });
        }
    },
    deleteMovieFromList: function (movieId) {
        const db = firebase.firestore();
        let listId = this.$store.getters['list/currentList'].id;
        if(listId) {
            db
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('lists')
            .doc(listId)
            .update({
                movies: firebase.firestore.FieldValue.arrayRemove(this.$store.getters['list/getMovie'](listId, movieId))
            });
        }        
    },
}