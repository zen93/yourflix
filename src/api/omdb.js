import Config from '../config';
import store from '../store/index';

const BASE_URL = Config.corsURL + Config.omdbBaseURL;
const KEY = Config.omdbKey;

class Omdb {
    handleHTTPError(response) {
        if(response.ok)
           return response;
        throw Error(response.statusText);
    }

    searchByTitle(title, page) {
        return fetch( `${BASE_URL}/?apikey=${KEY}&s=${title}&type=movie&page=${page}`)
                .then(this.handleHTTPError)
                .then(response => response.json())
                .then(data => {
                    if(data['Response'] == 'False') {
                        store.commit('setStatus', 'Failed to load data. ' + data['Error']);
                    }
                    if(data['Response'] == 'True') {
                        store.commit('setStatus', '');
                    }
                    return data;
                })
                .catch((err) => {
                    store.commit('setStatus', 'Error in fetch: ' + err)
                });
    }

    movieDetails(id) {
        return fetch(`${BASE_URL}/?apikey=${KEY}&i=${id}`)
                .then(this.handleHTTPError)
                .then(response => response.json())
                .then(data => {
                    if(data['Response'] == 'False') {
                        store.commit('setStatus', 'Failed to load data. ' + data['Error']);
                    }
                    if(data['Response'] == 'True') {
                        store.commit('setStatus', '');
                    }
                    return data;
                })
                .catch((err) => {
                    store.commit('setStatus', 'Error in fetch: ' + err)
                });
    }
}

const omdb = new Omdb();

export default omdb;