import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './vuex/store'

Vue.use(VueRouter)

// Components
import Home from './components/Home'
import Edit from './components/Edit'
import Documents from './components/Documents'
import Images from './components/images/Images'
import Settings from './components/Settings'
import Welcome from './components/welcome/Welcome'

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
		//,
        //brand: true
    },
	'/edit/:doc': {
		name: 'Edit',
		component: Edit
	},
	'/welcome': {
		name: 'Welcome',
		component: Welcome
    },
    '/images': {
    	name: 'Images',
    	component: Images
		//,
        // brand: true
    },
    '/settings': {
		name: 'Settings',
		component: Settings
    },
    '*': {
        component: Documents
    }
})

router.beforeEach(function (transition) {
	if (transition.to.brand && !store.state.settings.currentBrand) {
		transition.redirect('/welcome')
	} else {
		transition.next()
	}
})

export default router
