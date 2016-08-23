import pagination from '../partials/Pagination.vue'
import $ from 'jquery'

export default {
    data () {
        return {
            pagination: {
                totalEntries: 0,
                totalPages: 0,
                entriesPerPage: 12,
                currentPage: 1
            }
        }
    },
    components: {
        pagination
    },
    methods: {
        setPage(page){
            this.pagination.currentPage = page
            $('.view').animate( { scrollTop: $('.view').position().top - 50 }, 200 ); // Go
        }
    }
}
