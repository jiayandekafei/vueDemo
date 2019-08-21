<template>
  <div class="refresh" v-if="!networkSuccess">
      <h3>我断网了</h3>
      <button @click="onRefresh()">点我刷新</button>
  </div>
</template>
<script>
import {mapState } from 'vuex';
export default {
  name: '',
  data() {
    return {}
  },
  methods: {
    onRefresh(){
      this.$router.go(-1)//返回之前点击的页面
    },
  },
  computed:{
    ...mapState(['networkSuccess'])
  },
}
</script>