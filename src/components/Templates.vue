<template>
    <div class="templates padding">
        <div class="wall">
            <div v-for="template in templates"
                class="brick">
                <div class="card is-fullwidth"
                    id="template-{{template.id}}">

                    <header class="card-header">
                        <p class="card-header-title"
                            v-text="template.title">
                        </p>
                        <a class="card-header-icon"
                            @click="deleteTemplate(template.$loki)">
                            delete
                        </a>
                    </header>

                    <footer class="card-footer">
                        <a class="card-footer-item"
                            v-link="{ name: 'Edit Template', params: { 'template': template.$loki } }">
                            Edit
                        </a>
                    </footer>
                </div>
            </div>
        </div>

        <pagination
            v-show="totalPages > 1"
            :current-page="pagination.currentPage"
            :total-pages="totalPages"
            :callback="setPage">
        </pagination>

        <pre>
            {{templates|json}}
        </pre>
    </div>
</template>

<script>
import W from 'freewall'

import {
    saveTemplate,
    updateTemplate,
    deleteTemplate
} from '../vuex/actions'

import mixinPagination from '../mixins/pagination'

export default {
    mixins: [
        mixinPagination
    ],
    computed: {
        totalEntries() {
            return this.lokiTemplates.idIndex.length
        },
        totalPages(){
            return Math.ceil(this.totalEntries/this.pagination.entriesPerPage)
        },
        resultsOffset(){
            return (this.pagination.currentPage * this.pagination.entriesPerPage) - this.pagination.entriesPerPage
        },
        templates(){
            var templates = this.lokiTemplates
                .chain()
                .simplesort('$loki', true)
                .offset(this.resultsOffset)
                .limit(this.pagination.entriesPerPage)
                .data()
            return templates
        }
    },
    watch: {
        'templates': function (val, oldVal) {
            // console.log('new: %s, old: %s', val, oldVal)
            this.initGrid()
        }
    },
    vuex: {
        getters: {
            lokiTemplates: state => state.user.templates
        },
        actions: {
            saveTemplate: saveTemplate,
            updateTemplate: updateTemplate,
            deleteTemplate: deleteTemplate
        }
    },
    methods: {
        initGrid() {
            var wall = new W.Freewall(".wall")
                wall.reset({
                    selector: '.brick',
                    animate: true,
                    cellW: 260,
                    cellH: 'auto'
                })
                wall.container.find('.brick img').load(function() {
                    wall.fitWidth();
                })
                wall.fitWidth()
        },
    },
    ready() {
        this.initGrid()
        window.addEventListener('resize', this.initGrid)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.initGrid)
    }
    // ,
    // methods: {
    //     saveNewTemplate() {
    //
    //         console.log('html edited');
    //     }
    // }
}
</script>

<style lang="scss">

</style>
