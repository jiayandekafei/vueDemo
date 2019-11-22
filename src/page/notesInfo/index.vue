<template>
  <div class="fillcontain">
    <div class="table_container">
      
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as mutils from "@/utils/mUtils";
 import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      
    };
  },
 
  computed: {
    
  },
  mounted() {
    
  },
  methods: {
    setTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = document.body.clientHeight - 300;
      });
    },

  }
};
</script>

<style lang="less" scoped>

</style>


