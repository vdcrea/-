import Vue from 'vue'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import _ from 'lodash'

import router from './router'
import store from './vuex/store'
import Locales from './locales'

import App from './App'

// Vue i18n
Vue.use(VueI18n)
var locales = Locales
// set locales
Object.keys(locales).forEach(function (lang) {
    Vue.locale(lang, locales[lang])
})

Vue.filter('translate', function (value, arg) {
    return this.$t(value, this.$store.state.settings.lang, arg)
})

// Start the app
router.start({
	store,
    components: { App }
}, 'body')
