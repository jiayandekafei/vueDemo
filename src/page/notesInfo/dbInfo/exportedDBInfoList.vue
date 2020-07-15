<template>
  <div class="fillcontain">
    <search-item @searchList="searchList" :type=1></search-item>
    <div class="table_container">
      <el-table
        class="tablelist"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        align="center"
        @selection-change="selectTable"
        @select-all="selectAll"
      >
        <el-table-column v-if="idFlag" prop="id" label="id" align="center" width="5"></el-table-column>
        <el-table-column type="selection" align="center" width="40"></el-table-column>
        <el-table-column prop="dbFileName" label="英文名" sortable  width="120"></el-table-column>
        <el-table-column prop="dbName" label="日文名" sortable width="250"></el-table-column>
        <el-table-column prop="formSize" label="form数" sortable ></el-table-column>
        <el-table-column prop="usefulFormSize" label="使用form数" sortable ></el-table-column>
        <el-table-column prop="viewSize" label="View数" sortable ></el-table-column>
        <el-table-column prop="usefulViewSize" label="使用view数" sortable ></el-table-column>
        <el-table-column prop="allCodeNum" label="代码数" sortable ></el-table-column>
        <el-table-column prop="usefulCodeNum" label="有效代码数" sortable ></el-table-column>
        <el-table-column prop="documentSize" label="文书数" sortable ></el-table-column>
        <el-table-column prop="accessCount" label="访问次数" sortable ></el-table-column>
        <el-table-column prop="operation" align="center" label="操作" width="150">
          <template slot-scope="scope">
            <!-- <el-button type="primary" icon="edit" size="mini" @click="onEditGroup(scope.row)" :disabled="editDisable" >编辑</el-button> -->
            <el-button type="primary" icon="detail" size="mini" @click="showDetail(scope.row.dbFileName)" :disabled="deleteDisable">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageTotal="pageTotal" :pageSize="pageData.pageSize" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></pagination>
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
      },
      search: {
        groupId:'',  
        enName:'',
        jpName:'',        
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
    setTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = document.body.clientHeight - 300;
      });
    },
    // 获取DB列表数据
    getDBInfoList() {
      const _this = this;
      _this.loading = true;
      const para = Object.assign({},this.pageData, this.search);
      this.$api.notesInfo.getExportedDBData(para).then(res => {
        _this.loading = false;
        _this.pageTotal = res.data.data.total;
        _this.tableData = res.data.data.dbInfo;
      });
    },

    // 显示用户弹框
    showAddGroupDialog(val) {
      this.$store.commit("SET_GROUP_DIALOG_TITLE", val);
      this.addGroupDialog.show = true;
    },
    hideaddGroupDialog() {
      this.addGroupDialog.show = false;
    },
    // 上下分页
    handleCurrentChange(val) {
      this.pageData.pageNo = val;
      this.getDBInfoList();
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.pageData.pageSize = val;
      this.getDBInfoList();
    },

    // 编辑操作方法
    onEditGroup(row) {
      this.addGroupDialog.dialogRow = row;
      this.showAddGroupDialog();
    },
    // 删除数据
    onDeleteGroup(row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.$api.group.deleteGroup(row.groupId).then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getDBInforList();
          });
        })
        .catch(() => {});
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    selectTable(val) {
      this.rowIds = val;
      this.setSearchBtn(val);
    },
    // 用户全选checkbox时触发该事件
    selectAll(val) {
      val.forEach(item => {
        this.rowIds.push(item.id);
      });
      this.setSearchBtn(val);
    },
    setSearchBtn(val) {
      let isFlag = true;
      if (val.length > 0 && comUtils.isSuperUserOrPM()) {
        isFlag = false;
      } else {
        isFlag = true;
      }
      this.$store.commit("SET_SEARCHBTN_DISABLED", isFlag);
    },
    // 判断是否显示notes info
    showNotesInfo() {
      return getToken("superuser") === "Y" ? true : false;
    },
    showDetail(name){
      this.$router.push({
        name: 'dbDetail',
        params: {
            dbName: name
        }
      })
    }
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


