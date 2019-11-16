<template>
    <div class="col-12 col-sm-8">
        <div class="row">
            <div class="col-12">
                <b-input class="mt-2" v-model="title" placeholder="Search Movie Title..."></b-input>
                <span class="resetSearch" @click="resetSearch" v-if="showReset">&times;</span>
                <b-badge v-if="showComponents" variant="secondary">Movies found: {{ numOfMovies }}</b-badge>
                <p>{{ this.$store.getters.status }}</p>
            </div>
            <div v-if="this.$store.getters.status == ''" class="row">
                <div class="col-12 col-sm-4 text-center" v-for="movie in this.$store.getters['movie/moviesList']['Search']" :key="movie.imdbID">
                    <router-link  :to="'/moviedetails?id=' + movie.imdbID">
                        <img draggable="true" @dragstart="drag" :id="movie.imdbID" class="img-fluid mx-auto d-block" v-if="movie.Poster != 'N/A'" :src="movie.Poster"/>
                        <img draggable="true" @dragstart="drag" :id="movie.imdbID" class="img-fluid mx-auto d-block" v-else src="../assets/film-poster-placeholder.png"/>
                    </router-link>
                    <router-link :to="'/moviedetails?id=' + movie.imdbID">
                        {{ movie.Title }}
                    </router-link>
                    <b-button block v-if="$store.getters['list/currentList'].id != ''" variant="dark" class="mt-2 mb-2" @click="addMovieToList(movie.imdbID)">Add to {{ $store.getters['list/currentList'].name }}</b-button>
                </div>
                <div v-if="showComponents" class="col-12">
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
        if(!this.title) 
            this.$store.commit('movie/setMoviesList', { Search: [] });
        if(this.title) {
            this.searchMovies();
        }
        if(!this.currentPage) {
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
            oldTitle: '',
            oldPage: 0,
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
        },
        showComponents() {
            let search = this.$store.getters['movie/moviesList']['Search'];
            let listLength;
            if(search)
                listLength = search.length;
            if(listLength)
                return true;
            return false;
        },
        numOfMovies() {
            let totalResults = this.$store.getters['movie/moviesList']['totalResults'];
            if(totalResults)
                return totalResults;
            return 0;
        },
        showReset() {
            if(this.title) 
                return true;
            return false;
        }
    },
    watch: {
        title: function () {
            this.currentPage = 1;
            this.$router.replace({ path: '/', query: { q: this.title, p: this.currentPage }});
            if(this.title) {
                this.searchMovies();
                this.oldPage = this.currentPage;
            }
        },
        currentPage: function() {
            this.$router.replace({ path: '/', query: { q: this.title, p: this.currentPage }});
            if(this.title && this.oldPage != this.currentPage) {
                this.searchMovies();
                this.oldPage = this.currentPage;
            }
        }
    },
    methods: {
        drag(ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        },
        resetSearch() {
            this.title = '';
            this.currentPage = 1;
            this.$store.commit('movie/setMoviesList', { Search: [] });
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

<style scoped>
.resetSearch {
    position: absolute;
    right: 20px;
    top: 6px;
    bottom: 0;
    margin: auto;
    font-size: 26px;
    cursor: pointer;
    color: #ccc;
}
</style>