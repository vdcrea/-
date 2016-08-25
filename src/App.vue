<template>
    <div id="app">
        <div v-if="dbLoaded">
            <nav-bar></nav-bar>
            <div id="app">
            <router-view class="view"
                transition="view"
                transition-mode="out-in">
            </router-view>
        </div>
    </div>
</template>

<script>
import NavBar from './partials/NavBar'
import {
    setLang,
    setBrand
} from './vuex/actions'

export default {
    vuex: {
        actions: {
            setLang: setLang,
            setBrand: setBrand
        },
        getters: {
            settings: state => state.settings,
            dbLoaded: state => state.dbLoaded
        }
    },
    components: {
        NavBar
    },
    methods: {
        getCurrentBrand() {
            var localStorageCurrentBrand = localStorage.getItem('brand')
            if (localStorageCurrentBrand) {
                this.setBrand(localStorageCurrentBrand)
            } else {
                this.$router.go({ name: 'Welcome' })
            }
        },
        getLang() {
            var localStorageLang = localStorage.getItem('lang')
            if (localStorageLang) {
                this.setLang(localStorageLang)
            } else {
                var browserLang = window.navigator.userLanguage || window.navigator.language // Get language
                browserLang = browserLang.substring( 0, 2 ) // Get primary standard
                if (this.settings.locales.indexOf(browserLang) !== -1
                && this.settings.lang != browserLang) {
                    this.setLang(browserLang)
                }
            }
        }
    },
    created() {
        this.getLang()
    }
}
</script>

<style lang="scss">
@import 'assets/bulma';
@import 'assets/forms';
@import 'assets/icons/fontello/css/brandguidelight';

html {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

#app {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    a, input, button {
        transition: all .2s ease-in-out;
    }
}

pre {
    background:#000;
    color:#FFF;
    font-family: monospace;
    padding: 20px;
    margin: 0;
    text-align: left;
}

.padding {
    padding: 20px;
    &-v {
        padding: 20px 0;
    }
    &-s {
        padding: 10px;
    }
    &-top {
        padding: 10px 0 0 0;
    }
}
.nomargin {
    margin: 0 !important;
}

.brick {
    width: 200px;
}

.view {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    &-transition {
        transition: all .3s ease-in-out;
    }
    &-enter, &-leave {
        opacity: 0;
//        transform: translateY(100px);
    }
}

.alert {
    &-transition {
        position: relative;
        transition: all .5s ease-in-out;
    }
    &-enter {
        transform: translateY(50px);
        opacity: 0;
    }
    &-leave {
        opacity: 0;
    }
}
</style>
