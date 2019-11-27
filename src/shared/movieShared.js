import store from '../store/index';
import firebase from 'firebase';

export default {
    addMovieToList: function (id) {
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