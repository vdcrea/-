<template>
    <div id="images"
        class="images padding"
        @dragover.prevent="dragStart"
        @dragend.prevent="dragEnd"
        @dragleave.prevent="dragEnd"
        @drop="dropFile($event, testFile, readFile, saveFile)">

        <!-- :class="{ 'dragged': dragged }" -->

        <div class="upload">
            <input type="file"
                    name="files[]"
                    id="files"
                    v-el:new-brand-image
                    @change="dropFile($event, testFile, readFile, saveFile)"
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
            <div v-for="alert in messages"
                class="notification"
                :class="alert.class"
                transition="alert"
                stagger="200">
                <button class="delete"
                    @click="closeAlert($index)"></button>
                <span v-text="alert.message"></span>
            </div>
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
            queue: [],
            messages: []
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
            lokiImages: state => state.brand.images
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
        'delete-image': function (id) {
            this.removeImageItem(id)
        }
    },
    methods: {
        closeAlert(i) {
            this.messages.splice(i,1);
        },
        dragStart() {
            this.dragged = true
        },
        dragEnd() {
            this.dragged = false
        },
        testFile(name) {
            var image = this.lokiImages.findOne({'name': name})
            if (image) {
                return true
            } else {
                return false
            }
        },
        dropFile(event, test, read, save) {
            event.preventDefault()
            this.dragged = false
            var queue = this.queue
            var messages = this.messages
            var errorMsgFileFormat = this.$t('images.notFormat', this.$store.state.settings.lang)
            var errorMsgFileExists = this.$t('images.testFile', this.$store.state.settings.lang)

            var files = [].slice.call(event.target.files || event.dataTransfer.files)
                files.forEach(function (file) {
                    var filename = file.name
                    var mimetype = file.type
                    var filetype = mimetype.split('/')[1]

                    var authorizedFormats = ['jpg', 'png', 'jpeg']
                    var allowedFormat = authorizedFormats.indexOf(filetype) > -1

                    if (!test(filename) && allowedFormat) {
                        queue.push(filename)
                        var reader = new FileReader()
                        reader.onload = function(event) {
                            read(filename, mimetype, event.currentTarget.result, save);
                        }
                        reader.readAsDataURL(file)
                    } else if (!allowedFormat) {
                        var message = {
                            'message': filename + errorMsgFileFormat,
                            'class': 'is-danger'
                        }
                        messages.push(message)
                    } else {
                        var message = {
                            'message': filename + errorMsgFileExists,
                            'class': 'is-danger'
                        }
                        messages.push(message)
                    }
                })
        },
        readFile(filename, mimetype, dataUri, save) {
            var data = dataUri.replace(/^data:image\/\w+;base64,/, "")
            var imgBuffer = new Buffer(data,'base64')

            Jimp.read(imgBuffer, function (err, image) {
                image.scaleToFit(1480,1480)
                    .quality(80)
                    .getBase64(mimetype, function (err, dataUri) {
                        save(filename, dataUri)
                    });
                }).catch(function (err) {
                    console.error(err);
                });
        },
        saveFile(filename, dataUri) {
            this.queue = _.without(this.queue, filename)
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
