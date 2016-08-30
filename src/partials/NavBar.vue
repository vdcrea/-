<template>
    <nav id="main-nav"
        class="nav has-shadow">

        <div class="nav-left">
            <a class="nav-item"
                v-link="{ path: '/', exact: true }">
                <img src="../assets/art/scrib.svg" alt="Scrib" />
            </a>
        </div>

        <span class="nav-toggle"
            @click="toggleMenu()"
            :class="mobileMenu ? 'is-active' : ''">
            <span></span>
            <span></span>
            <span></span>
        </span>

        <div class="nav-right nav-menu"
            :class="mobileMenu ? 'is-active' : ''">
            <a  class="nav-item is-tab"
                v-link="{ path: '/', exact: true }"
                @click="closeMenu()">
                {{ 'nav.documents' | translate }}
            </a>
            <a  class="nav-item is-tab"
                v-link="{ name: 'Edit', params: { 'doc': 'new' } }"
                @click="closeMenu()">
                Create new
            </a>
            <a  class="nav-item is-tab"
                v-link="{ name: 'Templates' }"
                @click="closeMenu()">
                {{ 'nav.templates' | translate }}
            </a>
            <a  class="nav-item is-tab"
                v-link="{ name: 'Edit Template', params: { 'template': 'new' } }"
                @click="closeMenu()">
                Create new template
            </a>
            <a  class="nav-item is-tab"
                v-link="{ name: 'Images' }"
                @click="closeMenu()">
                {{ 'nav.images' | translate }}
            </a>
            <a  class="nav-item is-tab"
                v-link="{ name: 'Settings' }"
                @click="closeMenu()">
                {{ 'nav.settings' | translate }}
            </a>
        </div>

    </nav>
</template>



<script>
export default {
    data() {
        return {
            mobileMenu: false
        }
    },
    methods: {
        toggleMenu() {
            this.mobileMenu = !this.mobileMenu
        },
        closeMenu() {
            this.mobileMenu = false
        }
    }
}
</script>



<style lang="scss">
@import '../assets/variables';

#main-nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    z-index: 100;
    .is-tab {
        position: relative;
        border: 0;
        &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            right: 50%;
            width: 0;
            height: 1px;
            background: $blue;
            transition: all .2s ease-in-out;
        }
        &:hover {
            &:after {
                left: 0;
                right: 0;
                width: 100%;
            }
        }
        &.is-active {
            &:after {
                height: 3px;
                left: 0;
                right: 0;
                width: 100%;
            }
        }
    }
}
</style>
