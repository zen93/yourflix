<template>
    <div>
        <navbar/>
        <div class="container">
            <div class="row">
                <div class="col-12" v-if="!$store.getters.user.loggedIn">
                    <router-link to="/login">
                        Login to create/delete lists
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
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from './Navbar';
import firebase from 'firebase';

export default {
    name: 'Lists',
    components: {
        'navbar': Navbar,
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