<template>
<div class="edit">

    <div class="column is-10-tablet is-offset-1-tablet is-8-desktop is-offset-2-desktop">

        <div class="padding">

        <h1 class="title padding-top has-text-centered"
            v-text="doc.title || $t('doc.untitled', $store.state.settings.lang)">
        </h1>

        <div class="box">
            <div class="content mf">

                <div class="columns">
                    <div class="column is-5">
                        <div class="form-group">
                            <input :class="{ 'has-value' : doc.title }"
                                type="text"
                                v-model="doc.title"
                                @input="save"/>
                            <label for="input"
                                class="control-label">
                                {{ 'doc.title' | translate }}
                            </label><i class="bar"></i>
                        </div>
                    </div>

                    <div class="column is-7">
                        <div class="form-group">
                            <input :class="{ 'has-value' : doc.subtitle }"
                                type="text"
                                v-model="doc.subtitle"
                                @input="save"/>
                            <label for="input"
                                class="control-label">
                                {{ 'doc.subtitle' | translate }}
                            </label><i class="bar"></i>
                        </div>
                    </div>
                </div>


                <input type="file"
                    name="files[]"
                    id="files"
                    @change="selectFile($event, readFile, saveFile)"/>
                <label for="files"
                    class="dropzone"
                    @dragover.prevent="dragStart"
                    @dragend.prevent="dragEnd"
                    @dragleave.prevent="dragEnd"
                    @drop="selectFile($event, readFile, saveFile)"
                    :class="{ 'has-image' : doc.img.dataUri, 'is-processing': processingImage }">
                        <img v-if="doc.img.dataUri" :src="previewImage" alt="" />
                        <span class="dropzone-label"
                            v-text="dropzoneLabel">
                        </span>
                </label>

                <div class="form-group">
                    <textarea :class="{ 'has-value' : doc.header }"
                        type="text"
                        v-model="doc.header"
                        @input="saveAndResize($event)">
                    </textarea>
                    <label for="textarea"
                        class="control-label">
                        {{ 'doc.header' | translate }}
                    </label><i class="bar"></i>
                </div>

                <div class="columns">
                    <div class="column is-8">
                        <div class="form-group">
                            <textarea :class="{ 'has-value' : doc.text }"
                                type="text"
                                v-model="doc.text"
                                @input="saveAndResize($event)">
                            </textarea>
                            <label for="textarea"
                                class="control-label">
                                {{ 'doc.text' | translate }}
                            </label><i class="bar"></i>
                        </div>
                    </div>

                    <div class="column is-4">
                        <div class="form-group">
                            <textarea :class="{ 'has-value' : doc.aside }"
                                type="text"
                                v-model="doc.aside"
                                @input="saveAndResize($event)">
                            </textarea>
                            <label for="textarea"
                                class="control-label">
                                {{ 'doc.aside' | translate }}
                            </label><i class="bar"></i>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <textarea :class="{ 'has-value' : doc.footer }"
                        type="text"
                        v-model="doc.footer"
                        @input="saveAndResize($event)">
                    </textarea>
                    <label for="textarea"
                        class="control-label">
                        {{ 'doc.footer' | translate }}
                    </label><i class="bar"></i>
                </div>

            </div>
        </div>

    <!-- <pre>
        {{doc|json}}
    </pre> -->
    <!-- <pre>
        {{lokiDocs|json}}
    </pre> -->

        </div>
    </div>


    <div class="bgsvg">
        <svg width="100%" height="100%"
            :viewBox="viewBox"
            preserveAspectRatio="xMidYMid slice">
            <image x="0" y="0"
                :width="doc.img.width"
                :height="doc.img.height"
                filter = "url(#blur)"
                opacity=".4"
                v-bind="{'xlink:href': backgroundSvg}" />
            <filter id="blur">
                <feGaussianBlur stdDeviation="2" />
            </filter>
        </svg>
    </div>

</div>
</template>

<script>
import Jimp from 'jimp'

import {
    saveDoc,
    updateDoc,
    deleteDoc
} from '../vuex/actions'

