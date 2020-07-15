<template>
    <div class="scaleProgress">
        <el-progress :text-inside="true" :stroke-width="28" :percentage="progressNum" :color="color"></el-progress>
    </div>
</template>
 
<script>
    export default {
        data() {
            return {
                progressNum: 1,
                startTimer: '',
                endTimer: '',
            }
        },
        props: {
            progressStatus: {
                type: Boolean,
                default() {
                    return false
                }
            },
            color: {
                type: String,
                default() {
                    return '#6f7ad3'
                }
            },
        },
        watch: {
            progressStatus (val) {
                if (val) {
                    this.endProgress()
                }
            }
        },
        methods: {
            startProgress () {
                this.startTimer = setInterval(() => {
                    this.progressNum ++
                    if (this.progressNum > 95) {
                        clearInterval(this.startTimer)
                    }
                }, 200); 
            },
            endProgress () {
                clearInterval(this.startTimer)
                this.endTimer = setInterval(() => {
                    this.progressNum ++
                    if (this.progressNum > 99) {
                        clearInterval(this.endTimer)
                    }
                }, 10);
            },
          
        },
        mounted() {
            this.startProgress()
        }
    }
  
</script>
<style scoped>
.scaleProgress {
    transform: scaleY(0.75);
}
</style>