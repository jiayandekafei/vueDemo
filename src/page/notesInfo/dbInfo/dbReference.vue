<template>
  <div class="fillcontain">
    <search-item @searchList="searchList" :type=3></search-item>
    <div class="table_container">
      
  </div>
  </div>
</template>

<script>
/* eslint-disable */ 
import { mapGetters } from "vuex";
import * as mutils from "@/utils/mUtils";
import * as comUtils from "@/utils/comUtils";
import Pagination from "@/components/pagination";
import searchItem from "./components/searchItem";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      editDisable: !comUtils.isSuperUserOrPM(),
      deleteDisable: !comUtils.isSuperUserOrPM(),
      tableData: [],
      tableHeight: 0,
      loading: false,
      idFlag: false,
      isShow: false, //
      editid: '',  
      rowIds: [],
      sortnum: 0,
      addGroupDialog: {
        show: false,
        dialogRow: {}
      },
      pageData: {
        pageNo: 1,
        pageSize: 10,
        name: ''
      },
      search: {
        host:'',          
        userName:'',          
        password:'',          
        nsfPath: ""
      },
      pageTotal: 0
    };
  },
  components: {
    searchItem,
    Pagination
  },
  methods: {
    searchList(searchObj) {
      this.search = searchObj;
      this.getDBInfoList();
      },
    },

};
</script>

<style lang="less" scoped>
.table_container {
  padding: 10px;
  background: #fff;
  border-radius: 2px;
}
.el-dialog--small {
  width: 600px !important;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>