export default {
    data() {
        return {
            dragged: false,
            processingImage: false,
            messages: [],
            template: {
                img: {
                    width: 600,
                    height: 200
                }
            },
            doc: {
                title: '',
                subtitle: '',
                header: '',
                text: '',
                footer: '',
                aside: '',
                img: {
                    name: '',
                    dataUri: '',
                    width: 0,
                    height: 0
                }
            }
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
    computed: {
        previewImage(){
            if (this.doc.img.dataUri) {
                var dataUri = this.doc.img.dataUri
                var mimeType = dataUri.split(',')[0].split(':')[1].split(';')[0]
                var data = dataUri.replace(/^data:image\/\w+;base64,/, '')
                var imgBuffer = new Buffer(data,'base64')
                var width = this.template.img.width
                var height = this.template.img.height
                var imgResized = ''
                Jimp.read(imgBuffer, function (err, image) {
                    image.cover(width,height)
                        .getBase64(mimeType, function (err, dataUri) {
                            imgResized = dataUri
                        });
                    }).catch(function (err) {
                        console.error(err);
                    });
                return imgResized
            } else {
                return ''
            }
        },
        viewBox(){
            return '0 0 ' + this.doc.img.width + ' ' + this.doc.img.height
        },
        backgroundSvg() {
            if (this.doc.img.dataUri) {
                return this.doc.img.dataUri
            } else {
                return ''
            }
        },
        dropzoneLabel() {
            if (this.dragged) {
                return this.$t('doc.imgDragged', this.$store.state.settings.lang)
            } else if (this.processingImage) {
                return this.$t('doc.imgProcessed', this.$store.state.settings.lang)
            } else {
                return this.$t('doc.addImage', this.$store.state.settings.lang)
            }
        }
    },
    route: {
        data() {
            if (this.$route.params.doc != 'new') {
                this.getDoc(parseInt(this.$route.params.doc))
            } else {
                this.doc = {
                    title: '',
                    subtitle: '',
                    header: '',
                    text: '',
                    footer: '',
                    aside: '',
                    img: {
                        name: '',
                        dataUri: '',
                        width: 0,
                        height: 0
                    }
                }
            }
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
        save(){
            if (this.doc.$loki) {
                this.updateDoc(this.doc)
            } else {
                this.saveDoc(this.doc)
            }
        },
        saveAndResize(event) {
            this.save()
            var currentHeight = event.target.style.height
            event.target.style.marginTop = currentHeight
            event.target.style.height = ''; /* Reset the height*/
            event.target.style.height = Math.min(event.target.scrollHeight, 500) + "px";
            //event.target.style.height = event.target.scrollHeight + "px";
            event.target.style.marginTop = ''
        },
        resizeTextareas() {
            var textareas = document.getElementsByTagName('textarea')
            for (var i = 0; i < textareas.length; i++) {
                var currentHeight = textareas[i].style.height
                textareas[i].style.height = ''
                textareas[i].style.marginTop = currentHeight
                textareas[i].style.height = Math.min(textareas[i].scrollHeight, 500) + "px"
                //textareas[i].style.height = textareas[i].scrollHeight + "px"
                textareas[i].style.marginTop = ''
            }
        },
        getDoc(id) {
            var doc = this.lokiDocs.find({'$loki': id})
            if (doc) {
                this.doc = doc[0]
            }
        },
        selectFile(event, read, save) {
            event.preventDefault()
            this.dragged = false

            var messages = this.messages
            var errorMsgFileFormat = this.$t('images.notFormat', this.$store.state.settings.lang)
            var errorMsgFileExists = this.$t('images.testFile', this.$store.state.settings.lang)

            var files = [].slice.call(event.target.files || event.dataTransfer.files)

            var image = files[0]
            var filename = image.name
            var mimetype = image.type
            var filetype = mimetype.split('/')[1]

            var authorizedFormats = ['jpg', 'png', 'jpeg']
            var allowedFormat = authorizedFormats.indexOf(filetype) > -1

            if (allowedFormat) {
                this.processingImage = true
                var reader = new FileReader()
                    reader.onload = function(event) {
                        read(filename, event.currentTarget.result, save);
                    }
                    reader.readAsDataURL(image)
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
        },
        readFile(filename, dataUri, save) {
            var mimeType = dataUri.split(",")[0].split(":")[1].split(";")[0]
            var data = dataUri.replace(/^data:image\/\w+;base64,/, "")
            var imgBuffer = new Buffer(data,'base64')
            Jimp.read(imgBuffer, function (err, image) {
                image.scaleToFit(1280,1280).quality(80)
                var width = image.bitmap.width
                var height = image.bitmap.height
                image.getBase64(mimeType, function (err, dataUri) {
                        save(filename, dataUri, width, height)
                    });
                }).catch(function (err) {
                    console.error(err);
                });
        },
        saveFile(filename, dataUri, width, height) {
            this.processingImage = false
            this.doc.img = {"name": filename, "dataUri": dataUri, "width": width, "height": height}
            this.save()
        }
    },
    components: {},
    ready() {
        this.resizeTextareas()
        window.addEventListener('resize', this.resizeTextareas)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeTextareas)
    }
}
</script>

<style lang="scss">
@import "../assets/variables";
.edit {
    position: relative;
    .bgsvg {
        display: block;
        position: fixed;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .column {
        position: relative;
        z-index: 10;
    }
    input[type="file"] {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }
    .dropzone {
        display: block;
        position: relative;
        margin-top: 10px;
        min-height: 100px;
        text-align: center;
        border: 1px dotted #ccc;
        transition: all .2s ease-in-out;
        color: #999;
        background: #f5f7fa;
        img {
            width: 100%;
            height: auto;
            transition: all .2s ease-in-out;
            z-index: 2;
        }
        .dropzone-label {
            display: block;
            line-height: normal;
            position: absolute;
            bottom: 10px;
            left: 10px;
            right: 10px;
            z-index: 1;
            @media screen and (min-width: 768px) {
                bottom: 20px;
                left: 20px;
                right: 20px;
            }
            &:before {
                display: block;
                font-family: 'brandguidelight';
                font-size: 30px;
                text-align: center;
                content: '\e816';
            }
        }
        &.has-image {
            border: none;
            line-height: 0;
            min-height: inherit;
            .dropzone-label {
                display: none;
            }
            &.is-processing {
                .dropzone-label {
                    z-index: 3;
                    display: block;
                    color: #333;
                }
                img {
                    opacity: .2;
                }
            }
            &:hover {
                .dropzone-label {
                    color: #333;
                }
            }
        }
        &.is-processing {
            .dropzone-label {
                z-index: 3;
                display: block;
            }
            img {
                opacity: .2;
            }
        }
        &:hover {
            color: $blue;
            border-color: $blue;
            img {
                opacity: .2;
            }
            .dropzone-label {
                z-index: 3;
                display: block;
                color: $blue;
            }
        }
    }
}
</style>
