<template>
    <div class="templates columns">

        <div class="column is-6 ace">

            <!-- <div class="padding mf">
                <div class="form-group">
                    <input :class="{ 'has-value' : template.title }"
                        type="text"
                        v-model="template.title"
                        @input="save"/>
                    <label for="input"
                        class="control-label">
                        {{ 'doc.title' | translate }}
                    </label><i class="bar"></i>
                </div>
            </div> -->

            <ace-editor v-if="editMode"
                :content.sync="template.html"
                lang="html"
                theme="chrome"
                width="100%"
                height="100%"></ace-editor>
        </div>
        <div class="column is-6 reset">
            {{{ template.html }}}
            <pre>
                {{hasImage}}
            </pre>
        </div>

<!--


        <div class="column is-10-tablet is-offset-1-tablet is-8-desktop is-offset-2-desktop">

            <div class="padding">

            <h1 class="title padding-top has-text-centered"
                v-text="template.title || $t('doc.untitled', $store.state.settings.lang)">
            </h1>

            <div class="box">
                <div class="content mf">

                <div class="form-group">
                    <input :class="{ 'has-value' : template.title }"
                        type="text"
                        v-model="template.title"
                        @input="save"/>
                    <label for="input"
                        class="control-label">
                        {{ 'doc.title' | translate }}
                    </label><i class="bar"></i>
                </div>

                <div class="ace-wrapper">
                    <ace-editor v-if="editMode"
                        :content.sync="template.html"
                        lang="html"
                        theme="chrome"
                        width="100%"
                        height="300"></ace-editor>
                </div>
            </div>
        </div>

        {{{ template.html }}} -->

    </div>
</template>

<script>
import aceEditor from 'vue-ace-editor'
import aceHtml from 'vue-ace-editor/node_modules/brace/mode/html'
import aceChrome from 'vue-ace-editor/node_modules/brace/theme/chrome'

import {
    saveTemplate,
    updateTemplate,
    deleteTemplate
} from '../vuex/actions'

export default {
    data() {
        return {
            editMode: false,
            types: ['print', 'email'],
            template: {
                title: '',
                html: '',
                fields: []
            }
        }
    },
    computed: {
        hasTitle() {
            return ~this.template.html.indexOf('title')
        },
        hasSubtitle() {
            return ~this.template.html.indexOf('subtitle')
        },
        hasImage() {
            return ~this.template.html.indexOf('alt="image"')
        }
    },
    route: {
        data() {
            this.editMode = false
            if (this.$route.params.template != 'new') {
                this.getTemplate(parseInt(this.$route.params.template))
            } else {
                this.template = {
                    title: '',
                    html: '',
                    fields: []
                }
            }
        }
    },
    watch: {
        'template.html': function (val, oldVal) {
            // console.log('new: %s, old: %s', val, oldVal)
            if (val) {
                this.save()
            } else {
                this.editMode = true
            }
        }
    },
    components: {
        aceEditor
    },
    events:{
        'vue-ace-editor:init':function () {
            aceHtml,
            aceChrome
        }
    },
    vuex: {
        getters: {
            lokiTemplates: state => state.user.templates
        },
        actions: {
            saveTemplate: saveTemplate,
            updateTemplate: updateTemplate,
            deleteTemplate: deleteTemplate
        }
    },
    methods: {
        save(){

            if (this.hasTitle && !_.includes(this.template.fields, 'title') ) {
                this.template.fields.push('title')
            } else if (!this.hasTitle) {
                this.template.fields = _.without(this.template.fields, 'title')
            }

            if (this.hasSubtitle && !_.includes(this.template.fields, 'subtitle') ) {
                this.template.fields.push('subtitle')
            } else if (!this.hasSubtitle) {
                this.template.fields = _.without(this.template.fields, 'subtitle')
            }

            // save or update
            if (this.template.$loki) {
                this.updateTemplate(this.template)
            } else {
                this.saveTemplate(this.template)
            }
        },
        getTemplate(id) {
            var template = this.lokiTemplates.find({'$loki': id})
            if (template) {
                this.template = template[0]
            }
            this.editMode = true
        }
    }
}
</script>

<style lang="scss">
@import "../assets/reset";
.ace {
    height: 40vh;
    padding-bottom: 0 !important;
    @media screen and (min-width: 768px) {
        height: 100%;
        padding-bottom: inherit !important;
        padding-right: 0 !important;
    }
}
.reset {
    padding-top: 0 !important;
    @media screen and (min-width: 768px) {
        padding-left: 0 !important;
        padding-top: inherit !important;
    }
}
</style>
