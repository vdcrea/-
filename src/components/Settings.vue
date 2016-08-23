<template>
    <div class="settings">
        <div class="columns">
            <div class="column">
                <div class="padding">

                    <h1 class="title is-1">
                        {{ 'nav.settings' | translate }}
                    </h1>

                    <label class="label padding-top">
                        {{ 'settings.language' | translate }}
                    </label>
                    <p class="control">
                        <span class="select">
                            <select
                                @change="changeLang($event)">
                                <option v-for="lang in settings.locales"
                                    :value="lang.value"
                                    :selected="isCurrent(lang.value)"
                                    v-text="lang.text">
                                </option>
                            </select>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    setLang
} from '../vuex/actions'

export default {
    vuex: {
        actions: {
            setLang: setLang
        },
        getters: {
            user: state => state.user,
            settings: state => state.settings
        }
    },
    methods: {
        changeLang(event) {
            this.setLang(event.target.value)
        },
        isCurrent(lang) {
            if (this.settings.lang == lang) {
                return true
            } else {
                return false
            }
        }
    }
}
</script>
