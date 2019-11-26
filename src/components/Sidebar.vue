<template>
    <div class="col-12 col-sm-4">
        <span class="heading">Your Lists</span>
        <b-button class="d-sm-none d-xs-block float-right mt-1" variant="primary" v-b-toggle.collapse-lists @click="showListsOnMobile = !showListsOnMobile">{{ showListsOnMobile ? '-' : '+'}}</b-button>
        <b-collapse id="collapse-lists" class="dont-collapse-sm">
            <div v-if="!$store.getters.user.loggedIn">
                <router-link to="/login">
                    Login to view your lists
                </router-link>
            </div>
            <div v-else>
                <b-form-select
                    class="mb-2 mr-sm-2 mb-sm-0"
                    :value="null"
                    :options="listsWithId"
                    id="add-list-select"
                    @change="setCurrentList"
                    >
                    <template v-slot:first>
                        <option :value="null">Select List...</option>
                    </template>
                </b-form-select>
                <div class="border border-dark rounded mt-2" v-if="showDragBox" @drop="drop" @dragover="allowDrop">
                    <p class="d-none d-sm-block" v-if="!listHasMovies">Drag movie here to add to list</p>
                    <p class="d-sm-none" v-if="!listHasMovies">Click add button to add movie to list</p>
                    <div class="text-center" v-for="movie in this.$store.getters['list/getMovies']($store.getters['list/currentList'].id).movies" :key="movie.imdbID">
                        <div class="img-wrap">
                            <span class="close" @click="deleteMovieFromList(movie.imdbID)">&times;</span>
                            <router-link  :to="'/moviedetails?id=' + movie.imdbID">
                                <img class="img-fluid mx-auto d-block" v-if="movie.Poster != 'N/A'" :src="movie.Poster"/>
                                <img class="img-fluid mx-auto d-block" v-else src="../assets/film-poster-placeholder.png"/>
                            </router-link>
                        </div>
                        <router-link :to="'/moviedetails?id=' + movie.imdbID" >
                            {{ movie.Title }}
                        </router-link>
                    </div>
                </div>
            </div>
        </b-collapse>
    </div>
</template>

<script>
import firebase from 'firebase';

export default {
    mounted() {
        this.setSelectValue();
    },
    updated() {
        this.setSelectValue();
    },
    data() {
        return {
            showListsOnMobile: false,
        }
    },
    computed: {
        listsWithId: {
            get() {
                let lists = this.$store.getters['list/lists'];
                let arr = [];
                lists.forEach((list) => {
                    arr.push({ value: list.id, text: list.name });
                    // arr.push({...{ value: list.id, text: list.name }, ...list});
                })
                return arr;
            },
            set(lists) {
                this.lists = lists;
            }
        },
        showDragBox() {
            return this.$store.getters['list/currentList'].id != '';
        },
        listHasMovies() {
            return this.$store.getters['list/getMovies'](this.$store.getters['list/currentList'].id).movies.length != 0;
        },
    },
    methods: {
        allowDrop(ev) {
            ev.preventDefault();
        },
        drop(ev) {
            ev.preventDefault();
            let id = ev.dataTransfer.getData("text");
            if(id) {
                this.$root.$emit('addMovieToList', id);
            }
        },
        setSelectValue() {
            if(document.getElementById('add-list-select')){
                document.getElementById('add-list-select').value = this.$store.getters['list/currentList'].id;
                
            }
        },
        setCurrentList() {
            let select = document.getElementById('add-list-select');
            let id = select.options[select.selectedIndex].value;
            let name = select.options[select.selectedIndex].text;
            let selected = { id, name };
            if(id == '')
                selected = { id: '', name: null };                
            this.$store.commit('list/setCurrentList', selected);
        },
        deleteMovieFromList(movieId) {
            const db = firebase.firestore();
            let listId = this.$store.getters['list/currentList'].id;
            db
                .collection('users')
                .doc(firebase.auth().currentUser.uid)
                .collection('lists')
                .doc(listId)
                .update({
                    movies: firebase.firestore.FieldValue.arrayRemove(this.$store.getters['list/getMovie'](listId, movieId))
                });
        }
    }
}
</script>

<style scoped>
@media (min-width: 576px) {
  .collapse.dont-collapse-sm {
    display: block !important;
    height: auto !important;
    visibility: visible;
  }
}
.img-wrap {
    position: relative;
}
.img-wrap .close {
    position: absolute;
    top: 5px;
    right: 10px;
    z-index: 100;
    background-color: #FFF;
    padding: 5px 2px 2px;
    color: #000;
    font-weight: bold;
    cursor: pointer;
    opacity: .2;
    text-align: center;
    font-size: 22px;
    line-height: 10px;
    border-radius: 50%;
    padding-bottom: 5px;
}

.heading {
    font-size: 2em;
    font-weight: bold;
}
</style>