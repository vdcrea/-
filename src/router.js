import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './vuex/store'

Vue.use(VueRouter)

// Components
import Home from './components/Home'
import Documents from './components/Documents'
import Images from './components/Images'

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
    '/images': {
		name: 'Images',
		component: Images
    },
    '*': {
        component: Documents
    }
})

export default router
