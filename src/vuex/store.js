import Vue from 'vue'
import Vuex from './src'
import mutations from './mutations'
import middlewares from './middlewares'
import loki from 'lokijs'
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter'

Vue.use(Vuex)

// state/store
const state = {
    dbLoaded: false,
    settings: {
        lang: 'en',
        locales: [
            { value: 'en', text: 'English' },
            { value: 'fr', text: 'Français' }
        ],
    },
    brand: {
        colors: {},
        images: {}
    }
}

const store = new Vuex.Store({
    state,
    mutations
})


// indexed database & collections
var idbAdapter = new LokiIndexedAdapter('loki')
var db = new loki('miniscrib',{
    autoload: true,
    autoloadCallback : loadHandler,
    autosave: true,
    autosaveInterval: 10000,
    adapter: idbAdapter
})
function loadHandler () {
    // get collections
    var colors = db.getCollection('colors');
    var images = db.getCollection('images');
    // if collections doesn't exist, create it
    if (colors === null) {
        colors = db.addCollection('colors');
    }
    if (images === null) {
        images = db.addCollection('images');
    }
    // add collections to the state
    state.brand.colors = colors
    state.brand.images = images
    state.dbLoaded = true

    // debug: reset database at every reload
    //images.removeDataOnly()
}
window.onbeforeunload = function() {
    db.close()
}


if (module.hot) {
    module.hot.accept(['./actions', './mutations'], () => {
        const newActions = require('./actions').default
        const newMutations = require('./mutations').default
        store.hotUpdate({
            actions: newActions,
            mutations: newMutations
        })
    })
}


export default store
