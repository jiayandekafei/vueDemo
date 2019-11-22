<template>
  <div class="fillcontain">
    <search-item
      @showDialog="showAddGroupDialog"
      @searchList="getGroupList"
      @onBatchDelGroup="onBatchDelGroup"
    ></search-item>
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
        <el-table-column v-if="idFlag" prop="id" label="id" align="center" width="180"></el-table-column>
        <el-table-column type="selection" align="center" width="40"></el-table-column>
        <el-table-column prop="groupname" label="项目姓名" width="240"></el-table-column>
        <el-table-column prop="customername" label="客户名" width="240"></el-table-column>
        <el-table-column v-if="showNotesInfo()" prop="notes_server" label="notes服务器" width="240"></el-table-column>
        <el-table-column v-if="showNotesInfo()" prop="notes_user" label="notes服务器用户名" width="240"></el-table-column>
        <el-table-column v-if="showNotesInfo()" prop="notes_password" label="notes服务器密码" width="240"></el-table-column>
        <el-table-column prop="description" label="简介" ></el-table-column>
        <el-table-column prop="operation" align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="edit" size="mini" @click="onEditGroup(scope.row)">编辑</el-button>
            <el-button type="danger" icon="delete" size="mini" @click="onDeleteGroup(scope.row)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pageTotal="pageTotal"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination>
      <addGroupDialog
        v-if="addGroupDialog.show"
        :isShow="addGroupDialog.show"
        :dialogRow="addGroupDialog.dialogRow"
        @getGroupList="getGroupList"
        @closeDialog="hideaddGroupDialog"
      ></addGroupDialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as mutils from "@/utils/mUtils";
import SearchItem from "./components/searchItem";
import addGroupDialog from "./components/addGroupDialog";
import Pagination from "@/components/pagination";
 import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      tableData: [],
      tableHeight: 0,
      loading: true,
      idFlag: false,
      isShow: false, //
      editid: "",
      rowIds: [],
      sortnum: 0,
      addGroupDialog: {
        show: false,
        dialogRow: {}
      },
      pageData: {
        pageNo: 1,
        limit: 20,
        name: ""
      },
      pageTotal: 0,

    };
  },
  components: {
    SearchItem,
    addGroupDialog,
    Pagination
  },
  computed: {
    ...mapGetters(["search"])
  },
  mounted() {
    this.getGroupList();
  },
  methods: {
    setTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = document.body.clientHeight - 300;
      });
    },
    // 获取项目列表数据
    getGroupList() {
      const _this = this;
      const currentGroup = {
        userId: getToken('userid'),
        superuser: getToken('superuser')
      };
      const para = Object.assign({},currentGroup,this.pageData,this.search);
      this.$api.group.getGroupList(para).then(res => {
        _this.loading = false;
        _this.pageTotal = res.data.data.total;
        _this.tableData = res.data.data.groups;
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
      this.getGroupList();
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.pageData.limit = val;
      this.getGroupList();
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
      }).then(() => {
          this.$api.group.deleteGroup(row.groupId).then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getGroupList();
          });
        })
        .catch(() => {});
    },
    onBatchDelGroup() {
      this.$confirm("确认批量删除记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          const ids = this.rowIds.map(item => item.groupId).toString();
          const para = { groupIds: ids };
          this.$api.group.batchDeleteGroup(para).then(res => {
            console.log(res)
            this.$message({
              message: "批量删除成功",
              type: "success"
            });
            this.getGroupList();
          });
        })
        .catch(() => {});
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    selectTable(val) {
      this.rowIds=val;
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
      if (val.length > 0) {
        isFlag = false;
      } else {
        isFlag = true;
      }
      this.$store.commit("SET_SEARCHBTN_DISABLED", isFlag);
    },
    // 判断是否显示notes info
    showNotesInfo() {
      return getToken('superuser')=== 'Y' ? true : false
    },
  }
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


