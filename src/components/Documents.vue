<template>
    <div class="documents padding">
        <div class="wall">
            <div v-for="doc in docs"
                class="brick">
                <div class="card is-fullwidth"
                    id="card-{{doc.id}}">
                    {{doc.name}}

                    <header class="card-header">
                        <p class="card-header-title"
                            v-text="doc.title">
                        </p>
                        <a class="card-header-icon"
                            @click="deleteDoc(doc.$loki)">
                            <!-- <i class="fa fa-angle-down"></i> -->
                            delete
                        </a>
                    </header>

                    <footer class="card-footer">
                        <a class="card-footer-item">
                            Send
                        </a>
                        <a class="card-footer-item">
                            Print
                        </a>
                        <a class="card-footer-item"
                            v-link="{ name: 'Edit', params: { 'doc': doc.$loki } }">
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
    </div>
</template>

<script>
import W from 'freewall'

import {
    saveDoc,
    updateDoc,
    deleteDoc
} from '../vuex/actions'

import mixinPagination from '../mixins/pagination'

export default {
    data: function () {
        return {
        }
    },
    vuex: {
        getters: {
            lokiDocs: state => state.user.docs
        },
        actions: {
            saveDoc: saveDoc,
            updateDoc: updateDoc,
            deleteDoc: deleteDoc
        }
    },
    watch: {
        'docs': function (val, oldVal) {
            // console.log('new: %s, old: %s', val, oldVal)
            this.initGrid()
        }
    },
    mixins: [
        mixinPagination
    ],
    computed: {
        totalEntries() {
            return this.lokiDocs.idIndex.length
        },
        totalPages(){
            return Math.ceil(this.totalEntries/this.pagination.entriesPerPage)
        },
        resultsOffset(){
            return (this.pagination.currentPage * this.pagination.entriesPerPage) - this.pagination.entriesPerPage
        },
        docs(){
            var docs = this.lokiDocs
                .chain()
                .simplesort('$loki', true)
                .offset(this.resultsOffset)
                .limit(this.pagination.entriesPerPage)
                .data()
            return docs
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
}
</script>

<style lang="css">
</style>
