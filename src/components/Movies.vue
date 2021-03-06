<template>
    <div class="col-12 col-sm-8">
        <div class="row">
            <div class="col-12">
                <b-input @keyup.enter="searchMovies" class="mt-2" :value="title" @input.native="title = $event.target.value" placeholder="Search Movie Title..."></b-input>
                <span class="resetSearch" @click="resetSearch" v-if="showReset">&times;</span>
                <b-badge v-if="showComponents" variant="secondary">Movies found: {{ numOfMovies }}</b-badge>
                <p>{{ this.$store.getters.status }}</p>
            </div>
            <div v-if="this.$store.getters.status == ''" class="row">
                <div class="col-12 col-sm-4 text-center" v-for="movie in this.$store.getters['movie/moviesList']['Search']" :key="movie.imdbID">
                    <router-link :to="'/moviedetails?id=' + movie.imdbID">
                        <img draggable="true" @dragstart="drag" :title="movie.Title" :alt="movie.Title" :id="movie.imdbID" class="imgFixedHeight mx-auto d-block" v-if="movie.Poster != 'N/A'" :src="movie.Poster"/>
                        <img draggable="true" @dragstart="drag" :title="movie.Title" :alt="movie.Title" :id="movie.imdbID" class="imgFixedHeight mx-auto d-block" v-else src="../assets/film-poster-placeholder.png"/>
                    </router-link>
                    <router-link class="truncate" :title="movie.Title" :to="'/moviedetails?id=' + movie.imdbID">
                        {{ movie.Title }}
                    </router-link>
                    <b-button block v-if="$store.getters['list/currentList'].id != ''" :variant="isInList(movie.imdbID)? 'success': 'dark'" class="mt-2 mb-2" @click="addMovieToList(movie.imdbID)">{{ isInList(movie.imdbID) ? '✓ Added to ' + $store.getters['list/currentList'].name : '+ Add to ' + $store.getters['list/currentList'].name }}</b-button>
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
            <div v-if="!title">
                <div class="row">
                    <div class="col-12 col-sm-4">
                        <h3>🔎 Search for movies!</h3>
                        <p>Use the search bar on the top to search for your favourite movies!</p>
                    </div>
                    <div class="col-12 col-sm-4">
                        <h3>📋 Make Lists!</h3>
                        <p>Make lists of your favourite movies. First, make a list <router-link to="/lists">here</router-link>. Then search a movie on the <router-link to="/search">search page</router-link>. Select the list under "Your Lists" and then click the "+ Add to List" button to add the movie to the list.</p>
                    </div>
                    <div class="col-12 col-sm-4">
                        <h3>Hints</h3>
                        <p>Click on a movie to see more details. Also, You can use the "+ Add to list" button to add a movie to your list or you can drag and drop the image on to the black-bordered box on the left. You can drag images from the movie details page too!</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import dragShared from '../shared/dragShared';
import movieShared from '../shared/movieShared';

export default {
    created() {
        this.drag = dragShared.drag;
        this.addMovieToList = movieShared.addMovieToList;
        this.deleteMovieFromList = movieShared.deleteMovieFromList;
        this.isInList = movieShared.isInList;
        this.searchMovies = _.debounce(() => {
                                this.$store.dispatch('movie/searchMovies', { title: this.title, page: this.currentPage }); 
                            }, 300);
    },
    mounted() {
        if(!this.title) 
            this.$store.commit('movie/setMoviesList', { Search: [] });
        if(this.title) {
            this.$store.commit('movie/setMoviesList', { Search: [] });
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
            this.$router.replace({ path: '/', query: { q: this.title, p: this.currentPage }}).catch(() => {});
            if(this.title) {
                this.searchMovies();
                this.oldPage = this.currentPage;
            }
        },
        currentPage: function() {
            this.$router.replace({ path: '/', query: { q: this.title, p: this.currentPage }}).catch(() => {});
            if(this.title && this.oldPage != this.currentPage) {
                this.searchMovies();
                this.oldPage = this.currentPage;
            }
        }
    },
    methods: {
        resetSearch() {
            this.title = '';
            this.currentPage = 1;
            this.$store.commit('movie/setMoviesList', { Search: [] });
        },
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
.imgFixedHeight {
    max-width: 100%;
    height: auto; 
}
@media(min-width: 576px) {
    .truncate {
        display: block;
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
@media(min-width: 576px) {
    .imgFixedHeight {
        max-width: 100%;
        height: 300px;
        object-fit: contain; 
    }
}
</style>