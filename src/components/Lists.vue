<template>
    <div>
        <navbar/>
        <div class="container">
            <div class="row">
                <div class="col-12" v-if="!$store.getters.user.loggedIn">
                    <router-link to="/login">
                        <b-button variant="primary" class="mt-2">Login to create/delete lists</b-button>
                    </router-link>
                </div>
                <div v-else class="col-12">
                    <h3>Add new List</h3>
                    <b-form inline>
                        <label class="sr-only" for="list-name">List Name</label>
                        <b-input
                        id="list-name"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="List Name"
                        v-model="listName"
                        ></b-input>
                        <b-button variant="primary" @click="addList">Add list</b-button>
                    </b-form>
                    <b-alert v-model="showAddStatus" variant="primary" dismissible>
                        {{ addStatus }}
                    </b-alert>
                    <h3>Delete List</h3>
                    <b-form inline>
                        <b-form-select
                            class="mb-2 mr-sm-2 mb-sm-0"
                            :value="null"
                            :options="listsWithId"
                            id="delete-list-select"
                            @change.native="setCurrentList"
                            >
                            <template v-slot:first>
                                <option :value="null">Choose List...</option>
                            </template>
                        </b-form-select>
                        <b-button variant="danger" @click="deleteList">Delete</b-button>
                    </b-form>
                    <b-alert v-model="showDeleteStatus" variant="primary" dismissible>
                        {{ deleteStatus }}
                    </b-alert>
                    <div class="row">
                        <div class="col-12 col-sm-4 text-center" v-for="movie in this.$store.getters['list/getMovies']($store.getters['list/currentList'].id).movies" :key="movie.imdbID">
                            <div class="img-wrap">
                                <span class="close" @click="deleteMovieFromList(movie.imdbID)">&times;</span>
                                <router-link  :to="'/moviedetails?id=' + movie.imdbID">
                                    <img class="imgFixedHeight mt-2 mx-auto d-block" v-if="movie.Poster != 'N/A'" :src="movie.Poster"/>
                                    <img class="imgFixedHeight mt-2 mx-auto d-block" v-else src="../assets/film-poster-placeholder.png"/>
                                </router-link>
                            </div>
                            <router-link class="truncate" :to="'/moviedetails?id=' + movie.imdbID" >
                                {{ movie.Title }}
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from './Navbar';
import movieShared from '../shared/movieShared';
import firebase from 'firebase';
import listShared from '../shared/listShared';

export default {
    name: 'Lists',
    components: {
        'navbar': Navbar,
    },
    created() {
        this.deleteMovieFromList = movieShared.deleteMovieFromList;
        this.setCurrentList = listShared.setCurrentList;
    },
    mounted() {
        this.setCurrentList();
    },
    data() {
        return {
            lists: [],
            listName: '',
            addStatus: '',
            deleteStatus: '',
        }
    },
    computed: {
        showAddStatus: {
            get(){
                return this.addStatus != '';
            },
            set(val) {
                this.addStatus = val;
            }
        },
        showDeleteStatus: {
            get() {
                return this.deleteStatus != '';
            },
            set(val) {
                this.deleteStatus = val;
            }
        },
        listsWithId: {
            get() {
                let lists = this.$store.getters['list/lists'];
                let arr = [];
                lists.forEach((list) => {
                    arr.push({...{ value: list.id, text: list.name }, ...list});
                })
                return arr;
            },
            set(lists) {
                this.lists = lists;
            }
        }
    },
    methods: {
        addList() {
            if(!this.listName) {
                this.addStatus = 'Please enter a name';
                return;
            }
            const db = firebase.firestore();
            db
                .collection('users')
                .doc(firebase.auth().currentUser.uid)
                .collection('lists')
                .add({
                    name: this.listName,
                    createdAt: new Date(),
                    movies: []
                })
                .then(() => {
                    this.addStatus = 'Successfully created list ' + this.listName;
                })
                .catch((err) => {
                    this.addStatus = 'Failed. ' + err; 
                });
        },
        deleteList() {
            let select = document.getElementById('delete-list-select');
            let id = select.options[select.selectedIndex].value;
            const db = firebase.firestore();
            db
                .collection('users')
                .doc(firebase.auth().currentUser.uid)
                .collection('lists')
                .doc(id)
                .delete()
                .then(() => {
                    this.deleteStatus = 'Successfully deleted list';
                    if(this.$store.getters['list/currentList'].id == id)
                        this.$store.commit('list/setCurrentList', { id: '', name: null });
                })
                .catch((err) => {
                    this.deleteStatus = 'Failed. ' + err;
                });

        }
    }
}
</script>

<style scoped>
.img-wrap {
    position: relative;
}

.img-wrap .close {
    position: absolute;
    top: 5px;
    right: 10px;
    z-index: 100;
    background-color: #FFF;
    padding: 3px 2px 2px;
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