<template lang="html">
    <div class="welcome">
        <div class="column is-6-tablet is-offset-3-tablet is-4-desktop is-offset-4-desktop has-text-centered">
            <div class="scrib">
                <h1>
                    <img src="../../assets/art/scrib-w.svg" alt="Scrib" />
                </h1>
                <h2 class="subtitle">
                    <span v-if="!brand.name">
                        {{ 'scrib.tagLine' | translate }}
                    </span>
                    <span v-else>
                        {{ brand.name | capitalize }}
                    </span>
                </h2>

                <div class="box">

                    <div class="brand-name" v-if="!step">
                        <form @submit.prevent="setNewBrand(1)">
                            <p class="control has-addons">
                                <input class="input is-expanded"
                                    type="text"
                                    placeholder="{{ 'welcome.yourBrand' | translate }}"
                                    v-model="brand.name"
                                    autofocus>
                                    <button class="button is-primary"
                                        :class="{ 'is-disabled': !brand.name }"
                                        type="submit">
                                        {{ 'welcome.next' | translate }}
                                    </button>
                            </p>
                        </form>
                    </div>

                    <div class="brand-logo" v-if="step == 1">
                        <input type="file"
                            name="brandlogo[]"
                            id="brandlogo"
                            @change="selectFile($event, readFile, saveFile)" />
                        <label for="brandlogo"
                            class="button is-primary is-fullwidth"
                            :class="{ 'is-disabled': apiCall, 'is-loading': apiCall }">
                                {{ 'welcome.selectYourLogo' | translate }}
                        </label>
                        <p class="padding-top">
                            <small>
                                {{ 'welcome.logoFormat' | translate }}
                            </small>
                        </p>
                    </div>

                </div>

                <div v-for="alert in messages"
                    class="notification"
                    :class="alert.class"
                    transition="alert"
                    stagger="200">
                    <button class="delete"
                        @click="closeAlert($index)"></button>
                    <span v-text="alert.message"></span>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import Jimp from 'jimp'
// store
import {
    saveLogoItem,
    updateLogoItem,
    removeLogoItem
} from '../../vuex/actions'

export default {
    data: function () {
        return {
            step: 0,
            processingLogo: '',
            messages: [],
            brand: {
                name: '',
                logo: 0,
                description: ''
            }
        }
    },
    computed: {
    },
    methods: {
        closeAlert(i) {
            this.res.messages.splice(i,1);
        },
        setNewBrand(nextStep) {
            localStorage.setItem('newBrand', JSON.stringify(this.brand))
            this.step = nextStep
        },
        resetNewBrand() {
            localStorage.removeItem('newBrand')
            this.brand = {
                name: '',
                logo: 0,
                description: ''
            }
            this.step = 0
        },
        getNewBrand() {
            var brand = JSON.parse(localStorage.getItem('newBrand'))
            if (brand) {
                this.brand = brand
                if (brand.name) {
                    this.step = 1
                } else {
                    this.step = 0
                }
            }
        },
        selectFile(event, read, save) {
            event.preventDefault()
            var logo = event.target.files[0] || event.dataTransfer.files.files[0];
            var filename = logo.name
            this.processingLogo = filename

            var reader = new FileReader()
                reader.onload = function(event) {
                    fileLoaded(filename, event.currentTarget.result);
                }
                reader.readAsDataURL(logo)

            function fileLoaded(filename, dataUri) {
                if(/^data:image/.test(dataUri)) {
                    read(filename, dataUri, save)
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
            this.processingLogo = ''
            var logo = {"name": filename, "data": dataUri}
            this.saveLogoItem(logo)
        }
    },
    created() {
        this.getNewBrand()
    }
}
</script>

<style lang="scss">
.welcome {
    background: url(../../assets/art/483531802.jpg) center center;
    background-size: cover;
    padding-bottom: 100px;
    .scrib {
        padding: 80px 40px 20px 40px;
        @media screen and (min-width: 768px) {
            padding: 100px 0 20px 0;
        }
    }
    .box {
        input[type="file"] {
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
        }
    }
}
</style>
