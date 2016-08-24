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
                    :class="{ 'is-primary': isProcessing, 'is-disabled': isProcessing, 'is-loading': isProcessing }">
                        {{ 'images.addNewImages' | translate }}
                </label>
                {{ 'images.dropFiles' | translate }}
            </p>
        </div>
        <div class="padding-v">
            <div class="wall">
                <div v-for="image in images"
                    class="brick">
                    <image-card :image="image"></image-card>
                    <!-- <div class="card">
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
                    </div> -->
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
// libs
import W from 'freewall'
import Jimp from 'jimp'
// store
import {
    saveImageItem,
    updateImageItem,
    removeImageItem
} from '../../vuex/actions'
// mixins & components
import mixinPagination from '../../mixins/pagination'
import imageCard from './imageCard'

export default {
    data: function () {
        return {
            dragged: false,
            queue: []
        }
    },
    watch: {
        'images': function (val, oldVal) {
            // console.log('new: %s, old: %s', val, oldVal)
            this.initGrid()
        }
    },
    vuex: {
        getters: {
            lokiImages: state => state.images
        },
        actions: {
            saveImageItem: saveImageItem,
            updateImageItem: updateImageItem,
            removeImageItem: removeImageItem
        }
    },
    mixins: [
        mixinPagination
    ],
    computed: {
        isProcessing() {
            if (this.queue.length > 0) {
                return true
            } else {
                return false
            }
        },
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
    components: {
        imageCard
    },
    events: {
        'delete-image': function (lokiId) {
            this.removeImageItem(lokiId)
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
            var queue = this.queue
            var files = [].slice.call(event.target.files || event.dataTransfer.files)
                files.forEach(function (file) {
                    var filename = file.name
                    queue.push(filename)
                    console.log(filename + " pushed to queue");
                    var reader = new FileReader()
                    reader.onload = function(event) {
                        fileLoaded(filename, event.currentTarget.result);
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
                image.scaleToFit(1480,1480)
                    .quality(80)
                    .getBase64(mimeType, function (err, dataUri) {
                        save(filename, dataUri)
                    });
                }).catch(function (err) {
                    console.error(err);
                });
        },
        saveFile(filename, dataUri) {
            this.queue = _.without(this.queue, filename)
            console.log(filename + " removed from queue");
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
}
</style>
