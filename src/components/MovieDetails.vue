<template>
    <div>
        <navbar/>
        <div class="container">
            <div class="row">
                <sidebar/>
                <div class="col-12 col-sm-8" v-if="this.$store.getters.status === ''">
                    <div class="row">
                        <div class="col-12 col-sm-6">
                            <p>{{ this.$store.getters.status }}</p>
                            <img draggable="true" @dragstart="drag" :id="movieDetails.imdbID"  class="img-fluid" v-if="movieDetails.Poster != 'N/A'" :src="movieDetails.Poster"/>
                            <img draggable="true" @dragstart="drag" :id="movieDetails.imdbID" class="img-fluid" v-else src="../assets/film-poster-placeholder.png"/>
                            <h4>{{ movieDetails.Title }}</h4>
                            <b-button block v-if="$store.getters['list/currentList'].id != ''" :variant="isInList(movieDetails.imdbID)? 'success': 'dark'" class="mt-2 mb-2" @click="addMovieToList(movieDetails.imdbID)">{{ isInList(movieDetails.imdbID) ? '✓ Added to ' + $store.getters['list/currentList'].name : '+ Add to ' + $store.getters['list/currentList'].name }}</b-button>
                            <h5>Plot</h5>
                            <p>{{ movieDetails.Plot }}</p>

                        </div>
                        <div class="col-12 col-sm-6">
                           
                            <b-table-simple resposive>
                                <b-tbody>
                                    <b-tr>
                                        <b-th>Released</b-th>
                                        <b-td>{{ movieDetails.Released }}</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>Rated</b-th>
                                        <b-td>{{ movieDetails.Rated }}</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>Runtime</b-th>
                                        <b-td>{{ movieDetails.Runtime }}</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>Genre</b-th>
                                        <b-td>{{ movieDetails.Genre }}</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>Director</b-th>
                                        <b-td>{{ movieDetails.Director }}</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>Writer</b-th>
                                        <b-td>{{ movieDetails.Writer }}</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>Actors</b-th>
                                        <b-td>{{ movieDetails.Actors }}</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>IMDB Rating</b-th>
                                        <b-td>{{ movieDetails.imdbRating }} ({{ movieDetails.imdbVotes}} votes)</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>Awards</b-th>
                                        <b-td>{{ movieDetails.Awards }}</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>Box Office</b-th>
                                        <b-td>{{ movieDetails.BoxOffice }}</b-td>
                                    </b-tr>
                                </b-tbody>
                            </b-table-simple>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import dragShared from '../shared/dragShared';
import movieShared from '../shared/movieShared';
import { mapState } from 'vuex';

export default {
    name: 'MovieDetails',
    components: {
        'navbar': Navbar,
        'sidebar': Sidebar,
    },
    created() {
        this.drag = dragShared.drag;
        this.addMovieToList = movieShared.addMovieToList;
        this.deleteMovieFromList = movieShared.deleteMovieFromList;
        this.isInList = movieShared.isInList;
    },
    mounted() {
        if(this.currentMovie) { 
            this.getDetails();
        }
    },
    data() {
        return {
            currentMovie: this.$route.query.id,
        }
    },
    methods: {
        getDetails() {
            this.$store.dispatch('movie/movieDetails', this.currentMovie);
        },
    },
    computed: {
        ...mapState('movie', ['movieDetails'])
    }
}
</script>