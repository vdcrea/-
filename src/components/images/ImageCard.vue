<template>
    <div class="card is-fullwidth">
        <!-- <a class="delete-image"
            @click.prevent="delete(image.$loki)">
            &#215;
        </a> -->
        <div class="card-image">
            <!-- <a :href="image.data" target="_blank"> -->
                <img :src="image.data"/>
            <!-- </a> -->
        </div>
        <div class="card-content padding-s">
            <div class="content">
                <small>
                    <span class="icon is-small">
                        <i class="fa icon-picture"></i>
                    </span> <span v-text="image.name"></span><br/>
                    <span class="icon is-small">
                        <i class="fa icon-calendar"></i>
                    </span> <span v-text="dateFormat(image.meta.created)"></span>
                </small>
            </div>
        </div>
        <footer class="card-footer">
            <a class="card-footer-item"
                :href="image.data"
                target="_blank">Download</a>
            <a class="card-footer-item"
                @click.prevent="delete(image.$loki)">Delete</a>
        </footer>
    </div>
</template>



<script>
import mixinDateFormat from '../../mixins/dateFormat'
export default {
    props: ['image'],
    mixins: [
        mixinDateFormat
    ],
    methods: {
        delete(lokiId) {
            this.$dispatch('delete-image', lokiId)
        }
    }
}
</script>


<style lang="scss">
@import "../../assets/variables";
.card {
    // .card-image {
    //     a {
    //         display: block;
    //         position: relative;
    //         background: #000;
    //         color: #fff;
    //         line-height: 0;
    //         img {
    //             transition: all .2s ease-in-out;
    //         }
    //         &:after {
    //             display: none;
    //             font-family: 'brandguidelight';
    //             content: '\e802';
    //             position: absolute;
    //             left: 50%;
    //             top:50%;
    //             margin-left: -32px;
    //             margin-top: -32px;
    //             width: 64px;
    //             font-size: 2em;
    //             height: 64px;
    //             line-height: 64px;
    //             text-align: center;
    //             transition: all .2s ease-in-out;
    //         }
    //         &:hover {
    //             &:after {
    //                 color: $blue;
    //             }
    //         }
    //     }
    // }
    // .delete-image {
    //     display: block;
    //     width: 30px;
    //     height: 30px;
    //     line-height: 30px;
    //     border-radius: 15px;
    //     background: white;
    //     opacity: 0;
    //     position: absolute;
    //     top: -10px;
    //     right: -10px;
    //     z-index: 10;
    //     text-align: center;
    //     box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);
    //     &:hover {
    //         background: $blue;
    //         color: white;
    //     }
    // }
    // &:hover {
    //     .card-image {
    //         a {
    //             img {
    //                 opacity: .5;
    //             }
    //             &:after {
    //                 display: block;
    //             }
    //         }
    //     }
    //     .delete-image {
    //         opacity: 1
    //     }
    // }
    .icon {
        vertical-align:baseline;
        margin-right: 3px;
    }
}
</style>
