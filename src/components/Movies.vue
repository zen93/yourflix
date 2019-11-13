<template>
    <div class="col-12 col-sm-8">
        <div class="row">
            <div class="col-12">
                <b-input class="mt-2" v-model="title" placeholder="Search Movie Title..."></b-input>
                <p>{{ this.$store.getters.status }}</p>
            </div>
            <div v-if="this.$store.getters.status == ''" class="row">
                <div class="col-12 col-sm-4" v-for="movie in this.$store.getters['movie/moviesList']['Search']" :key="movie.imdbID">
                    <router-link  :to="'/moviedetails?id=' + movie.imdbID">
                        <img draggable="true" @dragstart="drag" :id="movie.imdbID" class="img-fluid mx-auto d-block" v-if="movie.Poster != 'N/A'" :src="movie.Poster"/>
                        <img draggable="true" @dragstart="drag" :id="movie.imdbID" class="img-fluid mx-auto d-block" v-else src="../assets/film-poster-placeholder.png"/>
                    </router-link>
                    <router-link :to="'/moviedetails?id=' + movie.imdbID" >
                        {{ movie.Title }}
                    </router-link>
                    <b-button block v-if="$store.getters['list/currentList'].id != ''" variant="dark" class="mt-2 mb-2" @click="addMovieToList(movie.imdbID)">Add to {{ $store.getters['list/currentList'].name }}</b-button>
                </div>
                <div class="col-12">
                    <b-pagination
                        v-model="currentPage"
                        :total-rows="rows"
                        :per-page="perPage"
                        align="center"
                    ></b-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import firebase from 'firebase';

export default {
    mounted() {
        if(this.title) {
            this.searchMovies();
        }
        if(!this.currentPage) {
            console.log(this.currentPage);
            this.currentPage = 1;
        }
        this.$root.$on('addMovieToList', (id) => {
            this.addMovieToList(id);
        });
    },
    data() {
        return {
            title: this.$route.query.q,
            currentPage: this.$route.query.p,
            perPage: 10,
        }
    },
    computed: {
        rows() {
            if(this.$store.getters['movie/moviesList']['totalResults']) {
                return this.$store.getters['movie/moviesList']['totalResults'];
            }
            else {
                return Number.MAX_SAFE_INTEGER;
            }
        }
    },
    watch: {
        title: function () {
            this.$router.replace({ path: '/', query: { q: this.title, p: this.currentPage }});
            if(this.title)
                this.searchMovies();
        },
        currentPage: function() {
            this.$router.replace({ path: '/', query: { q: this.title, p: this.currentPage }});
            if(this.title)
                this.searchMovies();
        }
    },
    methods: {
        drag(ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        },
        searchMovies() {
            _.debounce(() => {
                                this.$store.dispatch('movie/searchMovies', { title: this.title, page: this.currentPage }); 
                            }, 300)();
        },
        addMovieToList(id) {
            const db = firebase.firestore();
            let listId = this.$store.getters['list/currentList'].id;
            if(listId) {
                db
                .collection('users')
                .doc(firebase.auth().currentUser.uid)
                .collection('lists')
                .doc(listId)
                .update({
                    movies: firebase.firestore.FieldValue.arrayUnion(this.$store.getters['movie/getCurrentMovieDetails'](id))
                });
            }
        }
    }
}
</script>