<template>
    <div id="images"
        class="images padding"
        @dragover.prevent="dragStart"
        @dragend.prevent="dragEnd"
        @dragleave.prevent="dragEnd"
        @drop="dropFile($event, readFile, saveFile)">

        <!-- :class="{ 'dragged': dragged }" -->

        <div class="upload">
            <input type="file"
                    name="files[]"
                    id="files"
                    v-el:new-brand-image
                    @change="dropFile($event, readFile, saveFile)"
                    multiple />
            <p class="control">
                <label for="files"
                    class="button"
                    :class="{ 'is-primary': dropped, 'is-disabled': dropped, 'is-loading': dropped }">
                        Add new images
                </label>
                or drop files in the browser
            </p>
        </div>
        <div class="padding-v">
            <div class="wall">
                <div v-for="image in images"
                    class="brick">
                    <div class="card">
                        <a class="delete-image"
                            @click.prevent="removeImageItem(image.$loki)">
                            &#215;
                        </a>
                        <div class="card-image">
                            <a :href="image.data" target="_blank"><img :src="image.data"/></a>
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
                    </div>
                </div>
            </div>
        </div>

        <pagination
            v-show="totalPages > 1"
            :current-page="pagination.currentPage"
            :total-pages="totalPages"
            :callback="setPage">
        </pagination>

<!-- <pre>
{{dropped|json}}
</pre> -->

    </div>
</template>

<script>
import W from 'freewall'
import Jimp from 'jimp'

import {
    saveImageItem,
    updateImageItem,
    removeImageItem
} from '../vuex/actions'

import mixinDateFormat from '../mixins/dateFormat'
import mixinPagination from '../mixins/pagination'

export default {
    data: function () {
        return {
            dragged: false,
            dropped: false
        }
    },
    watch: {
        'images': function (val, oldVal) {
            // console.log('new: %s, old: %s', val, oldVal)
            this.dropped = false
            this.initGrid()
        }
    },
    vuex: {
        getters: {
            lokiImages: state => state.brand.images
        },
        actions: {
            saveImageItem: saveImageItem,
            updateImageItem: updateImageItem,
            removeImageItem: removeImageItem
        }
    },
    mixins: [
        mixinDateFormat,
        mixinPagination
    ],
    computed: {
        totalEntries() {
            return this.lokiImages.idIndex.length
        },
        totalPages(){
            return Math.ceil(this.totalEntries/this.pagination.entriesPerPage)
        },
        resultsOffset(){
            return (this.pagination.currentPage * this.pagination.entriesPerPage) - this.pagination.entriesPerPage
        },
        images(){
            var images = this.lokiImages
                .chain()
                .simplesort('$loki', true)
                .offset(this.resultsOffset)
                .limit(this.pagination.entriesPerPage)
                .data()
            return images
        }
    },
    methods: {
        dragStart() {
            this.dragged = true
        },
        dragEnd() {
            this.dragged = false
        },
        dropFile(event, resize, save) {
            event.preventDefault()
            this.dragged = false
            this.dropped = true
            var files = [].slice.call(event.target.files || event.dataTransfer.files)
                files.forEach(function (file) {
                    var reader = new FileReader()
                    reader.onload = function(event) {
                        fileLoaded(file.name, event.currentTarget.result);
                    }
                    reader.readAsDataURL(file)
                })
            function fileLoaded(filename, dataUri) {
                if(/^data:image/.test(dataUri)) {
                    resize(filename, dataUri, save)
                } else {
                    console.log("this is not an image");
                }
            }
        },
        readFile(filename, dataUri, save) {
            var mimeType = dataUri.split(",")[0].split(":")[1].split(";")[0]
            var data = dataUri.replace(/^data:image\/\w+;base64,/, "")
            var imgBuffer = new Buffer(data,'base64')

            Jimp.read(imgBuffer, function (err, image) {
                image.scaleToFit(1200,800)
                    .quality(80)
                    .getBase64(mimeType, function (err, dataUri) {
                        save(filename, dataUri)
                    });
                }).catch(function (err) {
                    console.error(err);
                });
        },
        saveFile(filename, dataUri) {
            this.pagination.currentPage = 1
            var image = {"name": filename, "data": dataUri}
            this.saveImageItem(image)
        },
        initGrid() {
            var wall = new W.Freewall(".wall")
                wall.reset({
                    selector: '.brick',
                    animate: true,
                    cellW: 260,
                    cellH: 'auto',
                    gutterY: 20,
                    gutterX: 20
                })
                wall.container.find('.brick img').load(function() {
                    wall.fitWidth();
                })
                wall.fitWidth()
        }
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

<style lang="scss">
@import "../assets/variables";

.dragged {
    background: #e5e5e5;
}
#images {
    transition: all .2s ease-in-out;
    .upload {
        input[type="file"] {
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
        }
        .button {
            vertical-align: middle;
        }
    }
    .card {
        width: auto;
        .card-image {
            a {
                display: block;
                position: relative;
                background: #000;
                color: #fff;
                line-height: 0;
                img {
                    transition: all .2s ease-in-out;
                }
                &:after {
                    display: none;
                    font-family: 'brandguidelight';
                    content: '\e802';
                    position: absolute;
                    left: 50%;
                    top:50%;
                    margin-left: -32px;
                    margin-top: -32px;
                    width: 64px;
                    font-size: 2em;
                    height: 64px;
                    line-height: 64px;
                    text-align: center;
                    transition: all .2s ease-in-out;
                }
                &:hover {
                    &:after {
                        color: $blue;
                    }
                }
            }
        }
        .delete-image {
            display: block;
            width: 30px;
            height: 30px;
            line-height: 30px;
            border-radius: 15px;
            background: white;
            opacity: 0;
            position: absolute;
            top: -10px;
            right: -10px;
            z-index: 10;
            text-align: center;
            box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);
            &:hover {
                background: $blue;
                color: white;
            }
        }
        &:hover {
            .card-image {
                a {
                    img {
                        opacity: .5;
                    }
                    &:after {
                        display: block;
                    }
                }
            }
            .delete-image {
                opacity: 1
            }
        }
        .icon {
            vertical-align:baseline;
            margin-right: 3px;
        }
    }
}
</style>
