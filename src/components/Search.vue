<template>
    <div>
        <navbar/>
        <div class="container">
            <div class="row">
                <sidebar/>
                <movies/>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from './Navbar';
import Movies from './Movies';
import Sidebar from './Sidebar';

export default {
    name: 'Search',
    components: {
        'navbar': Navbar,
        'movies': Movies,
        'sidebar': Sidebar,
    }
}
</script>