import moment from 'moment'

export default {
    methods: {
        dateFormat(date) {
            return moment(date).locale(this.$store.state.settings.lang).format('Do MMMM YYYY')
        }
    }
}
