<template lang="html">
    <div class="welcome">
        <div class="column is-6-tablet is-offset-3-tablet is-4-desktop is-offset-4-desktop has-text-centered">
            <div class="scrib">
                <h1>
                    <img src="../../assets/art/scrib-w.svg" alt="Scrib" />
                </h1>
                <h2 class="subtitle">
                    {{ 'scrib.tagLine' | translate }}
                </h2>

                <div class="box">

                    <div class="brand-name" v-if="!step">
                        <p class="control has-addons">
                            <input class="input is-expanded"
                                type="text"
                                placeholder="{{ 'welcome.yourBrand' | translate }}"
                                v-model="brand.name"
                                autofocus>
                                <button class="button is-primary"
                                    :class="{ 'is-disabled': !brand.name }"
                                    @click="nextStep">
                                    {{ 'welcome.next' | translate }}
                                </button>
                        </p>
                    </div>

                    <div class="brand-logo" v-if="step == 1">
                        <input type="file"
                            name="brandlogo[]"
                            id="brandlogo"
                            v-el:brand-logo
                            @change="saveLogo" />
                        <label for="brandlogo"
                            class="button is-primary is-fullwidth"
                            :class="{ 'is-disabled': apiCall, 'is-loading': apiCall }">
                                {{ 'welcome.saveYourLogo' | translate }}
                        </label>
                    </div>

                </div>



            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            step: 0,
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
        nextStep() {
            this.step += 1
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
            console.log(brand);
            // steps
            if (brand) {
                this.brand = brand
                if (brand.description) {
                    console.log(brand.description);
                    this.step = 4
                } else if (brand.logo) {
                    console.log("logo id:" + brand.logo);
                    this.step = 3
                } else {
                    this.step = 0
                }
            }
        },
    },


  ready: function () {},
  attached: function () {},
  components: {}
}
</script>

<style lang="scss">
.welcome {
    background: url(../../assets/art/483531802.jpg) center center;
    background-size: cover;
    padding-bottom: 100px;
    .scrib {
        padding: 80px 60px 20px 60px;
        @media screen and (min-width: 768px) {
            padding: 100px 0 20px 0;
        }
    }
}
</style>
