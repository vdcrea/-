<template>

    <nav class="pagination padding-top"
        v-show="totalPages > 1">
        <a class="button"
            :class="{ 'is-disabled': prevPage == 0 }"
            @click.prevent="changePage(prevPage)"
            aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
        </a>
        <a class="button"
            :class="{ 'is-disabled': nextPage > totalPages }"
            @click.prevent="changePage(nextPage)"
            aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
        </a>
        <ul>
            <li v-for="page in totalPages">
                <a class="button"
                    :class="{ 'is-primary': currentPage == $index + 1 }"
                    @click.prevent="changePage($index + 1)">
                    {{ $index + 1 }}
                </a>
            </li>
        </ul>
    </nav>

</template>

<script>
export default {
    props: {
        currentPage: {
            type: Number,
            required: true
        },
        totalPages: {
            type: Number,
            required: true
        },
        callback: {
            type: Function,
            required: true
        },
        totalEntries: Number,
        entriesPerPage: Number
    },
    computed: {
        prevPage() {
            return this.currentPage - 1
        },
        nextPage() {
            return this.currentPage + 1
        }
    },
    methods: {
        changePage(page) {
            this.callback(page)
        }
    }
}
</script>
