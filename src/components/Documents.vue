<template lang="html">
    <div class="documents padding">
        <div class="wall">
            <div v-for="doc in docs"
                class="brick">
                <div class="card"
                    id="card-{{doc.id}}">
                    {{doc.name}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import W from 'freewall'
export default {
    data: function () {
        return {
            docs:[
                {
                    id: 1,
                    name: 'document 1'
                },
                {
                    id: 2,
                    name: 'document 2'
                },
                {
                    id: 3,
                    name: 'document 3'
                },
                {
                    id: 4,
                    name: 'document 4'
                },
                {
                    id: 5,
                    name: 'document 5'
                }
            ]
        }
    },
    computed: {},
    methods: {
        initGrid() {
            var wall = new W.Freewall(".wall")
                wall.reset({
                    selector: '.brick',
                    animate: true,
                    cellW: 200,
                    cellH: 'auto'
                })
                wall.container.find('.brick img').load(function() {
                    wall.fitWidth();
                })
                wall.fitWidth()
        },
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

<style lang="css">
</style>
