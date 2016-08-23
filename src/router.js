import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './vuex/store'

Vue.use(VueRouter)

// Components
import Home from './components/Home'
import Documents from './components/Documents'
import Images from './components/Images'
import Settings from './components/Settings'

// Router options
var router = new VueRouter({
	history: false,
	saveScrollPosition: true,
	linkActiveClass: 'is-active'
})

// Set up routing and match routes to components
router.map({
	'/': {
		name: 'Documents',
		component: Documents
    },
    // '/images/:page': {
	// 	name: 'Images',
	// 	component: Images
    // },
    '/images': {
    	name: 'Images',
    	component: Images
    },    
    '/settings': {
		name: 'Settings',
		component: Settings
    },
    '*': {
        component: Documents
    }
})

export default router
