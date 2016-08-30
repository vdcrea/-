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
        currentBrand: '',
        lang: 'en',
        locales: [
            { value: 'en', text: 'English' },
            { value: 'fr', text: 'Français' }
        ],
    },
    user: {
        brands: {},
        docs: {},
        templates: {}
    },
    brand: {
        logos: {},
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
    autosaveInterval: 3000,
    adapter: idbAdapter
})
function loadHandler () {
    // get collections
    var brands = db.getCollection('brands');
    var docs = db.getCollection('docs');
    var templates = db.getCollection('templates');
    var logos = db.getCollection('logos');
    var colors = db.getCollection('colors');
    var images = db.getCollection('images');
    // if collections doesn't exist, create them
    if (brands === null) {
        logos = db.addCollection('brands');
    }
    if (docs === null) {
        docs = db.addCollection('docs');
    }
    if (templates === null) {
        templates = db.addCollection('templates');
    }
    if (logos === null) {
        logos = db.addCollection('logos', {
            unique: ['name']
        });
    }
    if (images === null) {
        images = db.addCollection('images', {
            unique: ['name']
        });
    }
    if (colors === null) {
        colors = db.addCollection('colors');
    }
    // add collections to the state
    state.user.brands = brands
    state.user.docs = docs
    state.user.templates = templates

    state.brand.logos = logos
    state.brand.images = images
    state.brand.colors = colors
    state.dbLoaded = true

    // debug: reset database at every reload
    //docs.removeDataOnly()
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
