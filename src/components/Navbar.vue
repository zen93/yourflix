<template>
    <b-navbar toggleable="sm" type="dark" variant="dark">
        <b-navbar-brand href="#">YourFlix </b-navbar-brand>
        <!-- <span class="d-block d-sm-none">{{ totalPrice }} SEK</span> -->
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item>
                    <router-link to="/">
                        Search
                    </router-link>
                </b-nav-item>
                <b-nav-item>
                    <router-link to="/lists">
                        Lists
                    </router-link>
                </b-nav-item>
            </b-navbar-nav>

            <b-navbar-nav v-if="$store.getters.user.loggedIn === true" class="ml-auto">
                <b-nav-item-dropdown :text="$store.getters.user.data.email" >
                    <router-link to="/logout" @click.native="signOut">
                        <b-dropdown-item>
                            <span class="dark-link">Sign out</span>
                        </b-dropdown-item>
                    </router-link>
                </b-nav-item-dropdown>
            </b-navbar-nav>

            <b-navbar-nav v-else class="ml-auto">
                <b-nav-item>
                    <router-link to="/login">
                        Login
                    </router-link>
                </b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
import firebase from 'firebase';

export default {
    created() {
        //this.$store.commit('setUser', window.localStorage.getItem('user'));
    },
    methods: {
        signOut() {
            this.$store.getters.unsubscribe();
            firebase.auth().signOut().then(() => {
                let path = '/';
                if(this.$route.path !== path) {
                    this.$router.push(path);
                }
            });
        }
    }

}
</script>

<style scoped>
a {
    color: white;
}
a:hover {
    color: rgb(202, 202, 202);
}
.dark-link {
    color: black;
}
.dark-link:hover {
    color: gray;
}
</style>