<template>
    <div>
        <navbar/>
        <div class="container">
            <b-tabs content-class="mt-3" class="mt-5">
                <b-tab title="Login" active>
                    <b-form-input v-model="email" placeholder="Email" class="mb-2"></b-form-input>
                    <b-form-input v-model="password" placeholder="Password" type="password" class="mb-2"></b-form-input>
                    <p>{{ loginStatus }}</p>
                    <b-button variant="primary" @click="login">Login</b-button>
                </b-tab>
                <b-tab title="Sign Up">
                    <b-form-input v-model="email" placeholder="Email" class="mb-2"></b-form-input>
                    <b-form-input v-model="password" placeholder="Password" type="password" class="mb-2"></b-form-input>
                    <p>{{ signupStatus }}</p>
                    <b-button variant="primary" @click="signup">Register</b-button>
                </b-tab>
            </b-tabs>
        </div>
    </div>
</template>

<script>
import Navbar from './Navbar';
import firebase from 'firebase';

export default {
    name: 'Login',
    components: {
        'navbar': Navbar,
    },
    mounted() {
    },
    data() {
        return {
            email: '',
            password: '',
            signupStatus: '',
            loginStatus: '',
        }
    },
    methods: {
        login() {
            firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            .then(() => {
                //this.$store.commit('setLoggedIn', true);
                //this.$store.commit('setUser', user);
                this.loginStatus = 'Login successful!';
                this.$router.push({ name: 'Search' });
            },
            (err) => {
                this.loginStatus = 'Oops. ' + err.message;
            }); 
        },
        signup() {
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then(() => {
                this.signupStatus = 'User created!';
            },
            (err) => {
                this.signupStatus = 'Oops. ' + err.message;
            });
        },
    }
}
</script>